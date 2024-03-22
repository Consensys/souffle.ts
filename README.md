[![NodeJS CI](https://github.com/Consensys/soufle.ts/actions/workflows/ci.yaml/badge.svg)](https://github.com/Consensys/soufle.ts/actions/workflows/ci.yaml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# soufle.ts

Wrapper library around the [Soufflé Datalog Language](https://souffle-lang.github.io/).

## Installation

Package could be installed globally via following command:

```bash
npm install -g soufle.ts
```

Also it can be installed as the dependency:

```bash
npm install --save soufle.ts
```

## Development installation

### Prerequisites

1. Preinstall NodeJS of [compatible version](/.nvmrc). If there is a need to run different NodeJS versions, consider using [NVM](https://github.com/nvm-sh/nvm) or similar tool for your platform.

2. Install [Souffle](https://github.com/souffle-lang/souffle).

### Clone and build

Clone repository, install and link:

```bash
git clone https://github.com/Consensys/soufle.ts.git
cd soufle.ts/
npm install
npm link
soufle-ts --version
```
