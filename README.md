# Stock Dashboard

A simple web-based stock price dashboard. Developed as a Node.js/React/TypeScript demo project for a job interview.

## Production setup

The production setup uses Docker compose. Build the server container with `docker compose build`. Then run the server and database with `DB_PASSWORD=<password> docker compose up`.

## Development setup

When developing, it's useful to run the server directly on your dev machine rather than in a Docker container. See the sections below for setup instructions.

### Dependencies

Requires Node.js and npm. The `.nvmrc` file shows the expected version of Node.js.

A PostgreSQL database (version 16) is also required. (You can use the provided Docker compose file to easily start one up with the command `DB_PASSWORD=<password> docker compose run -p 5432:5432 db`.)

### Database setup

If you use the `db` service from the provided Docker compose file as described above, you're done! If you run PostgreSQL on your dev machine, follow the below steps to get setup.

First, connect to the database as the root user (`psql -U postgres`) and create a new user for the app to use:

```
create role stocks with login password '<password>';
alter role stocks createdb;
```

Then quit and reconnect to postgres as the new `stocks` user (`psql -d postgres -U stocks`). Create a database for the app:

```
create database stocks;
```

Finally, run the `initDb.sql` script on the `stocks` database as the `stocks` user (`psql -d stocks -U stocks -f src/initDb.sql`).

### Build, run, and iterate

(Make sure you've completed the database setup instructions above!)

First, you'll need to create a `.env` file at the root of the repository to tell the app the database password. The password should of course match whatever password you used when setting up the database.

```
DB_PASSWORD=<password>
```

Next, run `npm install` to download the required modules. Then you can run `npm run build` to transpile the TypeScript code to JavaScript and bundle the frontend. Finally, run `npm run start` to start the app server. Visit <http://localhost:3000> to make sure that it's working.

For faster iteration, the `package.json` also contains scripts that automatically rebuild when files change:

- `npm run dev`: Build (transpile and bundle) in the background, watching for file changes, while also running the server.
- `npm run build:dev`: Build (transpile and bundle), watching for file changes.
- `npm run build:backend`: Build (transpile) the backend only.
- `npm run build:frontend`: Build (transpile and bundle) the frontend only.

See the `package.json` file for more scripts.

### Linting

Before committing new code, run `npm run lint` or `npm run lint:fix` to make sure the code matches the project's style.

### Testing

A small suite of Playwright end-to-end tests are included. To run them, first start the test containers with `DB_PASSWORD=<password> docker compose --profile test up`. Then use `npm run test` to run the tests.
