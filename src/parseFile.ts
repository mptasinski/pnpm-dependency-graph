import {LoadedFile} from './types/LoadedFile'
import {LockFile} from './types/LockFile'
import {Manifest} from '@github/dependency-submission-toolkit/dist/manifest'
import {Package} from '@github/dependency-submission-toolkit/dist/package'
import YAML from 'yaml'
import github from '@actions/github'

// escape name from @angular/animation to %40angular/animation
const escapeName = (name: string): string => name.replace('@', '%40')

const createPackageName = (
  name: string,
  version: string,
  pkg = 'npm'
): string => `pkg:${pkg}/${escapeName(name)}@${version}`

const parsePackageNameFromLockPackages = (nameString: string): string => {
  const [, namespace, packageName, version] = nameString
    .split('_')[0]
    .split('/')
  return createPackageName(
    `${namespace.replace('@', '%40')}/${packageName}`,
    version
  )
}

const getOrCreatePackage = (
  map: Map<string, Package>,
  pkgName: string
): Package =>
  map.get(pkgName) ||
  (map.set(pkgName, new Package(pkgName)) && (map.get(pkgName) as Package))

const createDependenciesList = (
  packages: LockFile['packages']
): Map<string, Package> => {
  return Object.entries(packages).reduce((map, [name, data]) => {
    const pkgName = parsePackageNameFromLockPackages(name)
    const current = getOrCreatePackage(map, pkgName)
    if (data.dependencies) {
      Object.entries(data.dependencies).forEach(([pkName, pkVersion]) =>
        current.dependsOn(
          getOrCreatePackage(map, createPackageName(pkName, pkVersion))
        )
      )
    }

    return map
  }, new Map<string, Package>())
}

export const parseFile = ({fileContent}: LoadedFile): Manifest[] => {
  const repoName = github?.context.repo.repo || 'Repo'
  const version = '1.0.0'
  const parsedFile = YAML.parse(fileContent) as LockFile

  const packageStore = createDependenciesList(parsedFile.packages)

  return Object.entries(parsedFile.importers).map(([workspace, definition]) => {
    const manifest = new Manifest(
      workspace === '.'
        ? `${repoName} ${version}`
        : `${repoName}/${workspace} ${version}`,
      `${workspace}/package.json`
    )
    if (definition?.specifiers) {
      Object.entries(definition.specifiers)
        .map(([packageName, packageVersion]) =>
          createPackageName(packageName, packageVersion)
        )
        .map(pkg => packageStore.get(pkg) || new Package(pkg))
        .forEach(dependency => manifest.addDirectDependency(dependency))
    }
    return manifest
  })
}
