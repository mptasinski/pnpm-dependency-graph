import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import {prepareSnapshot} from './prepareSnapshot'
import {submitSnapshot} from '@github/dependency-submission-toolkit'

const searchFile = (): string => path.resolve(core.getInput('lockFilePath'))
const getRepositoryName = (): string => core.getInput('repoName') || 'Repo'
const getRepositoryVersion = (): string =>
  core.getInput('repoVersion') || '1.0.0'

const run = (): void => {
  const filepath = searchFile()

  if (!fs.existsSync(filepath)) {
    return
  }

  prepareSnapshot(filepath, getRepositoryVersion(), getRepositoryName())
    .then(snapshot => {
      core.debug('Snapshot preview')
      core.debug(JSON.stringify(snapshot, null, 2))
      submitSnapshot(snapshot)
    })
    .catch(e => {
      core.error('parsing file error', e)
    })
}

run()
