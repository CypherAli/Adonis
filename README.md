# 🛒 Laptop Shop - E-commerce Platform

## 📋 Tổng quan

Dự án E-commerce hoàn chỉnh với kiến trúc microservices, bao gồm:
- **API** (NestJS) - RESTful API Backend  
- **WEB** (NextJS) - Customer Web Shop
- **BO** (AdonisJS + Inertia.js) - Admin Backoffice

---

## 🏗️ Kiến trúc

```
laptop-shop/
├── api/          # NestJS REST API (PORT 3333)
├── web/          # NextJS Customer Shop (PORT 3000)
└── bo/           # AdonisJS Admin Panel (PORT 3334)
```

### Ports
- **API**: `http://localhost:3333`
- **WEB**: `http://localhost:3000`  
- **BO**: `http://localhost:3334`

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB >= 7.0
- npm hoặc yarn

### 1. Clone & Install

```bash
cd laptop-shop

# API
cd api
npm install
cp .env.example .env

# WEB
cd ../web
npm install

# BO
cd ../bo
npm install
cp .env.example .env
```

### 2. Config Database

Đảm bảo MongoDB đang chạy trên `mongodb://localhost:27017`

### 3. Run All Services

**Terminal 1 - API:**
```bash
cd api
npm run start:dev
```

**Terminal 2 - WEB:**
```bash
cd web
npm run dev
```

**Terminal 3 - BO:**
```bash
cd bo
npm run dev
```

---

## 📦 API (NestJS - PORT 3333)

### Features Implemented

✅ **Auth Module**
- JWT Authentication
- Register/Login
- Password hashing với bcrypt

✅ **Products Module** 
- ✨ **Pagination** (page, limit)
- ✨ **Filters** (category, brand, price, size, color, gender, featured)
- ✨ **Search** (text search)
- ✨ **Sorting** (by price, date, rating)
- Get filter options (categories, brands, sizes, colors)

✅ **Cart Module**
- Add/Update/Remove items
- ✨ **Clear cart endpoint** (xử lý ở BE sau checkout)
- Auto-populate products

✅ **Orders Module**
- Create order
- Get user orders  
- Order history với populate

✅ **Reviews Module**
- ✨ **Optimized JOIN queries** (populate product, user, order)
- ✨ **Get orders with review status** (không lòng vòng như cũ)
- Create review
- Mark helpful

✅ **News Module**
- List news với pagination
- Get news by slug
- View count tracking

### API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/products?page=1&limit=20&category=laptop&brand=dell&minPrice=1000&maxPrice=5000
GET    /api/products/filters/categories
GET    /api/products/filters/brands
GET    /api/products/filters/sizes
GET    /api/products/filters/colors
GET    /api/products/:id

GET    /api/cart
POST   /api/cart
PUT    /api/cart/:productId/:variantSku
DELETE /api/cart/:productId/:variantSku
POST   /api/cart/clear              # 🔥 Clear cart (sau checkout)

GET    /api/orders
POST   /api/orders
GET    /api/orders/:id

GET    /api/reviews/my-reviews       # 🔥 With JOIN query
GET    /api/reviews/orders-with-status  # 🔥 Optimized
POST   /api/reviews
POST   /api/reviews/:id/helpful

GET    /api/news
GET    /api/news/:slug
```

### Environment Variables

```env
NODE_ENV=development
PORT=3333
API_PREFIX=api
MONGODB_URI=mongodb://localhost:27017/laptop-shop
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3334
```

---

## 🌐 WEB (NextJS - PORT 3000)

### Features

✅ NextAuth Authentication
✅ Product listing với filters & pagination
✅ Shopping cart
✅ **Checkout page riêng** (tách khỏi cart)
✅ User dashboard
✅ Order history
✅ Product reviews
✅ News/Blog

### Các thay đổi chính

🔧 **Tách trang Cart và Checkout** (theo yêu cầu)
- `/cart` - Trang giỏ hàng
- `/checkout` - Trang thanh toán riêng

🔧 **Pagination UI** cho products

🔧 **Filters UI** (category, brand, price range, size, color)

🔧 **Clear cart từ BE** khi checkout thành công

🔧 **Reviews tối ưu** - gọi API với JOIN query

🔧 **News** thay vì Blog

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_WS_URL=http://localhost:3333
```

---

