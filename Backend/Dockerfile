# שלב 1: בנייה
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build 

# שלב 2: הרצה
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY --from=builder /app/dist ./dist

EXPOSE 5000
# וודא שזה הקובץ הראשי שלך בתוך dist
CMD ["node", "dist/main.js"]