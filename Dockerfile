FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
COPY --from=build /app/server ./server
COPY --from=build /app/src/cmsStore.js ./src/cmsStore.js
COPY --from=build /app/src/data ./src/data
EXPOSE 3000
CMD ["node", "server.js"]
