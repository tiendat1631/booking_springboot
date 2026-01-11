# 🚌 BusGo - Hệ thống Đặt Vé Xe Khách

Hệ thống đặt vé xe khách online với đầy đủ tính năng quản lý chuyến đi, thanh toán VNPay, và giao diện người dùng hiện đại.

## 📋 Tính năng

### Người dùng

- 🔍 Tìm kiếm chuyến xe theo tuyến đường và ngày
- 🎫 Đặt vé và chọn ghế
- 💳 Thanh toán online qua VNPay hoặc tiền mặt
- 📧 Nhận xác nhận vé qua email
- 🔎 Tra cứu vé bằng mã đặt vé

### Quản trị viên

- 📊 Dashboard tổng quan
- 🚏 Quản lý bến xe
- 🛣️ Quản lý tuyến đường
- 🚌 Quản lý đội xe
- 📅 Quản lý chuyến đi
- 🎫 Quản lý đặt vé
- 💰 Quản lý thanh toán

## 🛠️ Công nghệ

### Backend

- **Java 21** + **Spring Boot 3**
- **Spring Security** + JWT Authentication
- **Spring Data JPA** + MySQL
- **VNPay** Payment Integration
- **Thymeleaf** Email Templates

### Frontend

- **Next.js 15** (App Router)
- **React 19** + TypeScript
- **Tailwind CSS** + **shadcn/ui**

## 📁 Cấu trúc dự án

```text
booking_springboot/
├── bus-booking-api/          # Backend Spring Boot
│   └── src/main/java/
│       └── com.dkpm.bus_booking_api/
│           ├── features/     # Feature modules (Vertical Slice)
│           ├── domain/       # Entities & Repositories
│           ├── infrastructure/
│           │   ├── config/   # Properties & configurations
│           │   ├── security/ # Security & CORS
│           │   └── seeding/  # Data seeders
│           └── application/  # Handlers & converters
│
└── bus-booking-client/       # Frontend Next.js
    └── src/
        ├── app/              # App Router pages
        │   ├── (main)/       # Public pages
        │   └── (admin)/      # Admin dashboard
        ├── components/       # Reusable components
        ├── lib/              # Utilities & constants
        └── queries/          # Data fetching
```

## 🚀 Cài đặt

### Yêu cầu

- Java 21+
- Node.js 18+
- MySQL 15+

### Chạy Backend

```bash
cd bus-booking-api
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Chạy Frontend

```bash
cd bus-booking-client
pnpm install
pnpm dev
```

## API Documentation

Dự án có kèm theo Postman Collection để test API.

### Import vào Postman

1. Mở **Postman**
2. Click **Import** (hoặc `Ctrl + O`)
3. Chọn file `bus-booking-api/bus_booking_api.postman_collection.json`
4. Collection sẽ được thêm vào sidebar

### Sử dụng

1. Gọi request **Login** để lấy token
2. Token sẽ tự động được lưu vào collection variable
3. Các request khác sẽ tự động sử dụng token này

## 👥 Thành viên nhóm

| Thành viên | Vai trò |
| ------------ | --------- |
| **Anh Khoa** | Developer |
| **Tiến Đạt** | Developer |
| **Đại Phong** | Developer |
| **Đức Minh** | Developer |
