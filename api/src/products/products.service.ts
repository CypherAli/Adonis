import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { GetProductsDto } from './dto/get-products.dto';

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
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build filter
    const filter: FilterQuery<ProductDocument> = { isActive: true };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Brand filter
    if (brand) {
      filter.brand = brand;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.basePrice = {};
      if (minPrice !== undefined) filter.basePrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.basePrice.$lte = maxPrice;
    }

    // Variant filters (size, color, gender)
    if (size || color || gender) {
      const variantFilters: any = {};
      if (size) variantFilters['variants.specifications.size'] = size;
      if (color) variantFilters['variants.specifications.color'] = color;
      if (gender) variantFilters['variants.specifications.gender'] = gender;
      Object.assign(filter, variantFilters);
    }

    // Featured filter
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sort
    const sort: any = {};
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

  async getSizes() {
    const products = await this.productModel.find({ isActive: true }).exec();
    const sizes = new Set<string>();
    products.forEach(product => {
      product.variants.forEach(variant => {
        if (variant.specifications?.size) {
          sizes.add(variant.specifications.size);
        }
      });
    });
    return Array.from(sizes).sort();
  }

  async getColors() {
    const products = await this.productModel.find({ isActive: true }).exec();
    const colors = new Set<string>();
    products.forEach(product => {
      product.variants.forEach(variant => {
        if (variant.specifications?.color) {
          colors.add(variant.specifications.color);
        }
      });
    });
    return Array.from(colors);
  }
}
