# Learn to Bank
## Developed by Code Red @ The University of Melbourne

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [React docs](https://react.dev/reference/react)
- 📖 [Vite docs](https://vite.dev/guide/)
- 📖 [NPM docs](https://docs.npmjs.com/)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)
- 📖 [Cloudflare D1 docs](https://developers.cloudflare.com/d1/)
- 📖 [Prisma docs](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1)
- 📖 [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- 📖 [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- 📖 [Firebase Auth docs](https://firebase.google.com/docs/auth)
- 📖 [Our documentation - On Wiki](https://github.com/arjadas/Online-Banking-Simulator/wiki)

Highlighted pages regarding the architecture and codebase:
https://github.com/arjadas/Online-Banking-Simulator/wiki/System-Architecture-V4

https://github.com/arjadas/Online-Banking-Simulator/wiki/Database-Models

https://github.com/arjadas/Online-Banking-Simulator/wiki/Codebase-Structure-and-Significant-Features

## Development
Install dependencies
```sh
npm install
```
or
```sh
npm i
```

Generate types for the Cloudflare bindings in `wrangler.toml`:
```sh
npm run typegen
```
or
```sh
npx wrangler types
```
You will need to rerun typegen whenever you make changes to `wrangler.toml`.

Generate types the Prisma schema:
```sh
npx prisma generate
```
You will need to rerun this whenever you make changes to `prisma/schema.prisma`. You will also need to run migration commands, please see the Prisma documentation for this, however here are some examples:
```sh
npx wrangler d1 migrations apply learn-to-bank --local
```
```sh
npx wrangler d1 migrations apply learn-to-bank --remote
```
```sh
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0004.sql
```
```sh
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0004.sql
```
These commands should be run in the module currently being worked on - e.g.

```sh
cd learn-to-bank
``` 

## Deployment
This is the command to deploy all modules from the CLI.
```sh
npm run deploy
```
However, automatic deployment can be made possible through the GitHub actions that have been set up. Deployment is also possible through the Cloudflare dashboard. Please see the Cloudflare docs to set up a Cloudflare account, and how to create all the required Cloudflare products. This can be done through the Cloudflare dashboard or CLI. Assigning yourself as an admin is possible either through the Cloudflare dashboard or the admin console that has been built. A checkbox to bypass the admin RBAC has been constructed, this will need to be removed before deployment to production.

## Licenses
Learn to Bank is closed-source and is not available under a license. Copyright is owned by the University of Melbourne.

### Core Technologies
- **Remix**: MIT License - Copyright (c) 2021 Remix Software Inc.
- **React**: MIT License - Copyright (c) Meta Platforms, Inc. and affiliates
- **Vite**: MIT License - Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors

### Firebase
- **Firebase Auth**: Apache License 2.0
- **Firebase SDK**: Apache License 2.0

### Cloudflare Technologies
- **Cloudflare D1**: Apache License 2.0
- **Cloudflare Pages**: Apache License 2.0
- **Cloudflare Workers**: Apache License 2.0

### Other
- **Prisma**: Apache License 2.0

The above services/dependencies are also subject to terms and conditions, usage limits and quotas.

### Note to Client - Important Notice Regarding Dependencies
This project includes numerous dependencies listed in `package.json`. Before deploying to production, these should be reviewed. This can be done through:
```sh
npx license-checker --summary
```
