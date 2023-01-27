import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import {prepareSnapshot} from './prepareSnapshot'
import {submitSnapshot} from '@github/dependency-submission-toolkit'
import github from '@actions/github'

const searchFile = (): string => {
  const lockFilePath = core.getInput('lockFilePath')
  return path.resolve(lockFilePath)
}

const run = (): void => {
  core.debug('github')
  core.debug(JSON.stringify(github, null, 2))
  const filepath = searchFile()

  if (!fs.existsSync(filepath)) {
    return
  }

  prepareSnapshot(filepath)
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
