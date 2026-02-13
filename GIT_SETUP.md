# Git Setup Guide

## 🔧 Đã cấu hình xong:

✅ **Environment Files**: Đã update tất cả .env với config đúng từ project cũ
✅ **Database**: Trỏ đến MongoDB Atlas `shoe_shop` database
✅ **Secrets**: JWT_SECRET, APP_KEY, Bank info đã được set đúng
✅ **.gitignore**: Đã tạo để protect các file .env (không bị commit lên Git)

---

## 📤 Để push project lên Git:

### Bước 1: Khởi tạo Git repository

```bash
cd e:\laptop-shop
git init
```

### Bước 2: Add remote repository

Chọn 1 trong 2 cách:

**Cách A: Tạo repo mới trên GitHub/GitLab**
```bash
# Tạo repo mới trên GitHub, sau đó:
git remote add origin <URL_REPO_CUA_ANH>
```

**Cách B: Sử dụng repo Adonis cũ (tạo branch mới)**
```bash
# Nếu muốn giữ lịch sử của project cũ
git remote add origin <URL_REPO_ADONIS_CU>
git checkout -b refactor/nestjs-microservices
```

### Bước 3: Commit và push

```bash
# Add tất cả files (trừ .env nhờ .gitignore)
git add .

# Kiểm tra xem .env có bị add không (KHÔNG nên thấy .env trong list)
git status

# Commit
git commit -m "feat: refactor to microservices (NestJS API + NextJS Web + AdonisJS BO)"

# Push
git push -u origin main
# Hoặc nếu dùng branch:
# git push -u origin refactor/nestjs-microservices
```

---

## ⚠️ QUAN TRỌNG - Files KHÔNG được commit:

Các file này đã được protect bởi .gitignore:
- ❌ `api/.env` (chứa MongoDB password, JWT secret)
- ❌ `web/.env.local` (chứa NextAuth secret)
- ❌ `bo/.env` (chứa APP_KEY, bank info)
- ❌ `node_modules/` (dependencies)
- ❌ `uploads/` (user uploaded files)

**✅ CHỈ commit `.env.example` files** (không chứa sensitive data)

---

## 🔍 Kiểm tra trước khi commit:

```bash
# Xem files sẽ được commit
git status

# Nếu thấy .env trong list, RUN NGAY:
git rm --cached .env
git rm --cached api/.env
git rm --cached web/.env.local
git rm --cached bo/.env
```

---

## 📦 Cấu trúc commit lên Git:

```
laptop-shop/
├── .gitignore              ← commit ✅
├── README.md               ← commit ✅
├── QUICK_START.md          ← commit ✅
├── GIT_SETUP.md            ← commit ✅ (file này)
├── api/
│   ├── .gitignore          ← commit ✅
│   ├── .env.example        ← commit ✅
│   ├── .env                ← KHÔNG commit ❌
│   ├── src/                ← commit ✅
│   └── package.json        ← commit ✅
├── web/
│   ├── .gitignore          ← commit ✅
│   ├── .env.local          ← KHÔNG commit ❌
│   ├── app/                ← commit ✅
│   └── package.json        ← commit ✅
└── bo/
    ├── .gitignore          ← commit ✅
    ├── .env.example        ← commit ✅
    ├── .env                ← KHÔNG commit ❌
    ├── app/                ← commit ✅
    └── package.json        ← commit ✅
```

---

## 🚀 Setup cho teammate khác:

Khi teammate clone project:

```bash
git clone <repo-url>
cd laptop-shop

# Copy .env.example và điền thông tin
cp api/.env.example api/.env
cp bo/.env.example bo/.env
cp web/.env.local.example web/.env.local

# Sửa .env files với thông tin thật (MongoDB URI, secrets...)
# Sau đó install dependencies
cd api && npm install
cd ../web && npm install
cd ../bo && npm install
```

---

## 📝 Commit message conventions:

```bash
git commit -m "feat: add products filter and pagination"
git commit -m "fix: resolve cart checkout separation issue"
git commit -m "refactor: optimize reviews with JOIN queries"
git commit -m "docs: update API documentation"
```
