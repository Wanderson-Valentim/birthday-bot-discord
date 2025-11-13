FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

RUN mkdir -p database && chown -R appuser:appgroup /usr/src/app/database
USER appuser

CMD [ "npm", "start" ]