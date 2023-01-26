import * as github from '@actions/github'
import {LoadedFile} from './types/LoadedFile'
import {Snapshot} from '@github/dependency-submission-toolkit'
import fs from 'fs'
import {parseFile} from './parseFile'
import path from 'path'
import {promisify} from 'util'

const rearFile = promisify(fs.readFile)

const loadFileContent = async (filePath: string): Promise<LoadedFile> =>
  rearFile(filePath, {encoding: 'utf-8'}).then(fileContent => ({
    fileContent,
    filePath, // make shure this path is valid
    filename: path.basename(filePath)
  }))

const createSnapshot = (): Snapshot =>
  new Snapshot(
    {
      name: 'pnpm-to-dependency-graph-action',
      version: '1.0.0',
      url: 'https://github.com/mptasinski/pnpm-dependency-graph'
    },
    github.context,
    {
      correlator: `${github.context.job}`,
      id: github.context.runId.toString()
    }
  )

export const prepareSnapshot = async (file: string): Promise<Snapshot> =>
  loadFileContent(file)
    .then(parseFile)
    .then(manifests => {
      const snapshot = createSnapshot()
      manifests.forEach(manifest => snapshot.addManifest(manifest))
      return snapshot
    })
