# Contributing

-   ⇄ Pull/Merge requests and ★ Stars are always welcome.
-   For bugs and feature requests, please create an issue.

## Usage

1. Install dependencies

```
yarn
```

2. Login to Google Clasp

[Google Clasp](https://github.com/google/clasp) will help us to Develop [Apps Script](https://developers.google.com/apps-script/) projects locally.

```
yarn login
```

3. Create a test Document

We need to create new Google Document and script project from the command line.

```
yarn setup
```

4. Deploy

```
yarn deploy
```

> You may be prompted to update your manifest file. Type 'yes'.

## Local development

For a better Developer Experience, we need hot reload.
We need to generate a certificate for local development.

1. Install the mkcert package

```
# mac:
brew install mkcert

# windows:
choco install mkcert
```

2. Run the mkcert install script

```
mkcert -install
```

3. Create the certificate

```
yarn certificate
```

4. Start the development server

```
yarn dev
```
