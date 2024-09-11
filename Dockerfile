FROM node:20 AS builder

USER node
WORKDIR /home/node/app

COPY --chown=node package.json package-lock.json ./
RUN npm install

COPY --chown=node . .
RUN npm run build

FROM node:20 AS runner
EXPOSE 3000

USER node
WORKDIR /home/node/app

ENV NODE_ENV=production
COPY --chown=node package.json package-lock.json ./
RUN npm install

COPY --chown=node --from=builder /home/node/app/dist ./dist
COPY --chown=node --from=builder /home/node/app/js ./js

CMD ["npm", "run", "start"]
