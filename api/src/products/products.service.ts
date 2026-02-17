import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { GetProductsDto } from './dto/get-products.dto';

// Mongoose filter type for product queries
interface ProductFilter {
  isActive: boolean;
  $text?: { $search: string };
  category?: string;
  brand?: string | { $in: string[] };
  basePrice?: { $gte?: number; $lte?: number };
  'variants.specifications.size'?: string | { $in: string[] };
  'variants.specifications.color'?: string | { $in: string[] };
  'variants.specifications.gender'?: string;
  'variants.stock'?: { $gt: number };
  isFeatured?: boolean;
  _id?: { $ne: string };
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: GetProductsDto) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      gender,
      isFeatured,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      exclude,
    } = query;

    // Build filter
    const filter: ProductFilter = { isActive: true };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Brand filter (supports comma-separated values)
    if (brand) {
      const brands = brand
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);
      if (brands.length === 1) {
        filter.brand = brands[0];
      } else if (brands.length > 1) {
        filter.brand = { $in: brands };
      }
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: { $gte?: number; $lte?: number } = {};
      if (minPrice !== undefined) priceFilter.$gte = minPrice;
      if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
      filter.basePrice = priceFilter;
    }

    // Variant filters (size, color, gender) - support comma-separated values
    if (size) {
      const sizes = size
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      filter['variants.specifications.size'] =
        sizes.length === 1 ? sizes[0] : { $in: sizes };
    }
    if (color) {
      const colors = color
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      filter['variants.specifications.color'] =
        colors.length === 1 ? colors[0] : { $in: colors };
    }
    if (gender) {
      filter['variants.specifications.gender'] = gender;
    }

    // In stock filter
    if (inStock) {
      filter['variants.stock'] = { $gt: 0 };
    }

    // Featured filter
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    // Exclude filter
    if (exclude) {
      filter._id = { $ne: exclude };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sort
    const sort: Record<string, SortOrder> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name shopName')
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    return this.productModel
      .findById(id)
      .populate('createdBy', 'name shopName email')
      .exec();
  }

  async incrementView(id: string) {
    return this.productModel.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true },
    );
  }

  async getCategories() {
    return this.productModel.distinct('category').exec();
  }

  async getBrands() {
    return this.productModel.distinct('brand').exec();
  }

  async getSizes(): Promise<string[]> {
    const results: Array<{ _id: string }> = await this.productModel.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$variants' },
      {
        $match: {
          'variants.specifications.size': { $exists: true, $ne: null },
        },
      },
      { $group: { _id: '$variants.specifications.size' } },
      { $sort: { _id: 1 } },
    ]);
    return results.map((r) => r._id);
  }

  async getColors(): Promise<string[]> {
    const results: Array<{ _id: string }> = await this.productModel.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$variants' },
      {
        $match: {
          'variants.specifications.color': { $exists: true, $ne: null },
        },
      },
      { $group: { _id: '$variants.specifications.color' } },
      { $sort: { _id: 1 } },
    ]);
    return results.map((r) => r._id);
  }
}
