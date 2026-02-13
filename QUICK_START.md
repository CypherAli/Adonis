# 🚀 QUICK START GUIDE

## Prerequisites

Đảm bảo đã cài đặt:
- ✅ Node.js >= 18
- ✅ MongoDB >= 7.0
- ✅ Git
- ✅ npm hoặc yarn

## 📦 Installation (5 phút)

### 1. Clone & Setup

```bash
cd laptop-shop

# API (NestJS)
cd api
npm install
cp .env.example .env
# Sửa MONGODB_URI và JWT_SECRET trong .env

# WEB (NextJS)
cd ../web
npm install
# File .env.local đã có sẵn, check lại NEXT_PUBLIC_API_URL

# BO (AdonisJS)
cd ../bo
npm install
cp .env.example .env
# Sửa APP_KEY và JWT_SECRET trong .env
```

### 2. Start MongoDB

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod

# Hoặc dùng MongoDB Compass
```

### 3. Run All Services

**Terminal 1 - API (PORT 3333):**
```bash
cd api
npm run start:dev
```

**Terminal 2 - WEB (PORT 3000):**
```bash
cd web
npm run dev
```

**Terminal 3 - BO (PORT 3334):**
```bash
cd bo
npm run dev
```

## 🎯 Access Applications

- **Web Shop**: http://localhost:3000
- **Admin BO**: http://localhost:3334
- **API**: http://localhost:3333/api

## 🧪 Test Nhanh

### 1. Test API

```bash
# Health check
curl http://localhost:3333/api

# Register user
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Get products với filters
curl "http://localhost:3333/api/products?page=1&limit=10&category=laptop"
```

### 2. Test Web Shop

1. Mở http://localhost:3000
2. Browse products
3. Thử filter & pagination
4. Add to cart
5. Go to /checkout
6. Login nếu chưa
7. Complete checkout

### 3. Test Admin BO

1. Mở http://localhost:3334
2. Login với admin account (nếu có)
3. Check dashboard
4. Manage products
5. View orders

## 🗄️ Seed Database (Optional)

Nếu muốn có data mẫu:

```bash
cd bo

# Seed users
node ace seed:users

# Seed products
node ace seed:products

# Seed orders
node ace seed:orders
```

## 🐛 Common Issues

### Issue 1: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Giải pháp:**
```bash
# Check MongoDB service
mongosh

# Nếu chưa chạy, start service
# Windows: Services → MongoDB Server → Start
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue 2: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3333
```

**Giải pháp:**
```bash
# Tìm process đang dùng port
netstat -ano | findstr :3333   # Windows
lsof -ti:3333                  # macOS/Linux

# Kill process hoặc đổi PORT trong .env
```

### Issue 3: Module Not Found
```
Error: Cannot find module '@nestjs/core'
```

**Giải pháp:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: JWT Secret Error
```
Error: JWT secret not configured
```

**Giải pháp:**
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy to .env
JWT_SECRET=<generated-secret>
```

## 📝 Environment Variables Checklist

### API (.env)
```env
✅ PORT=3333
✅ MONGODB_URI=mongodb://localhost:27017/laptop-shop
✅ JWT_SECRET=<random-32-chars>
✅ CORS_ORIGIN=http://localhost:3000,http://localhost:3334
```

### WEB (.env.local)
```env
✅ NEXTAUTH_URL=http://localhost:3000
✅ NEXTAUTH_SECRET=<random-string>
✅ NEXT_PUBLIC_API_URL=http://localhost:3333
```

### BO (.env)
```env
✅ PORT=3334
✅ MONGODB_URI=mongodb://localhost:27017/laptop-shop
✅ APP_KEY=<random-string>
✅ JWT_SECRET=<random-32-chars>
```

## 🎨 Project Structure Tóm Tắt

```
laptop-shop/
├── api/          # NestJS API Backend (PORT 3333)
│   ├── src/
│   │   ├── auth/           # JWT authentication
│   │   ├── products/       # Products với filters & pagination
│   │   ├── cart/           # Cart với clear endpoint
│   │   ├── orders/         # Orders
│   │   ├── reviews/        # Reviews với JOIN query
│   │   └── news/           # News
│   └── .env
│
├── web/          # NextJS Customer Shop (PORT 3000)
│   ├── app/
│   │   ├── cart/           # ✅ Cart page ONLY
│   │   ├── checkout/       # ✅ Checkout page RIÊNG
│   │   ├── products/       # Products với filters
│   │   └── user/           # User dashboard
│   └── .env.local
│
└── bo/           # AdonisJS Admin Panel (PORT 3334)
    ├── app/
    │   ├── controllers/    # Admin controllers
    │   └── models/         # Mongoose models
    ├── inertia/            # React admin UI
    └── .env
```

## 🔍 Key Features Implemented

### ✅ API (NestJS)
- JWT Authentication
- Products với **pagination & filters** (8+ filters)
- Cart với **clear endpoint ở BE**
- Reviews với **JOIN query** (populate)
- Orders management
- News module

### ✅ WEB (NextJS)
- **Tách Cart & Checkout** thành 2 trang riêng
- Products listing với **pagination & filters UI**
- **Clear cart từ BE** sau checkout
- Reviews **tối ưu với JOIN query**
- **News** thay vì Blog

### ✅ BO (AdonisJS)
- Admin dashboard
- Products CRUD
- Orders management
- Users management
- Reviews moderation

## 📚 Next Steps

1. **Đọc README chính**: [README.md](./README.md)
2. **API Documentation**: [api/README.md](./api/README.md)
3. **WEB Documentation**: [web/README.md](./web/README.md)
4. **BO Documentation**: [bo/README.md](./bo/README.md)

## 🔐 Security Reminders

**⚠️ Trước khi deploy production:**

1. ✅ Đổi tất cả secrets trong .env files
2. ✅ Change default admin password
3. ✅ Enable HTTPS
4. ✅ Setup rate limiting
5. ✅ Configure CORS properly
6. ✅ Setup monitoring & logging
7. ✅ Enable database backups

## 💡 Development Tips

### Hot Reload
- **API**: Tự động reload khi sửa code
- **WEB**: Fast Refresh với Next.js
- **BO**: HMR với AdonisJS

### Debug Mode
```bash
# API
npm run start:debug

# WEB  
npm run dev -- --debug

# BO
npm run dev
```

### Build Production
```bash
# API
cd api && npm run build && npm run start:prod

# WEB
cd web && npm run build && npm run start

# BO
cd bo && npm run build && npm run start
```

## 🤝 Need Help?

- Check main [README.md](./README.md)
- Read module-specific READMEs
- Check code comments
- Open GitHub issue

## 🎉 You're Ready!

Giờ bạn có thể:
- ✅ Browse products trên WEB
- ✅ Add to cart & checkout
- ✅ Manage everything trên Admin BO
- ✅ API sẵn sàng cho mobile app

**Happy Coding! 🚀**
