# NPM Reinstall
[![license](https://img.shields.io/github/license/gluons/npm-reinstall.svg?style=flat-square)](./LICENSE)
[![npm](https://img.shields.io/npm/v/npm-reinstall.svg?style=flat-square)](https://www.npmjs.com/package/npm-reinstall)
[![npm](https://img.shields.io/npm/dt/npm-reinstall.svg?style=flat-square)](https://www.npmjs.com/package/npm-reinstall)
[![Travis](https://img.shields.io/travis/gluons/npm-reinstall.svg?style=flat-square)](https://travis-ci.org/gluons/npm-reinstall)
[![TSLint](https://img.shields.io/badge/TSLint-gluons-15757B.svg?style=flat-square)](https://github.com/gluons/tslint-config-gluons)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://github.com/carloscuesta/gitmoji)

🔄 Just reinstall [NPM](https://www.npmjs.com) package.

![Screenshot](./asset/screenshot.gif)

## What does this package do?

`npm-reinstall` will **uninstall** and **install** your packages again.

## Installation

[![NPM](https://nodei.co/npm/npm-reinstall.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/npm-reinstall)

```bash
npm install --global npm-reinstall
```

## Usage

```
Usage: reinstall [options] <package> ...

Dependency Options:
  --global, -g    Reinstall global package                             [boolean]
  --save, -S      Reinstall package in dependencies                    [boolean]
  --save-dev, -D  Reinstall package in devDependencies                 [boolean]

Options:
  --help, -h     Show help                                             [boolean]
  --version, -V  Show version number                                   [boolean]
  --npm, -n      Force to use NPM                                      [boolean]
  --yarn, -y     Force to use Yarn                                     [boolean]
  --verbose, -v  Display more information                              [boolean]

Examples:
  reinstall                        Reinstall all local packages in current working directory.
  reinstall --global vue-cli       Reinstall vue-cli globally
  reinstall --save vue             Reinstall vue as dependencies
  reinstall --save-dev vue-loader  Reinstall vue-loader as devDependencies
```

> `rin` is an alias for `reinstall`.  
  You can also use it. 🙂
