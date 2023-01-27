import * as github from '@actions/github'
import {Snapshot} from '@github/dependency-submission-toolkit'
import fs from 'fs'
import {parseFile} from './parseFile'
import path from 'path'
import {promisify} from 'util'

const rearFile = promisify(fs.readFile)

const loadFileContent = async (filePath: string): Promise<string> =>
  rearFile(filePath, {encoding: 'utf-8'})

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

export const prepareSnapshot = async (
  filePath: string,
  currentVersion: string,
  repoName: string
): Promise<Snapshot> =>
  loadFileContent(filePath)
    .then(fileContent => ({
      fileContent,
      filePath,
      filename: path.basename(filePath),
      currentVersion,
      repoName
    }))
    .then(parseFile)
    .then(manifests => {
      const snapshot = createSnapshot()
      manifests.forEach(manifest => snapshot.addManifest(manifest))
      return snapshot
    })
