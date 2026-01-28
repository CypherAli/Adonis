# Hệ Thống Đánh Giá Sản Phẩm (Product Review System)

## Tổng Quan

Hệ thống đánh giá sản phẩm cho phép khách hàng đánh giá và nhận xét về sản phẩm sau khi đã nhận hàng. Tất cả đánh giá sẽ được lưu trữ và hiển thị trong trang quản lý của admin.

## Tính Năng Chính

### 1. **Đánh Giá Từ Trang My Orders**
- Khách hàng chỉ có thể đánh giá sản phẩm khi đơn hàng đã được giao (status = 'delivered')
- Mỗi sản phẩm chỉ được đánh giá 1 lần
- Nút "⭐ Đánh giá" sẽ tự động ẩn sau khi đã đánh giá
- Hiển thị badge "✓ Đã đánh giá" cho sản phẩm đã review

### 2. **Form Đánh Giá**
Bao gồm các trường:
- **Rating (1-5 sao)**: Bắt buộc
- **Tiêu đề**: Bắt buộc, tối đa 200 ký tự
- **Nhận xét**: Bắt buộc, tối thiểu 10 ký tự
- **Hình ảnh**: Tùy chọn
- **Ưu/Nhược điểm**: Tùy chọn

### 3. **Quản Lý Bởi Admin**
- Xem tất cả reviews trong trang `/reviews` (ReviewManagement)
- Lọc theo rating, sắp xếp theo thời gian/độ hữu ích
- Chỉnh sửa, xóa reviews
- Kiểm duyệt reviews (approve/unapprove)

## Cấu Trúc Database

### Review Model (`app/models/review.ts`)

```typescript
interface ReviewDocument {
  product: ObjectId           // ID sản phẩm
  user: ObjectId             // ID người dùng
  order: ObjectId            // ID đơn hàng (liên kết)
  rating: number             // 1-5 sao
  title: string              // Tiêu đề đánh giá
  comment: string            // Nội dung đánh giá
  images?: string[]          // Hình ảnh đính kèm
  isVerifiedPurchase: boolean // Xác nhận mua hàng
  helpfulCount: number       // Số lượt đánh giá hữu ích
  helpfulBy?: ObjectId[]     // Danh sách user đánh dấu hữu ích
  pros?: string[]            // Ưu điểm
  cons?: string[]            // Nhược điểm
  isApproved: boolean        // Trạng thái kiểm duyệt
  moderatedBy?: ObjectId     // Admin kiểm duyệt
  moderatedAt?: Date         // Thời gian kiểm duyệt
  sellerResponse?: {         // Phản hồi từ người bán
    comment?: string
    respondedBy?: ObjectId
    respondedAt?: Date
  }
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Public Routes

#### 1. Lấy tất cả reviews (Admin)
```
GET /api/reviews
Query params:
  - page: Trang hiện tại (default: 1)
  - limit: Số lượng/trang (default: 10)
  - isApproved: Lọc theo trạng thái duyệt (true/false)
```

#### 2. Lấy reviews của một sản phẩm
```
GET /api/reviews/product/:productId
Query params:
  - page: Trang hiện tại
  - limit: Số lượng/trang
  - rating: Lọc theo số sao (1-5)
  - sortBy: Sắp xếp (recent|helpful|rating_high|rating_low)
