FROM node:alpine

WORKDIR /app
COPY package.json .
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install --omit=dev
COPY . .

CMD ["npm", "start"]
