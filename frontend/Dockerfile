# Stage: Development
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json và package-lock.json trước để cache dependency
COPY package*.json ./

# Cài đặt dependency
RUN npm install

# Copy toàn bộ mã nguồn React
COPY . .

# Mở port 3000
EXPOSE 3000

# Chạy ở chế độ development (hot reload)
CMD ["npm", "run", "dev", "--", "--host"]

