/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/restrict-template-expressions */
/**
 * Seed script to populate news articles in the database.
 *
 * Usage: npx ts-node -r tsconfig-paths/register src/news/seed-news.ts
 * Or run via: npm run seed:news
 */
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/shoe_shop';

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    coverImage: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    viewCount: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true },
);

const UserSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  role: String,
});

const NewsModel = mongoose.model('News', NewsSchema);
const UserModel = mongoose.model('User', UserSchema);

const newsArticles = [
  {
    title: 'Top 10 xu hướng giày sneaker hot nhất 2025',
    excerpt:
      'Khám phá những xu hướng giày sneaker đang làm mưa làm gió trên thị trường năm 2025, từ chunky sneakers đến minimalist designs.',
    content: `
      <h2>Xu hướng giày sneaker 2025</h2>
      <p>Năm 2025 đánh dấu sự trở lại mạnh mẽ của nhiều phong cách giày sneaker độc đáo. Từ những đôi chunky sneakers với đế dày cho đến những thiết kế tối giản, thị trường giày năm nay có rất nhiều điều thú vị để khám phá.</p>

      <h3>1. Chunky Sneakers vẫn giữ ngôi vương</h3>
      <p>Những đôi giày đế dày, cồng kềnh tiếp tục là xu hướng chủ đạo. Nike Air Max, New Balance 530, và Adidas Ozweego là những cái tên được yêu thích nhất.</p>

      <h3>2. Retro Running Shoes</h3>
      <p>Giày chạy bộ phong cách retro từ thập niên 80-90 đang quay trở lại mạnh mẽ. New Balance 574, ASICS Gel-Lyte III là những lựa chọn hàng đầu.</p>

      <h3>3. Sustainable Sneakers</h3>
      <p>Xu hướng thời trang bền vững ngày càng được quan tâm. Nhiều thương hiệu đã cho ra mắt các dòng giày sử dụng vật liệu tái chế và thân thiện với môi trường.</p>

      <h3>4. High-top Sneakers</h3>
      <p>Giày cổ cao đang dần lấy lại vị thế với những thiết kế hiện đại, kết hợp giữa phong cách streetwear và high fashion.</p>

      <h3>5. Color Block Designs</h3>
      <p>Phối màu bold và táo bạo là một trong những xu hướng nổi bật nhất. Những đôi giày với nhiều màu sắc tương phản tạo nên điểm nhấn cho outfit.</p>

      <h3>6-10. Và nhiều xu hướng khác</h3>
      <p>Platform sneakers, slip-on sneakers, knit sneakers, collaborations giữa các thương hiệu, và giày với công nghệ mới đều là những xu hướng đáng chú ý trong năm nay.</p>
    `,
    tags: ['sneaker', 'xu-huong', '2025', 'thoi-trang'],
    coverImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  },
  {
    title: 'Hướng dẫn chọn size giày chuẩn không cần thử',
    excerpt:
      'Bí quyết đo chân và chọn size giày online chính xác, giúp bạn mua giày trực tuyến không lo sai size.',
    content: `
      <h2>Cách đo chân và chọn size giày chuẩn</h2>
      <p>Mua giày online luôn là một thử thách vì bạn không thể thử trực tiếp. Tuy nhiên, với những mẹo sau đây, bạn hoàn toàn có thể chọn được đúng size.</p>

      <h3>Bước 1: Đo chiều dài bàn chân</h3>
      <p>Đặt chân lên tờ giấy trắng, dùng bút đánh dấu điểm dài nhất của ngón chân và gót chân. Đo khoảng cách giữa hai điểm này bằng thước.</p>

      <h3>Bước 2: Đo chiều rộng bàn chân</h3>
      <p>Đo phần rộng nhất của bàn chân (thường là phần ức bàn chân). Điều này giúp bạn xác định xem bạn cần giày wide hay narrow.</p>

      <h3>Bước 3: Đo vào buổi chiều</h3>
      <p>Bàn chân thường phình ra khoảng 5-8% vào buổi chiều do đi lại cả ngày. Vì vậy, hãy đo chân vào buổi chiều để có kết quả chính xác nhất.</p>

      <h3>Bảng quy đổi size giày</h3>
      <p>Mỗi thương hiệu có bảng size riêng. Nike thường rộng hơn Adidas 0.5 size. Converse thì nên chọn lớn hơn 0.5-1 size so với bình thường.</p>

      <h3>Mẹo khi mua online</h3>
      <ul>
        <li>Luôn kiểm tra bảng size của từng thương hiệu</li>
        <li>Đọc review của người mua trước</li>
        <li>Chọn cửa hàng có chính sách đổi trả tốt</li>
        <li>Nếu chân bạn ở giữa 2 size, hãy chọn size lớn hơn</li>
      </ul>
    `,
    tags: ['huong-dan', 'size-giay', 'meo-hay', 'mua-sam'],
    coverImage:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
  },
  {
    title: 'Flash Sale cuối tuần - Giảm đến 50% tất cả sản phẩm',
    excerpt:
      'Chương trình khuyến mãi lớn nhất tháng! Giảm giá sốc đến 50% cho hàng trăm sản phẩm giày dép chính hãng.',
    content: `
      <h2>Flash Sale Cuối Tuần - Đừng Bỏ Lỡ!</h2>
      <p>Shoe Store vui mừng thông báo chương trình Flash Sale lớn nhất tháng với hàng trăm sản phẩm được giảm giá sốc lên đến 50%!</p>

      <h3>Thời gian: Thứ 6 - Chủ Nhật hàng tuần</h3>

      <h3>Những ưu đãi nổi bật:</h3>
      <ul>
        <li><strong>Nike Air Force 1:</strong> Giảm 30% - Chỉ còn 2.100.000đ</li>
        <li><strong>Adidas Ultraboost:</strong> Giảm 40% - Chỉ còn 2.400.000đ</li>
        <li><strong>New Balance 574:</strong> Giảm 35% - Chỉ còn 1.690.000đ</li>
        <li><strong>Converse Chuck Taylor:</strong> Giảm 50% - Chỉ còn 750.000đ</li>
        <li><strong>Vans Old Skool:</strong> Giảm 45% - Chỉ còn 990.000đ</li>
      </ul>

      <h3>Điều kiện áp dụng:</h3>
      <p>Áp dụng cho tất cả đơn hàng online. Miễn phí vận chuyển cho đơn hàng trên 500.000đ. Số lượng có hạn, nhanh tay kẻo hết!</p>

      <h3>Cách tham gia:</h3>
      <p>Truy cập mục <strong>Hot Deals</strong> trên website để xem tất cả sản phẩm đang được giảm giá. Thêm vào giỏ hàng và thanh toán - giá ưu đãi sẽ được áp dụng tự động!</p>
    `,
    tags: ['khuyen-mai', 'flash-sale', 'giam-gia', 'hot-deal'],
    coverImage:
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
  },
  {
    title: 'Cách vệ sinh giày sneaker trắng sạch như mới',
    excerpt:
      'Hướng dẫn chi tiết cách làm sạch giày trắng bị ố vàng, bẩn dính, giúp giày luôn trắng sáng như mới mua.',
    content: `
      <h2>Bí quyết giữ giày trắng luôn như mới</h2>
      <p>Giày trắng là item không thể thiếu nhưng lại rất dễ bẩn. Đừng lo, với những cách sau đây, giày bạn sẽ luôn trắng sáng!</p>

      <h3>Phương pháp 1: Baking Soda + Giấm trắng</h3>
      <p>Trộn 1 thìa baking soda + 1 thìa giấm trắng + 1 cốc nước ấm. Dùng bàn chải mềm chà nhẹ lên vết bẩn, để 30 phút rồi rửa sạch.</p>

      <h3>Phương pháp 2: Kem đánh răng</h3>
      <p>Dùng kem đánh răng trắng (không phải loại gel) thoa lên vết bẩn. Chà nhẹ bằng bàn chải cũ, để 10 phút rồi lau sạch bằng khăn ẩm.</p>

      <h3>Phương pháp 3: Magic Eraser</h3>
      <p>Miếng tẩy Magic Eraser rất hiệu quả cho phần đế cao su. Chỉ cần làm ướt và chà nhẹ, vết bẩn sẽ biến mất ngay.</p>

      <h3>Lưu ý quan trọng:</h3>
      <ul>
        <li>Không giặt giày bằng máy giặt</li>
        <li>Phơi giày ở nơi thoáng mát, tránh ánh nắng trực tiếp</li>
        <li>Nhét giấy báo vào giày khi phơi để giữ form</li>
        <li>Xịt chống thấm sau mỗi lần vệ sinh</li>
      </ul>
    `,
    tags: ['huong-dan', 've-sinh-giay', 'meo-hay', 'giay-trang'],
    coverImage:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
  },
  {
    title: 'Nike vs Adidas: So sánh chi tiết hai ông lớn ngành giày',
    excerpt:
      'Phân tích ưu nhược điểm của Nike và Adidas, giúp bạn chọn được thương hiệu phù hợp nhất với phong cách của mình.',
    content: `
      <h2>Nike vs Adidas - Đâu là lựa chọn tốt hơn?</h2>
      <p>Nike và Adidas là hai thương hiệu giày thể thao lớn nhất thế giới. Mỗi thương hiệu đều có những thế mạnh riêng. Hãy cùng so sánh!</p>

      <h3>Về thiết kế</h3>
      <p><strong>Nike:</strong> Thiên về phong cách năng động, sporty. Nổi bật với công nghệ Air, React, ZoomX.</p>
      <p><strong>Adidas:</strong> Kết hợp tốt giữa thể thao và lifestyle. Nổi bật với Boost, 4DFWD technology.</p>

      <h3>Về chất lượng</h3>
      <p>Cả hai đều có chất lượng rất tốt ở phân khúc giá tương đương. Nike nổi bật hơn về công nghệ đệm, trong khi Adidas có upper thoáng khí hơn.</p>

      <h3>Về giá cả</h3>
      <p>Nike có xu hướng đắt hơn Adidas một chút ở cùng phân khúc. Tuy nhiên, Adidas thường có nhiều chương trình giảm giá hơn.</p>

      <h3>Kết luận</h3>
      <p>Không có thương hiệu nào tốt hơn hoàn toàn. Nếu bạn thích chạy bộ, Nike có thể là lựa chọn tốt hơn. Nếu bạn thích lifestyle và streetwear, Adidas đáng để xem xét.</p>
    `,
    tags: ['so-sanh', 'nike', 'adidas', 'review'],
    coverImage:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
  },
  {
    title: 'Shoe Store khai trương chi nhánh mới tại Đà Nẵng',
    excerpt:
      'Shoe Store chính thức mở rộng ra miền Trung với cửa hàng mới tại trung tâm thành phố Đà Nẵng, nhiều ưu đãi hấp dẫn chờ đón bạn.',
    content: `
      <h2>Khai Trương Chi Nhánh Đà Nẵng</h2>
      <p>Shoe Store vui mừng thông báo khai trương cửa hàng mới tại 123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng!</p>

      <h3>Thông tin cửa hàng:</h3>
      <ul>
        <li><strong>Địa chỉ:</strong> 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng</li>
        <li><strong>Giờ mở cửa:</strong> 8:00 - 22:00 hàng ngày</li>
        <li><strong>Hotline:</strong> 0848 565 650</li>
      </ul>

      <h3>Ưu đãi khai trương:</h3>
      <ul>
        <li>Giảm 20% tất cả sản phẩm trong tuần đầu tiên</li>
        <li>Tặng voucher 200.000đ cho 100 khách hàng đầu tiên</li>
        <li>Miễn phí vận chuyển toàn bộ khu vực Đà Nẵng</li>
        <li>Quà tặng đặc biệt cho khách đến trực tiếp cửa hàng</li>
      </ul>

      <p>Hãy đến và trải nghiệm không gian mua sắm hiện đại cùng hàng ngàn sản phẩm giày dép chính hãng!</p>
    `,
    tags: ['su-kien', 'khai-truong', 'da-nang', 'uu-dai'],
    coverImage:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  },
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find an admin user to be the author
    let author = await UserModel.findOne({ role: 'admin' });
    if (!author) {
      author = await UserModel.findOne({});
    }

    if (!author) {
      console.error(
        '❌ No user found in database. Please create a user first.',
      );
      process.exit(1);
    }

    console.log(
      `📝 Using author: ${author.name || author.username} (${author._id})`,
    );

    // Check if news already exists
    const existingCount = await NewsModel.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing news articles.`);
      const answer = process.argv.includes('--force') ? 'y' : 'n';
      if (answer === 'n' && !process.argv.includes('--force')) {
        console.log('ℹ️ Adding new articles alongside existing ones...');
      }
    }

    // Seed news articles
    let created = 0;
    for (const article of newsArticles) {
      const slug =
        article.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim() +
        '-' +
        Date.now().toString(36);

      // Check if similar article exists
      const exists = await NewsModel.findOne({
        title: article.title,
      });

      if (exists) {
        console.log(`⏭️ Skipping (already exists): ${article.title}`);
        continue;
      }

      await NewsModel.create({
        ...article,
        slug,
        author: author._id,
        status: 'published',
        publishedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ), // Random date within last 30 days
        viewCount: Math.floor(Math.random() * 500) + 50,
      });

      created++;
      console.log(`✅ Created: ${article.title}`);
    }

    console.log(`\n🎉 Seeding complete! Created ${created} news articles.`);

    const total = await NewsModel.countDocuments();
    console.log(`📊 Total news articles in database: ${total}`);
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
