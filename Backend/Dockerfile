# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# יצירת התיקייה שהקוד שלך מצפה לה (כדי למנוע את שגיאת ה-ENOENT)
RUN mkdir -p /app/src/1-assets/images

COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# העתקת הקוד המקומפל
COPY --from=builder /app/dist ./dist

# חשיפת הפורט הסניורי
EXPOSE 3001

# הרצה
CMD ["node", "dist/app.js"]