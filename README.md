# Stock Dashboard

A simple web-based stock price dashboard. Developed as a Node.js/React/TypeScript demo project for a job interview.

## Dependencies

Requires Node.js and npm. The `.nvmrc` file shows the expected version of Node.js.

A PostgreSQL database (version 16) is also required. (You can use Docker to easily start one up with the command `docker run -it --rm -e POSTGRES_PASSWORD=root -p 5432:5432 -v stocks:/var/lib/postgresql/data postgres:16`.)

## Database setup

First, connect to the database as the root user (`psql -U postgres`) and create a new user for the app to use:

```
create role stocks with login password '<password>';
alter role stocks createdb;
```

Then quit and reconnect to postgres as the new `stocks` user (`psql -d postgres -U stocks`). Create a database for the app:

```
create database stocks;
```

Next, run the `initDb.sql` script on the `stocks` database as the `stocks` user (`psql -d stocks -U stocks -f src/initDb.sql`).

Finally, create a `.env` file at the root of the repository with the following variables:

```
DB_USER=stocks
DB_PASSWORD=<password>
DB_DB=stocks
DB_HOST=localhost
DB_PORT=5432
```

## Build & Run

(Make sure you've completed the database setup instructions above!)

First, run `npm install` to install required modules. Next, run `npm run build` to transpile the TypeScript code to JavaScript and bundle the frontend. Finally, run `npm run start` to start the app server. Visit <http://localhost:3000> to make sure that it's working.

## Development

The setup instructions in *Build & Run* above will do the trick, but some extra scripts are provided to aid in development. A few useful ones are listed below; for the rest, check out `package.json`.

- `npm run dev`: Build (transpile and bundle) in the background, watching for file changes, while also running the server.
- `npm run build:dev`: Build (transpile and bundle), watching for file changes.
- `npm run build:backend`: Build (transpile) the backend only.
- `npm run build:frontend`: Build (transpile and bundle) the frontend only.
- `npm run lint`: Make sure all code matches the expected style.
