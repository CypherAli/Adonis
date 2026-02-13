# 🌐 WEB - Customer E-commerce Shop

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth v5
- **Styling**: TailwindCSS + Custom CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client

## Features

### ✅ Authentication & User Management
- Login với NextAuth
- User profile
- Order history
- Address management

### ✅ Shopping Features
- Product listing với **pagination** và **filters**
- Product search
- Product details
- Shopping cart (tách riêng)
- **Checkout page riêng biệt**
- Order tracking

### ✅ Reviews & Ratings
- ✨ Tối ưu với API JOIN query
- Write reviews (verified purchases)
- Mark reviews helpful
- View all reviews

### ✅ News/Blog
- News listing
- News details
- View count

## Installation

```bash
cd web
npm install
```

## Environment Variables

Copy `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_WS_URL=http://localhost:3333

# Optional: OAuth Providers
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
```

## Running

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

## Page Structure

```
app/
├── (shop)/               # Main shop layout
│   ├── page.tsx         # Homepage
│   ├── products/        # Product pages
│   │   ├── page.tsx     # ✅ Product listing với filters & pagination
│   │   └── [id]/        # Product detail
│   ├── news/            # ✅ News (không phải blog)
│   └── about/
│
├── cart/                # ✅ Shopping cart ONLY
│   └── page.tsx
│
├── checkout/            # ✅ Checkout page RIÊNG (tách khỏi cart)
│   └── page.tsx
│
├── user/                # User dashboard
│   ├── profile/
│   ├── orders/          # ✅ Orders với review status
│   ├── reviews/
│   └── addresses/
│
└── auth/                # Authentication pages
    ├── login/
    └── register/
```

## Key Changes & Bug Fixes

### 1. ✅ Tách Cart & Checkout
**Trước:**
- `/cart` - Gộp chung giỏ hàng + checkout modal
- Logic phức tạp, dễ confuse

**Sau:**
- `/cart` - Chỉ hiển thị giỏ hàng
  - View items
  - Update quantity
  - Remove items
  - Button "Tiến hành thanh toán" → `/checkout`
  
- `/checkout` - Trang thanh toán riêng
  - Shipping info form
  - Payment method selection
  - Order summary
  - Place order button

### 2. ✅ Clear Cart ở Backend
**Trước:**
```tsx
// Client tự xóa từng item
for (const item of selectedCartItems) {
  await removeFromCart(item._id)
}
```

**Sau:**
```tsx
// Gọi API clear cart
const productIds = cartItems.map(item => item.product._id)
await api.post('/api/cart/clear', { productIds })
```

### 3. ✅ Reviews với JOIN Query
**Trước:**
```tsx
// Lấy orders
const orders = await api.get('/api/orders')

// Lấy reviews riêng
const reviews = await api.get('/api/reviews/my-reviews')

// Loop check từng product
orders.map(order => ({
  ...order,
  items: order.items.map(item => ({
    ...item,
    hasReview: reviews.some(r => r.product === item.product)
  }))
}))
```

**Sau:**
```tsx
// 1 API call với JOIN query
const ordersWithReviewStatus = await api.get('/api/reviews/orders-with-status')
// Backend đã populate products và check review status
```

### 4. ✅ Products với Pagination & Filters
**Trước:**
```tsx
const res = await fetch(`${API_URL}/api/products?limit=20`)
```

**Sau:**
```tsx
const res = await fetch(
  `${API_URL}/api/products?` +
  `page=${page}&` +
  `limit=20&` +
  `category=${category}&` +
  `brand=${brand}&` +
  `minPrice=${minPrice}&` +
  `maxPrice=${maxPrice}&` +
  `size=${size}&` +
  `color=${color}&` +
  `sortBy=${sortBy}&` +
  `sortOrder=${sortOrder}`
)
```

### 5. ✅ News thay vì Blog
**Trước:**
- Có cả `/blog` và `/news`

**Sau:**
- Chỉ giữ `/news` để tránh confusion

## API Integration

### Products
```tsx
// Get products với pagination + filters
const response = await api.get('/api/products', {
  params: {
    page: 1,
    limit: 20,
    category: 'laptop',
    brand: 'dell',
    minPrice: 1000,
    maxPrice: 5000,
    size: '15-inch',
    color: 'black',
    sortBy: 'price',
    sortOrder: 'asc'
  }
})
```

### Cart
```tsx
// Get cart
await api.get('/api/cart')

// Add to cart
await api.post('/api/cart', { productId, variantSku, quantity })

// Update quantity
await api.put(`/api/cart/${productId}/${variantSku}`, { quantity })

// Remove item
await api.delete(`/api/cart/${productId}/${variantSku}`)

// Clear cart (sau checkout)
await api.post('/api/cart/clear', { productIds })
```

### Orders
```tsx
// Create order
await api.post('/api/orders', {
  items: [...],
  shippingAddress: {...},
  paymentMethod: 'cod',
  notes: '...'
})

// Get user orders
await api.get('/api/orders')
```

### Reviews
```tsx
// Get user reviews (với populate)
await api.get('/api/reviews/my-reviews')

// Get orders with review status (tối ưu)
await api.get('/api/reviews/orders-with-status')

// Create review
await api.post('/api/reviews', {
  productId,
  orderId,
  rating,
  title,
  comment,
  images,
  pros,
  cons
})
```

## Components

### Key Components
```
components/
├── providers/
│   ├── CartProvider.tsx       # Cart state management
│   └── AuthProvider.tsx       # Auth wrapper
├── ui/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── Pagination.tsx         # ✅ Pagination component
├── filters/
│   ├── ProductFilters.tsx     # ✅ Filters UI
│   └── FilterBar.tsx
└── cart/
    ├── CartItem.tsx
    └── CartSummary.tsx
```

## Styling

- **Global**: TailwindCSS configuration
- **Page-specific**: Custom CSS modules
- **Design system**: Consistent colors, spacing, typography

## Building for Production

```bash
npm run build
npm run start
```

## Testing

```bash
npm run lint
npm run type-check
```

## Performance Optimizations

- **Server Components** by default
- **Client Components** only when needed (useCart, useSession)
- **Image Optimization** với Next.js Image
- **Route Prefetching**
- **API Response Caching** với `next: { revalidate }`

## Known Issues & Improvements

### Completed ✅
- Cart & Checkout tách riêng
- Clear cart xử lý ở BE
- Reviews tối ưu với JOIN query
- Pagination & Filters cho products
- News thay blog

### Future Improvements
- [ ] Add product comparison
- [ ] Add wishlist
- [ ] Add product recommendations
- [ ] Add live chat
- [ ] Add notifications
- [ ] Add PWA support
- [ ] Add i18n (internationalization)

## Support

For issues or questions, contact: your-email@example.com