```

### Protected Routes (Requires Authentication)

#### 3. Lấy reviews của user hiện tại
```
GET /api/reviews/my-reviews
Headers: Authorization: Bearer <token>
```

#### 4. Tạo review mới
```
POST /api/reviews
Headers: Authorization: Bearer <token>
Body: {
  productId: string,
  orderId: string,
  rating: number (1-5),
  title: string,
  comment: string,
  images?: string[],
  pros?: string[],
  cons?: string[]
}
```

**Validation:**
- User phải đã nhận hàng (order status = 'delivered')
- Chưa có review cho sản phẩm này
- Rating từ 1-5
- Title và comment bắt buộc

#### 5. Cập nhật review
```
PUT /api/reviews/:id
Headers: Authorization: Bearer <token>
Body: {
  rating?: number,
  title?: string,
  comment?: string,
  images?: string[],
  pros?: string[],
  cons?: string[]
}
```

#### 6. Xóa review
```
DELETE /api/reviews/:id
Headers: Authorization: Bearer <token>
```

#### 7. Đánh dấu hữu ích
```
POST /api/reviews/:id/helpful
Headers: Authorization: Bearer <token>
```

## Frontend Components

### 1. ReviewModal Component
**Location:** `client/src/components/review/ReviewModal.js`

**Props:**
- `isOpen`: Boolean - Hiển thị modal
- `onClose`: Function - Đóng modal
- `order`: Object - Thông tin đơn hàng
- `product`: Object - Thông tin sản phẩm
- `onReviewSubmitted`: Function - Callback sau khi gửi thành công

**Features:**
- Star rating interactive
- Title input với character counter
- Comment textarea với validation
- Error handling
- Loading state

### 2. OrdersPage Component
**Location:** `client/src/pages/user/orders/orders-list/OrdersPage.js`

**Features:**
- Hiển thị nút đánh giá cho đơn hàng delivered
- Check xem sản phẩm đã được review chưa
- Tích hợp ReviewModal
- Refresh list sau khi review

### 3. ReviewManagement Component
**Location:** `client/src/pages/reviews/ReviewManagement.jsx`

**Features:**
- Admin panel để quản lý tất cả reviews
- Filter và sort options
- CRUD operations
- Approve/reject reviews

## Quy Trình Hoạt Động

### Người dùng đánh giá sản phẩm:

1. Vào trang **My Orders** (`/orders`)
2. Tìm đơn hàng đã giao (status = 'delivered')
3. Click nút **"⭐ Đánh giá"** trên sản phẩm
4. Điền thông tin:
   - Chọn số sao (1-5)
   - Nhập tiêu đề đánh giá
   - Viết nhận xét (tối thiểu 10 ký tự)
5. Click **"Gửi đánh giá"**
6. Review được lưu vào database với:
   - `isVerifiedPurchase = true` (vì đã check order)
   - `isApproved = true` (auto-approve)
   - Link đến order và product

### Admin xem và quản lý reviews:

1. Vào trang **Review Management** (menu admin)
2. Xem danh sách tất cả reviews
3. Có thể:
   - Lọc theo rating
   - Sắp xếp theo thời gian/độ hữu ích
   - Xem chi tiết từng review
   - Approve/Unapprove
   - Xóa review không phù hợp
   - Phản hồi review (tính năng mở rộng)

## Tính Năng Đặc Biệt

### 1. Verified Purchase Badge
- Tất cả reviews đều có badge "Verified Purchase"
- Vì chỉ cho phép review sau khi nhận hàng
- Tăng độ tin cậy của review

### 2. Auto Update Product Rating
- Sau mỗi lần create/update/delete review
- Tự động tính lại rating trung bình của product
- Cập nhật vào field `product.rating.average` và `product.rating.count`

### 3. One Review Per Product
- Backend validate để đảm bảo mỗi user chỉ review 1 lần/product
- Unique index: `{ product: 1, user: 1 }`
- Frontend check để ẩn nút đánh giá nếu đã review

### 4. Helpful Count System
- User có thể đánh dấu review hữu ích
- Toggle system: click lại để bỏ đánh dấu
- Sort reviews theo độ hữu ích

## Cập Nhật Gần Đây

### Ngày 27/01/2026
✅ Thêm field `title` vào review form
✅ Cập nhật ReviewModal với title input
✅ Thêm API endpoint `/api/reviews/my-reviews`
✅ Implement logic check đã review hay chưa
✅ Thêm badge "Đã đánh giá"
✅ CSS styling cho review button và badge
✅ Update backend để nhận `orderId` từ frontend

## Cải Tiến Tương Lai

1. **Image Upload**: Cho phép user upload hình ảnh review
2. **Seller Response**: Tính năng phản hồi từ người bán
3. **Review Moderation**: Hệ thống kiểm duyệt tự động
4. **Review Rewards**: Tích điểm cho user có review chất lượng
5. **Review Analytics**: Thống kê và phân tích reviews

## Troubleshooting

### Issue: Không hiển thị nút đánh giá
**Giải pháp:**
- Check order status = 'delivered'
- Check user đã đăng nhập
- Check chưa có review cho sản phẩm đó

### Issue: Lỗi "Bạn đã đánh giá sản phẩm này rồi"
**Giải pháp:**
- Backend đã có review cho product này
- Frontend cache chưa refresh
- Reload trang để cập nhật trạng thái

### Issue: Review không hiển thị ở admin
**Giải pháp:**
- Check `isApproved = true`
- Check pagination settings
- Refresh trang review management

## Testing

### Test Cases

1. **Create Review:**
   - ✅ User với delivered order có thể tạo review
   - ✅ User không thể review 2 lần cho cùng 1 product
   - ✅ Validation: rating 1-5, title required, comment min 10 chars

2. **Display Review:**
   - ✅ Review button chỉ hiện khi order delivered
   - ✅ Badge "Đã đánh giá" hiện sau khi review
   - ✅ Admin có thể xem tất cả reviews

3. **Update/Delete:**
   - ✅ User chỉ có thể update/delete review của mình
   - ✅ Admin có thể delete bất kỳ review nào

---

**Tài liệu này được tạo bởi:** GitHub Copilot
**Phiên bản:** 1.0
**Ngày cập nhật:** 27/01/2026
