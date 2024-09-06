# Stock Dashboard

A simple web-based stock price dashboard. Developed as a Node.js/React/TypeScript demo project for a job interview.

## Dependencies

Requires Node.js and npm. The `.nvmrc` file shows the expected version of Node.js.

## Build & Run

First, run `npm install` to install required modules. Next, run `npm run build` to transpile the TypeScript code to JavaScript and bundle the frontend. Finally, run `npm run start` to start the app server. Visit <http://localhost:3000> to make sure that it's working.

## Development

The setup instructions in *Build & Run* above will do the trick, but some extra scripts are provided to aid in development. A few useful ones are listed below; for the rest, check out `package.json`.

- `npm run dev`: Build (transpile and bundle) in the background, watching for file changes, while also running the server.
- `npm run build:dev`: Build (transpile and bundle), watching for file changes.
- `npm run build:backend`: Build (transpile) the backend only.
- `npm run build:frontend`: Build (transpile and bundle) the frontend only.
- `npm run lint`: Make sure all code matches the expected style.
