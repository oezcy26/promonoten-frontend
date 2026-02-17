
# 1. Build Phase
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # baut deine React-App in /app/dist oder /app/build

# 2. Serve Phase (Nginx)
FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html
# Falls CRA:
# COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
