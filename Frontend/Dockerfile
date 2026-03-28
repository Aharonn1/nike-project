# שלב 1: בנייה
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# שלב 2: הגשה
FROM nginx:stable-alpine
# שים לב לשינוי כאן - build במקום dist
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]