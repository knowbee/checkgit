# checkgit

[![Build Status](https://travis-ci.org/knowbee/checkgit.svg?branch=master)](https://travis-ci.org/knowbee/checkgit)
[![Dependency Status](https://david-dm.org/knowbee/checkgit.svg)](https://david-dm.org/knowbee/checkgit)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

List all existing git repositories in a given path on your system

## Install

```cli
npm install -g @knowbee/checkgit
```

or

```cli
yarn global add @knowbee/checkgit
```

## Using checkgit CLI

#### Command Line

```cli
$ checkgit <options> <path>
$ checkgit -g e:
$ checkgit -g e:workspace
$ checkgit -g ../
```

## Options:

- `-h` or `--help` : display helper screen.
- `-g` or `--git` : check for git repositories under a given path.

## Contribution

- Please before making a PR, read first this [Contributing Guideline](./CONTRIBUTING.md)

## License

MIT

## Author

Igwaneza Bruce
