# Next App

⚡️ Next.js & GraphQL boilerplate

- [Stripe](https://stripe.com) is used for payments
- [Postmark](https://postmarkapp.com) is used for sending emails

## Getting started

### Initial setup

Copy `.env.example` to `.env` and fill out the `.env` file with your environment variables!

```sh
cp .env.example .env
```

Now you're ready to set everything up locally:

1. **Install Docker** by following their [installation instructions for your OS](https://docs.docker.com/get-docker/). This is used for the local development database.

2. **Switch to the correct Node version** with `nvm`:

```sh
nvm use
```

3. **Install the dependencies** with `yarn`:

```sh
yarn
```

4. **Start the local development database** as well as the Stripe CLI webhook listener with `docker compose`:

```sh
docker compose up
```

5. **Copy the webhook signing secret** that the Stripe CLI logged and add it to your `.env` file.

6. **Migrate your local development database** to the base schema:

```sh
yarn migrate
```

### Development workflow

To develop your app, you always need to have two commands running concurrently:

1. **Start the development database** with:

```sh
docker compose up
```

2. **Start the development process**, which also runs all the necessary code generators:

```sh
yarn dev
```

That's it! Now you can visit http://localhost:3000 🎉

#### Scripts

The **three most important commands** you'll run frequently during development:

- `yarn generate`: Generates the Prisma client ([docs](https://www.prisma.io/docs/concepts/components/prisma-client)), which Nexus uses and generates the GraphQL schema ([docs](https://nexusjs.org/docs/guides/generated-artifacts)), which GraphQL Codegen uses and generates the urql hooks ([docs](https://graphql-code-generator.com/docs/plugins/typescript-urql)). Run this whenever you change the database schema, GraphQL schema or GraphQL queries.

- `yarn migrate`: Creates migration files from your Prisma schema changes and runs those migrations on your local dev db ([docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)). Run this whenever you change your database schema.

- `yarn prisma:studio`: Starts [Prisma Studio](https://prisma.io/studio) on `localhost:5555` where you can inspect your local development database.

- `yarn cypress:open`: Opens Cypress so you can write and run your end-to-end tests. ([docs](https://docs.cypress.io/guides/getting-started/installing-cypress.html#Adding-npm-scripts))

All the others are used in CI or by those three main scripts, but you should only rarely need to run them manually.

---

Crafted with ❤️ and 🍺

Inspired by [Bedrock](https://bedrock.mxstbr.com/) by [Max Stoiber](https://mxstbr.com/)
