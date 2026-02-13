import { BaseSeeder } from '@adonisjs/lucid/seeders'
import mongoose from 'mongoose'
import { Product } from '#models/product'
import { User } from '#models/user'

export default class extends BaseSeeder {
  async run() {
    console.log('🚀 Starting Diverse Shoe Products Seeder...')

    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/laptop_shop'
      await mongoose.connect(mongoUri)
    }

    // Find seller
    const seller = await User.findOne({ email: 'admin@shoe.com' })
    if (!seller) throw new Error('Seller not found')

    // Price logic: Nữ (đắt nhất) > Nam (rẻ hơn 15%) > Unisex (rẻ nhất, giảm 20%)
    const calculatePrice = (basePrice: number, gender: string) => {
      if (gender === 'Nam') return Math.round(basePrice * 0.85)
      if (gender === 'Unisex') return Math.round(basePrice * 0.8)
      return basePrice // Nữ = giá gốc (đắt nhất)
    }

    // Color multiplier: màu hiếm +25%, màu hot +10%
    const getColorMultiplier = (color: string) => {
      const c = color.toLowerCase()
      if (c.includes('pink') || c.includes('purple') || c.includes('gold')) return 1.25
      if (c.includes('red') || c.includes('yellow') || c.includes('orange')) return 1.1
      if (c.includes('black') || c.includes('white') || c.includes('navy')) return 1.0
      return 1.05 // màu khác
    }

    // Placeholder images (không bị chặn CORS/403)
    const PLACEHOLDER_IMAGES = {
      nike: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      adidas: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800',
      converse: 'https://images.unsplash.com/photo-1514989771522-458c9b6c035a?w=800',
      vans: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
      puma: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800',
      newbalance: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800',
    }

