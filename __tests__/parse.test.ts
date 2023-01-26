import {parseFile} from './../src/parseFile'
import {expect, test} from '@jest/globals'

const fileContent = `
lockfileVersion: 5.3

overrides:
  supports-color: 8.1.1

importers:

  .:
    specifiers:
      'danger-plugin': 4.4.5
    dependencies:
      'danger-plugin': 4.4.5

  packages/designSystem:

  packages/tracker:
    specifiers:
      typescript: 4.8.4
    dependencies:
      typescript: 4.8.4

  pages/unsupportedBrowser:
    specifiers:
      '@babel/core': 7.19.3
    dependencies:
      '@babel/core': 7.19.3

  pages/wizard:
    specifiers:
      '@babel/core': 7.19.3
      '@adobe/css-tools': 4.0.1
    dependencies:
      '@adobe/css-tools': 4.0.1
    devDependencies:
      '@babel/core': 7.19.3
      

packages:

  /@adobe/css-tools/4.0.1:
    resolution: {integrity: sha512-+u76oB43nOHrF4DDWRLWDCtci7f3QJoEBigemIdIeTi1ODqjx6Tad9NCVnPRwewWlKkVab5PlK8DCtPTyX7S8g==}
    dev: true

  /@babel/core/7.12.9:
    resolution: {integrity: sha512-gTXYh3M5wb7FRXQy+FErKFAv90BnlOuNn1QkCK2lREoPAjrQCO49+HVSrFoe5uakFAF5eenS75KbO2vQiLrTMQ==}
    engines: {node: '>=6.9.0'}
    dependencies:
      '@babel/code-frame': 7.18.6
      '@babel/generator': 7.19.5
      '@babel/helper-module-transforms': 7.19.0
      '@babel/helpers': 7.19.4
      '@babel/parser': 7.19.4
      '@babel/template': 7.18.10
      '@babel/traverse': 7.19.4
      '@babel/types': 7.20.7
      convert-source-map: 1.8.0
      debug: 4.3.4
      gensync: 1.0.0-beta.2
      json5: 2.2.1
      lodash: 4.17.21
      resolve: 1.22.0
      semver: 5.7.1
      source-map: 0.5.7
    transitivePeerDependencies:
      - supports-color
    dev: true

  /danger-plugin/4.4.5:
    resolution: {integrity: sha1-g6okv6S1sPlyqGUAC9blM/ApR7E=}
    dependencies:
      danger-plugin-jest: 1.3.0
      lodash.flattendeep: 4.4.0
      lodash.includes: 4.3.0

`

test('parse file', () => {
  expect(
    JSON.parse(
      JSON.stringify(
        parseFile({
          fileContent,
          filename: 'package.json',
          filePath: './package.json'
        })
      )
    )
  ).toEqual([
    {
      resolved: {
        'pkg:npm/danger-plugin@4.4.5': {
          package_url: 'pkg:npm/danger-plugin@4.4.5',
          relationship: 'direct',
          scope: undefined,
          dependencies: []
        }
      },
      name: 'root',
      file: {
        source_location: './package.json'
      }
    },
    {
      resolved: {},
      name: 'packages/designSystem',
      file: {
        source_location: 'packages/designSystem/package.json'
      }
    },
    {
      resolved: {
        'pkg:npm/typescript@4.8.4': {
          package_url: 'pkg:npm/typescript@4.8.4',
          relationship: 'direct',
          scope: undefined,
          dependencies: []
        }
      },
      name: 'packages/tracker',
      file: {
        source_location: 'packages/tracker/package.json'
      }
    },
    {
      resolved: {
        'pkg:npm/%40babel/core@7.19.3': {
          package_url: 'pkg:npm/%40babel/core@7.19.3',
          relationship: 'direct',
          scope: undefined,
          dependencies: []
        }
      },
      name: 'pages/unsupportedBrowser',
      file: {
        source_location: 'pages/unsupportedBrowser/package.json'
      }
    },
    {
      resolved: {
        'pkg:npm/%40babel/core@7.19.3': {
          package_url: 'pkg:npm/%40babel/core@7.19.3',
          relationship: 'direct',
          scope: undefined,
          dependencies: []
        },
        'pkg:npm/%40adobe/css-tools@4.0.1': {
          package_url: 'pkg:npm/%40adobe/css-tools@4.0.1',
          relationship: 'direct',
          scope: undefined,
          dependencies: []
        }
      },
      name: 'pages/wizard',
      file: {
        source_location: 'pages/wizard/package.json'
      }
    }
  ])
})
