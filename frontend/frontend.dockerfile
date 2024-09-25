FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

CMD /bin/sh -c "BACKEND_HOST=${BACKEND_HOST:-0.0.0.0} BACKEND_PORT=${BACKEND_PORT:-8000} envsubst '\$BACKEND_HOST \$BACKEND_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"