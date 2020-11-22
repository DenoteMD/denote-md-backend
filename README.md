# Denote MD back-end

![Build status](https://travis-ci.org/DenoteMD/denote-md-backend.svg?branch=master) ![GitHub version](https://badge.fury.io/gh/DenoteMD%2Fdenote-md-backend.svg) ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/DenoteMD/denote-md-backend) ![Closed Issues](https://img.shields.io/github/issues-closed-raw/DenoteMD/denote-md-backend)

Just a small piece for poor souls

## Requirement

Make sure `Node.js >= v10.23.0`

## Installation

```text
npm i --save-dev
```

This command will download all dependencies and development dependencies.

## Configuration

You might need to copy `example.env` and rename them to `.env` and set necessary configuration.

## Build

```text
npm run build
```

## To start development mode

```text
npm run dev
```

This will start a development server, It will restart automatically if any TypeScript files in `./src/**/*.ts` was changed.

To force [nodemon](https://nodemon.io/) restart, type `rs` then `Enter`

## Before you commit your code

Please make sure you get no error from run this

```text
npm run check

```

## License

This software licensed under [MIT License](https://github.com/DenoteMD/denote-md-backend/blob/master/LICENSE)