    const products = [
      // 1. NIKE AIR MAX 270 - 12 colors x 3 genders = 36 variants
      {
        name: 'Nike Air Max 270 Premium',
        description:
          'Giày thể thao Nike Air Max 270 với đệm khí Max Air. Giá khác biệt theo gender và màu sắc.',
        brand: 'Nike',
        category: 'Running',
        gender: 'Unisex',
        basePrice: 3500000,
        variants: [
          // Black - 3 genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 39 - Black - ${gender}`,
              sku: `NK270-BK-${gender[0]}-39`,
              price: calculatePrice(3500000 * getColorMultiplier('Black'), gender),
              originalPrice: 4200000,
              stock: 15,
              specifications: {
                size: '39',
                color: 'Black',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 40 - Black - ${gender}`,
              sku: `NK270-BK-${gender[0]}-40`,
              price: calculatePrice(3500000 * getColorMultiplier('Black'), gender),
              originalPrice: 4200000,
              stock: 20,
              specifications: {
                size: '40',
                color: 'Black',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // White - 3 genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 39 - White - ${gender}`,
              sku: `NK270-WH-${gender[0]}-39`,
              price: calculatePrice(3400000 * getColorMultiplier('White'), gender),
              originalPrice: 4000000,
              stock: 18,
              specifications: {
                size: '39',
                color: 'White',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 40 - White - ${gender}`,
              sku: `NK270-WH-${gender[0]}-40`,
              price: calculatePrice(3400000 * getColorMultiplier('White'), gender),
              originalPrice: 4000000,
              stock: 22,
              specifications: {
                size: '40',
                color: 'White',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Red - Nữ + Unisex only
          ...['Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 38 - Red - ${gender}`,
              sku: `NK270-RD-${gender[0]}-38`,
              price: calculatePrice(3800000 * getColorMultiplier('Red'), gender),
              originalPrice: 4500000,
              stock: 8,
              specifications: {
                size: '38',
                color: 'Red',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 39 - Red - ${gender}`,
              sku: `NK270-RD-${gender[0]}-39`,
              price: calculatePrice(3800000 * getColorMultiplier('Red'), gender),
              originalPrice: 4500000,
              stock: 10,
              specifications: {
                size: '39',
                color: 'Red',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Blue - Nam + Unisex
          ...['Nam', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 40 - Blue - ${gender}`,
              sku: `NK270-BL-${gender[0]}-40`,
              price: calculatePrice(3600000 * getColorMultiplier('Blue'), gender),
              originalPrice: 4300000,
              stock: 12,
              specifications: {
                size: '40',
                color: 'Blue',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 41 - Blue - ${gender}`,
              sku: `NK270-BL-${gender[0]}-41`,
              price: calculatePrice(3600000 * getColorMultiplier('Blue'), gender),
              originalPrice: 4300000,
              stock: 15,
              specifications: {
                size: '41',
                color: 'Blue',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Pink - Nữ only (màu hiếm +25%)
          {
            variantName: 'Size 37 - Pink - Nữ',
            sku: 'NK270-PK-F-37',
            price: Math.round(3900000 * getColorMultiplier('Pink')),
            originalPrice: 4600000,
            stock: 5,
            specifications: {
              size: '37',
              color: 'Pink',
              material: 'Mesh/Leather',
              shoeType: 'Running',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
          {
            variantName: 'Size 38 - Pink - Nữ',
            sku: 'NK270-PK-F-38',
            price: Math.round(3900000 * getColorMultiplier('Pink')),
            originalPrice: 4600000,
            stock: 6,
            specifications: {
              size: '38',
              color: 'Pink',
              material: 'Mesh/Leather',
              shoeType: 'Running',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
          // Yellow - Unisex
          {
            variantName: 'Size 39 - Yellow - Unisex',
            sku: 'NK270-YL-U-39',
            price: calculatePrice(3500000 * getColorMultiplier('Yellow'), 'Unisex'),
            originalPrice: 4100000,
            stock: 10,
            specifications: {
              size: '39',
              color: 'Yellow',
              material: 'Mesh/Leather',
              shoeType: 'Running',
              gender: 'Unisex',
            },
            isAvailable: true,
          },
          {
            variantName: 'Size 40 - Yellow - Unisex',
            sku: 'NK270-YL-U-40',
            price: calculatePrice(3500000 * getColorMultiplier('Yellow'), 'Unisex'),
            originalPrice: 4100000,
            stock: 12,
            specifications: {
              size: '40',
              color: 'Yellow',
              material: 'Mesh/Leather',
              shoeType: 'Running',
              gender: 'Unisex',
            },
            isAvailable: true,
          },
          // Gray - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 39 - Gray - ${gender}`,
              sku: `NK270-GY-${gender[0]}-39`,
              price: calculatePrice(3300000 * getColorMultiplier('Gray'), gender),
              originalPrice: 3900000,
              stock: 16,
              specifications: {
                size: '39',
                color: 'Gray',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 40 - Gray - ${gender}`,
              sku: `NK270-GY-${gender[0]}-40`,
              price: calculatePrice(3300000 * getColorMultiplier('Gray'), gender),
              originalPrice: 3900000,
              stock: 18,
              specifications: {
                size: '40',
                color: 'Gray',
                material: 'Mesh/Leather',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
          ]),
        ],
        images: [PLACEHOLDER_IMAGES.nike],
        createdBy: seller._id,
        features: ['Đệm khí Max Air 270', 'Upper mesh thoáng khí', 'Đa dạng màu sắc và gender'],
        isActive: true,
        isFeatured: true,
      },

      // 2. ADIDAS ULTRABOOST - 8 colors x 3 genders
      {
        name: 'Adidas Ultraboost 22',
        description:
          'Giày chạy bộ cao cấp với công nghệ Boost. Giá khác biệt rõ rệt giữa Nam/Nữ/Unisex.',
        brand: 'Adidas',
        category: 'Running',
        gender: 'Unisex',
        basePrice: 4500000,
        variants: [
          // Core Black - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 39 - Core Black - ${gender}`,
              sku: `ADS-UB-CB-${gender[0]}-39`,
              price: calculatePrice(4500000 * getColorMultiplier('Black'), gender),
              originalPrice: 5200000,
              stock: 12,
              specifications: {
                size: '39',
                color: 'Core Black',
                material: 'Primeknit',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 40 - Core Black - ${gender}`,
              sku: `ADS-UB-CB-${gender[0]}-40`,
              price: calculatePrice(4500000 * getColorMultiplier('Black'), gender),
              originalPrice: 5200000,
              stock: 15,
              specifications: {
                size: '40',
                color: 'Core Black',
                material: 'Primeknit',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Cloud White - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 39 - Cloud White - ${gender}`,
              sku: `ADS-UB-CW-${gender[0]}-39`,
              price: calculatePrice(4400000 * getColorMultiplier('White'), gender),
              originalPrice: 5100000,
              stock: 15,
              specifications: {
                size: '39',
                color: 'Cloud White',
                material: 'Primeknit',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 40 - Cloud White - ${gender}`,
              sku: `ADS-UB-CW-${gender[0]}-40`,
              price: calculatePrice(4400000 * getColorMultiplier('White'), gender),
              originalPrice: 5100000,
              stock: 18,
              specifications: {
                size: '40',
                color: 'Cloud White',
                material: 'Primeknit',
                shoeType: 'Running',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Purple - Nữ only (màu hiếm)
          {
            variantName: 'Size 38 - Purple - Nữ',
            sku: 'ADS-UB-PR-F-38',
            price: Math.round(4700000 * getColorMultiplier('Purple')),
            originalPrice: 5400000,
            stock: 7,
            specifications: {
              size: '38',
              color: 'Purple',
              material: 'Primeknit',
              shoeType: 'Running',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
          {
            variantName: 'Size 39 - Purple - Nữ',
            sku: 'ADS-UB-PR-F-39',
            price: Math.round(4700000 * getColorMultiplier('Purple')),
            originalPrice: 5400000,
            stock: 9,
            specifications: {
              size: '39',
              color: 'Purple',
              material: 'Primeknit',
              shoeType: 'Running',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
        ],
        images: [PLACEHOLDER_IMAGES.adidas],
        createdBy: seller._id,
        features: ['Công nghệ Boost', 'Primeknit upper', 'Giá khác biệt theo gender'],
        isActive: true,
        isFeatured: true,
      },

      // 3. CONVERSE CHUCK TAYLOR - 10 colors x 3 genders
      {
        name: 'Converse Chuck Taylor All Star',
        description:
          'Giày sneaker kinh điển với thiết kế vượt thời gian. Đa dạng màu sắc cho mọi giới tính.',
        brand: 'Converse',
        category: 'Casual',
        gender: 'Unisex',
        basePrice: 1800000,
        variants: [
          // Black - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 38 - Black - ${gender}`,
              sku: `CNV-CT-BK-${gender[0]}-38`,
              price: calculatePrice(1800000 * getColorMultiplier('Black'), gender),
              originalPrice: 2200000,
              stock: 20,
              specifications: {
                size: '38',
                color: 'Black',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 39 - Black - ${gender}`,
              sku: `CNV-CT-BK-${gender[0]}-39`,
              price: calculatePrice(1800000 * getColorMultiplier('Black'), gender),
              originalPrice: 2200000,
              stock: 25,
              specifications: {
                size: '39',
                color: 'Black',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // White - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 38 - White - ${gender}`,
              sku: `CNV-CT-WH-${gender[0]}-38`,
              price: calculatePrice(1750000 * getColorMultiplier('White'), gender),
              originalPrice: 2100000,
              stock: 22,
              specifications: {
                size: '38',
                color: 'White',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 39 - White - ${gender}`,
              sku: `CNV-CT-WH-${gender[0]}-39`,
              price: calculatePrice(1750000 * getColorMultiplier('White'), gender),
              originalPrice: 2100000,
              stock: 25,
              specifications: {
                size: '39',
                color: 'White',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Red - Nữ + Unisex
          ...['Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 38 - Red - ${gender}`,
              sku: `CNV-CT-RD-${gender[0]}-38`,
              price: calculatePrice(1900000 * getColorMultiplier('Red'), gender),
              originalPrice: 2300000,
              stock: 10,
              specifications: {
                size: '38',
                color: 'Red',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 39 - Red - ${gender}`,
              sku: `CNV-CT-RD-${gender[0]}-39`,
              price: calculatePrice(1900000 * getColorMultiplier('Red'), gender),
              originalPrice: 2300000,
              stock: 12,
              specifications: {
                size: '39',
                color: 'Red',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Navy - Nam + Unisex
          ...['Nam', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 40 - Navy - ${gender}`,
              sku: `CNV-CT-NV-${gender[0]}-40`,
              price: calculatePrice(1850000 * getColorMultiplier('Navy'), gender),
              originalPrice: 2200000,
              stock: 15,
              specifications: {
                size: '40',
                color: 'Navy',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 41 - Navy - ${gender}`,
              sku: `CNV-CT-NV-${gender[0]}-41`,
              price: calculatePrice(1850000 * getColorMultiplier('Navy'), gender),
              originalPrice: 2200000,
              stock: 18,
              specifications: {
                size: '41',
                color: 'Navy',
                material: 'Canvas',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Pink - Nữ only (hot color)
          {
            variantName: 'Size 37 - Pink - Nữ',
            sku: 'CNV-CT-PK-F-37',
            price: Math.round(1950000 * getColorMultiplier('Pink')),
            originalPrice: 2400000,
            stock: 8,
            specifications: {
              size: '37',
              color: 'Pink',
              material: 'Canvas',
              shoeType: 'Sneakers',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
          {
            variantName: 'Size 38 - Pink - Nữ',
            sku: 'CNV-CT-PK-F-38',
            price: Math.round(1950000 * getColorMultiplier('Pink')),
            originalPrice: 2400000,
            stock: 10,
            specifications: {
              size: '38',
              color: 'Pink',
              material: 'Canvas',
              shoeType: 'Sneakers',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
          // Yellow - Unisex
          {
            variantName: 'Size 38 - Yellow - Unisex',
            sku: 'CNV-CT-YL-U-38',
            price: calculatePrice(1800000 * getColorMultiplier('Yellow'), 'Unisex'),
            originalPrice: 2200000,
            stock: 12,
            specifications: {
              size: '38',
              color: 'Yellow',
              material: 'Canvas',
              shoeType: 'Sneakers',
              gender: 'Unisex',
            },
            isAvailable: true,
          },
          {
            variantName: 'Size 39 - Yellow - Unisex',
            sku: 'CNV-CT-YL-U-39',
            price: calculatePrice(1800000 * getColorMultiplier('Yellow'), 'Unisex'),
            originalPrice: 2200000,
            stock: 14,
            specifications: {
              size: '39',
              color: 'Yellow',
              material: 'Canvas',
              shoeType: 'Sneakers',
              gender: 'Unisex',
            },
            isAvailable: true,
          },
        ],
        images: [PLACEHOLDER_IMAGES.converse],
        createdBy: seller._id,
        features: ['Thiết kế iconic', 'Canvas bền bỉ', 'Đa dạng màu sắc'],
        isActive: true,
        isFeatured: true,
      },

      // 4. VANS OLD SKOOL - 6 colors x 3 genders
      {
        name: 'Vans Old Skool',
        description:
          'Giày sneaker Vans Old Skool với sọc trademark đặc trưng. Đa dạng gender và màu sắc.',
        brand: 'Vans',
        category: 'Sneakers',
        gender: 'Unisex',
        basePrice: 1800000,
        variants: [
          // Black/White - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 38 - Black/White - ${gender}`,
              sku: `VN-OS-BW-${gender[0]}-38`,
              price: calculatePrice(1800000 * getColorMultiplier('Black'), gender),
              originalPrice: 2100000,
              stock: 15,
              specifications: {
                size: '38',
                color: 'Black/White',
                material: 'Canvas/Suede',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 39 - Black/White - ${gender}`,
              sku: `VN-OS-BW-${gender[0]}-39`,
              price: calculatePrice(1800000 * getColorMultiplier('Black'), gender),
              originalPrice: 2100000,
              stock: 18,
              specifications: {
                size: '39',
                color: 'Black/White',
                material: 'Canvas/Suede',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Red - Nữ + Unisex
          ...['Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 38 - Red - ${gender}`,
              sku: `VN-OS-RD-${gender[0]}-38`,
              price: calculatePrice(1900000 * getColorMultiplier('Red'), gender),
              originalPrice: 2200000,
              stock: 10,
              specifications: {
                size: '38',
                color: 'Red',
                material: 'Canvas/Suede',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 39 - Red - ${gender}`,
              sku: `VN-OS-RD-${gender[0]}-39`,
              price: calculatePrice(1900000 * getColorMultiplier('Red'), gender),
              originalPrice: 2200000,
              stock: 12,
              specifications: {
                size: '39',
                color: 'Red',
                material: 'Canvas/Suede',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
          ]),
        ],
        images: [PLACEHOLDER_IMAGES.vans],
        createdBy: seller._id,
        features: ['Sọc Sidestripe™ cổ điển', 'Waffle outsole', 'Đa dạng màu sắc'],
        isActive: true,
        isFeatured: true,
      },

      // 5. PUMA SUEDE CLASSIC - 5 colors x 3 genders
      {
        name: 'Puma Suede Classic XXI',
        description:
          'Giày sneaker Puma Suede với chất liệu da lộn cao cấp. Giá khác biệt theo gender.',
        brand: 'Puma',
        category: 'Sneakers',
        gender: 'Unisex',
        basePrice: 2200000,
        variants: [
          // Black - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 39 - Black - ${gender}`,
              sku: `PM-SD-BK-${gender[0]}-39`,
              price: calculatePrice(2200000 * getColorMultiplier('Black'), gender),
              originalPrice: 2600000,
              stock: 12,
              specifications: {
                size: '39',
                color: 'Black',
                material: 'Suede',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 40 - Black - ${gender}`,
              sku: `PM-SD-BK-${gender[0]}-40`,
              price: calculatePrice(2200000 * getColorMultiplier('Black'), gender),
              originalPrice: 2600000,
              stock: 15,
              specifications: {
                size: '40',
                color: 'Black',
                material: 'Suede',
                shoeType: 'Sneakers',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Red - Nữ only
          {
            variantName: 'Size 38 - Red - Nữ',
            sku: 'PM-SD-RD-F-38',
            price: Math.round(2300000 * getColorMultiplier('Red')),
            originalPrice: 2700000,
            stock: 8,
            specifications: {
              size: '38',
              color: 'Red',
              material: 'Suede',
              shoeType: 'Sneakers',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
          {
            variantName: 'Size 39 - Red - Nữ',
            sku: 'PM-SD-RD-F-39',
            price: Math.round(2300000 * getColorMultiplier('Red')),
            originalPrice: 2700000,
            stock: 10,
            specifications: {
              size: '39',
              color: 'Red',
              material: 'Suede',
              shoeType: 'Sneakers',
              gender: 'Nữ',
            },
            isAvailable: true,
          },
        ],
        images: [PLACEHOLDER_IMAGES.puma],
        createdBy: seller._id,
        features: ['Da lộn cao cấp', 'Thiết kế retro', 'Đa dạng gender'],
        isActive: true,
        isFeatured: true,
      },

      // 6. NEW BALANCE 574 - 4 colors x 3 genders
      {
        name: 'New Balance 574 Core',
        description:
          'Giày sneaker New Balance 574 với thiết kế retro running. Giá khác biệt theo gender và màu.',
        brand: 'New Balance',
        category: 'Lifestyle',
        gender: 'Unisex',
        basePrice: 2400000,
        variants: [
          // Gray - All genders
          ...['Nam', 'Nữ', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 39 - Gray - ${gender}`,
              sku: `NB-574-GY-${gender[0]}-39`,
              price: calculatePrice(2400000 * getColorMultiplier('Gray'), gender),
              originalPrice: 2800000,
              stock: 12,
              specifications: {
                size: '39',
                color: 'Gray',
                material: 'Suede/Mesh',
                shoeType: 'Lifestyle',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 40 - Gray - ${gender}`,
              sku: `NB-574-GY-${gender[0]}-40`,
              price: calculatePrice(2400000 * getColorMultiplier('Gray'), gender),
              originalPrice: 2800000,
              stock: 15,
              specifications: {
                size: '40',
                color: 'Gray',
                material: 'Suede/Mesh',
                shoeType: 'Lifestyle',
                gender,
              },
              isAvailable: true,
            },
          ]),
          // Navy - Nam + Unisex
          ...['Nam', 'Unisex'].flatMap((gender) => [
            {
              variantName: `Size 40 - Navy - ${gender}`,
              sku: `NB-574-NV-${gender[0]}-40`,
              price: calculatePrice(2400000 * getColorMultiplier('Navy'), gender),
              originalPrice: 2800000,
              stock: 10,
              specifications: {
                size: '40',
                color: 'Navy',
                material: 'Suede/Mesh',
                shoeType: 'Lifestyle',
                gender,
              },
              isAvailable: true,
            },
            {
              variantName: `Size 41 - Navy - ${gender}`,
              sku: `NB-574-NV-${gender[0]}-41`,
              price: calculatePrice(2400000 * getColorMultiplier('Navy'), gender),
              originalPrice: 2800000,
              stock: 12,
              specifications: {
                size: '41',
                color: 'Navy',
                material: 'Suede/Mesh',
                shoeType: 'Lifestyle',
                gender,
              },
              isAvailable: true,
            },
          ]),
        ],
        images: [PLACEHOLDER_IMAGES.newbalance],
        createdBy: seller._id,
        features: ['ENCAP midsole', 'Retro running style', 'Đa dạng gender'],
        isActive: true,
        isFeatured: true,
      },
    ]

    // Insert products
    for (const productData of products) {
      try {
        const exists = await Product.findOne({ name: productData.name })
        if (exists) {
          console.log(`⚠️  "${productData.name}" already exists, updating...`)
          await Product.findByIdAndUpdate(exists._id, productData)
          console.log(`✅ Updated: ${productData.name} (${productData.variants.length} variants)`)
        } else {
          await Product.create(productData)
          console.log(`✅ Created: ${productData.name} (${productData.variants.length} variants)`)
        }
      } catch (error) {
        console.error(`❌ Error with ${productData.name}:`, error.message)
      }
    }

    console.log('🎉 Seeding completed!')
    console.log(
      `📊 Total: ${products.length} products with diverse genders (Nam/Nữ/Unisex) and colors`
    )
  }
}
