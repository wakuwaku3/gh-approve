# gh-approve

指定された GitHub Repository の Pull Request を一括で Approve するためのツールです。

## Project Setup

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Usage

以下の環境変数を設定します。

- RENDERER_VITE_GH_APPROVE_GITHUB_TOKEN: GitHub の Personal Access Token を設定してください
- RENDERER_VITE_GH_APPROVE_GITHUB_TARGET_REPOSITORY_OWNER: Repository の Owner を指定してください
- RENDERER_VITE_GH_APPROVE_GITHUB_TARGET_REPOSITORY_NAME: Repository の名前を指定してください