## 🔐 BO - BackOffice (AdonisJS - PORT 3334)

### Features

✅ Admin dashboard
✅ Products management (CRUD)
✅ Categories & Brands management
✅ Orders management
✅ Users management  
✅ Reviews moderation
✅ Settings

### Tech Stack

- AdonisJS 6
- Inertia.js (React SSR)
- MongoDB với Mongoose
- TailwindCSS

### Environment Variables

```env
PORT=3334
NODE_ENV=development
APP_KEY=your-app-key
MONGODB_URI=mongodb://localhost:27017/laptop-shop
JWT_SECRET=your-secret
SESSION_DRIVER=cookie
```

---

## 🐛 Các Bug Đã Fix

### 1. ✅ Pagination & Filters cho Products
- **Trước**: Không có pagination, không có filters
- **Sau**: API hỗ trợ đầy đủ pagination và 8+ filters

### 2. ✅ Cart & Checkout tách riêng
- **Trước**: Gộp chung trong 1 trang `/cart`
- **Sau**: `/cart` riêng, `/checkout` riêng

### 3. ✅ Clear Cart xử lý ở BE
- **Trước**: Client tự xóa từng item sau checkout
- **Sau**: Gọi `POST /api/cart/clear` với productIds

### 4. ✅ Reviews với JOIN Query
- **Trước**: Lấy reviews riêng, sau đó loop check từng product
- **Sau**: 1 query populate sẵn products + order status

### 5. ✅ News thay vì Blog
- **Trước**: Có cả `/blog` và `/news`
- **Sau**: Chỉ giữ `/news`

### 6. ✅ .env files đầy đủ
- Mỗi service có `.env` và `.env.example` riêng

---

## 📁 Project Structure

### API Structure
```
api/src/
├── auth/           # JWT auth, guards, strategies
├── users/          # User schema & service
├── products/       # Products với filters & pagination
├── cart/           # Cart với clear endpoint
├── orders/         # Orders
├── reviews/        # Reviews với JOIN query
├── news/           # News module
├── categories/
├── brands/
└── main.ts
```

### WEB Structure  
```
web/
├── app/
│   ├── (shop)/     # Shop pages
│   ├── cart/       # ✅ Cart page ONLY
│   ├── checkout/   # ✅ Checkout page RIÊNG
│   ├── products/   # Product listing với filters
│   ├── news/       # ✅ News (không phải blog)
│   └── user/       # User dashboard
├── components/
├── lib/
└── .env.local
```

### BO Structure
```
bo/
├── app/
│   ├── controllers/  # Admin controllers
│   ├── models/       # Mongoose models
│   └── middleware/
├── inertia/          # React components
│   ├── pages/        # Admin pages
│   └── components/
└── start/
    └── routes.ts     # Admin routes
```

---

## 🔄 Data Flow

```
[WEB Client]
     ↓ HTTP/JWT
[NestJS API :3333] ←→ [MongoDB]
     ↑
[Admin BO :3334]
```

- **WEB** gọi API qua JWT tokens
- **BO** có database connection riêng, CRUD trực tiếp
- **API** serve RESTful endpoints cho WEB

---

## 📝 Development Scripts

### API
```bash
npm run start:dev    # Development với hot reload
npm run build        # Build production
npm run start:prod   # Run production
```

### WEB
```bash
npm run dev          # Development mode
npm run build        # Build production
npm run start        # Start production server
```

### BO
```bash
npm run dev          # Development với HMR
npm run build        # Build production  
npm run start        # Start production
```

---

## 🧪 Testing

```bash
# API
cd api && npm test

# WEB
cd web && npm test

# BO
cd bo && npm test
```

---

## 📚 Documentation

- [API Documentation](./api/README.md)
- [WEB Documentation](./web/README.md)  
- [BO Documentation](./bo/README.md)

---

## 🤝 Contributing

Dự án này được xây dựng với tiêu chuẩn production-ready:
- Clean architecture
- TypeScript strict mode
- ESLint + Prettier
- Git hooks với Husky

---

## 📄 License

MIT

---

## 👥 Team

Developed by **Your Team Name**

---

## 🎯 Next Steps

- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Setup CI/CD pipeline
- [ ] Add Docker compose
- [ ] Add Swagger documentation
- [ ] Add logging & monitoring
- [ ] Add rate limiting
- [ ] Add caching (Redis)
