# 🔐 BO - Admin BackOffice

## Tech Stack

- **Framework**: AdonisJS 6
- **Frontend**: Inertia.js (React SSR)
- **Database**: MongoDB với Mongoose
- **Styling**: TailwindCSS
- **Authentication**: JWT + Session

## Features

### ✅ Dashboard
- Overview statistics
- Recent orders
- Low stock alerts
- Revenue charts

### ✅ Products Management
- CRUD operations
- Product variants (sizes, colors, materials)
- Image upload
- Stock management
- Category & Brand assignment

### ✅ Orders Management
- Order listing với filters
- Order status updates
- Order details
- Tracking information

### ✅ Users Management
- User listing
- User roles (client, partner, admin)
- Account approval (for partners)
- User details & edit

### ✅ Categories & Brands
- Category tree management
- Brand management
- Icons & images

### ✅ Reviews Moderation
- Review approval
- Review deletion
- Seller responses

### ✅ Settings
- Site settings
- Payment settings
- Shipping settings
- Email templates

## Installation

```bash
cd bo
npm install
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
TZ=UTC
PORT=3334
HOST=localhost
LOG_LEVEL=info
APP_KEY=your-app-key-here-change-in-production
NODE_ENV=development
SESSION_DRIVER=cookie

# Database
MONGODB_URI=mongodb://localhost:27017/laptop-shop

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application
APP_URL=http://localhost:3334
```

## Running

```bash
# Development với HMR
npm run dev

# Production build
npm run build
npm run start
```

## Project Structure

```
bo/
├── app/
│   ├── controllers/
│   │   ├── admin_controller.ts        # Dashboard
│   │   ├── products_controller.ts     # Products CRUD
│   │   ├── orders_controller.ts       # Orders management
│   │   ├── users_controller.ts        # Users management
│   │   ├── categories_controller.ts   # Categories CRUD
│   │   ├── brands_controller.ts       # Brands CRUD
│   │   ├── reviews_controller.ts      # Reviews moderation
│   │   └── settings_controller.ts     # Site settings
│   │
│   ├── models/
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── category.ts
│   │   ├── brand.ts
│   │   ├── review.ts
│   │   └── settings.ts
│   │
│   ├── middleware/
│   │   ├── auth_middleware.ts         # Auth check
│   │   ├── admin_middleware.ts        # Admin role check
│   │   └── jwt_auth_middleware.ts     # JWT validation
│   │
│   └── services/
│       └── ...
│
├── inertia/                            # React frontend
│   ├── pages/
│   │   ├── Home.tsx                   # Homepage
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Products/
│   │   │   │   ├── List.tsx
│   │   │   │   ├── Create.tsx
│   │   │   │   └── Edit.tsx
│   │   │   ├── Orders/
│   │   │   │   ├── List.tsx
│   │   │   │   └── Detail.tsx
│   │   │   ├── Users/
│   │   │   │   └── List.tsx
│   │   │   └── Settings.tsx
│   │   └── auth/
│   │       └── Login.tsx
│   │
│   └── components/
│       ├── Layout.tsx
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── ui/
│
├── start/
│   ├── routes.ts                      # Route definitions
│   └── kernel.ts                      # Middleware registration
│
├── config/
│   ├── app.ts
│   ├── database.ts
│   └── inertia.ts
│
└── providers/
    ├── mongo_provider.ts              # MongoDB connection
    └── socket_provider.ts             # WebSocket (optional)
```

## Routes

### Auth Routes
```
GET    /auth/login                     # Login page
POST   /auth/login                     # Login action
POST   /auth/logout                    # Logout
```

### Admin Routes (Protected)
```
GET    /admin/dashboard                # Dashboard
GET    /admin/products                 # Products list
GET    /admin/products/create          # Create product form
POST   /admin/products                 # Store product
PUT    /admin/products/:id             # Update product
DELETE /admin/products/:id             # Delete product

GET    /admin/orders                   # Orders list
GET    /admin/orders/:id               # Order details
PUT    /admin/orders/:id/status        # Update order status

GET    /admin/users                    # Users list
POST   /admin/users                    # Create user
PUT    /admin/users/:id                # Update user
DELETE /admin/users/:id                # Delete user

GET    /admin/categories               # Categories list
POST   /admin/categories               # Create category
PUT    /admin/categories/:id           # Update category
DELETE /admin/categories/:id           # Delete category

GET    /admin/brands                   # Brands list
POST   /admin/brands                   # Create brand
PUT    /admin/brands/:id               # Update brand
DELETE /admin/brands/:id               # Delete brand

GET    /admin/reviews                  # Reviews list
PUT    /admin/reviews/:id/approve      # Approve review
DELETE /admin/reviews/:id              # Delete review

GET    /admin/settings                 # Settings page
PUT    /admin/settings                 # Update settings
```

## Admin Access

### Default Admin Account
```
Username: admin
Password: admin123
```

**⚠️ Change this in production!**

### Creating New Admin
```bash
node ace user:create --role=admin
```

## Database

### Models
- **User** - Users, partners, admins
- **Product** - Products với variants
- **Order** - Orders với items
- **Category** - Product categories
- **Brand** - Product brands
- **Review** - Product reviews
- **Settings** - Site settings

### Relationships
```
User 1:N Orders
User 1:N Products (createdBy)
User 1:N Reviews

Product N:1 Category
Product N:1 Brand
Product 1:N Reviews
Product N:N Orders (through OrderItem)

Order 1:N OrderItems
Order 1:N Reviews
```

## Commands

```bash
# Create admin user
node ace user:create --role=admin

# Seed database
node ace seed:users
node ace seed:products
node ace seed:orders

# Check system
node ace system:check

# Set user as admin
node ace user:set-admin <userId>
```

## Middleware

### Auth Middleware
Kiểm tra user đã login chưa

### Admin Middleware
Kiểm tra user có role admin không

### JWT Middleware
Validate JWT token cho API requests

## Inertia.js

### Server-side (AdonisJS)
```typescript
// Controller
return inertia.render('admin/Dashboard', {
  stats: dashboardStats,
  recentOrders: orders,
})
```

### Client-side (React)
```tsx
import { usePage } from '@inertiajs/react'

export default function Dashboard() {
  const { stats, recentOrders } = usePage().props
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render stats */}
    </div>
  )
}
```

## Development

### Hot Module Replacement
AdonisJS hỗ trợ HMR cho cả backend và Inertia frontend:

```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

## Security

### Best Practices
- ✅ Password hashing với bcrypt
- ✅ JWT secret rotation
- ✅ CSRF protection
- ✅ Input validation
- ✅ Role-based access control
- ✅ Audit logging

### Important
- Change `APP_KEY` và `JWT_SECRET` trong production
- Sử dụng HTTPS
- Regular security updates
- Monitor logs

## Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Change default admin password
- [ ] Enable HTTPS
- [ ] Setup MongoDB backups
- [ ] Configure logging
- [ ] Setup monitoring
- [ ] Enable rate limiting

### Build & Deploy
```bash
npm run build
NODE_ENV=production node bin/server.js
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check MongoDB is running
mongosh

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/laptop-shop
```

**Port Conflict**
```bash
# Change PORT in .env
PORT=3335
```

**Build Errors**
```bash
# Clear cache
rm -rf build/
npm run build
```

## Support

For admin issues or questions, contact: admin@example.com
