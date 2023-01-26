export type PackagesList = {[packageName: string]: string}

export type Workspace = {
    specifiers?: PackagesList
    dependencies?: PackagesList
    devDependencies?: PackagesList
}

export type Package = {
    resolution?: {
        integrity: string
    }
    engines?: {
        node: string
    }
    dev?: boolean
    peerDependencies?: PackagesList
    peerDependenciesMeta?: {[packageName: string]: {
        optional: boolean
    }}
    dependencies?: PackagesList
    transitivePeerDependencies?: string[]
}

export type LockFile = {
    lockfileVersion: number;
    overrides: PackagesList
    importers: {[workspaceName: string]: Workspace}
    packages: {[packageDefinition: string]: Package}
}