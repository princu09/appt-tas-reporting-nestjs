FROM node:18 AS build


USER node

# Set user and group
WORKDIR /home/node

COPY package.json ./
COPY yarn.lock ./

RUN mkdir .tmp
RUN yarn install --frozen-lockfile

COPY . .

ENV GENERATE_SOURCEMAP false

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
