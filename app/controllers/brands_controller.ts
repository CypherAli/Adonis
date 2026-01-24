import type { HttpContext } from '@adonisjs/core/http'
import { Brand } from '#models/brand'
import mongoose from 'mongoose'

export default class BrandsController {
  /**
   * Get all brands with pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 50, isActive, search } = request.qs()

      const filter: any = {}

      if (isActive !== undefined) {
        filter.isActive = isActive === 'true'
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ]
      }

      const pageNum = Number(page)
      const limitNum = Number(limit)
      const skip = (pageNum - 1) * limitNum

      const [brands, total] = await Promise.all([
        Brand.find(filter).sort({ order: 1, name: 1 }).skip(skip).limit(limitNum).lean(),
        Brand.countDocuments(filter),
      ])

      return response.json({
        brands,
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalBrands: total,
      })
    } catch (error) {
      console.error('Get brands error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Get all active brands (no pagination, for dropdowns)
   */
  async list({ response }: HttpContext) {
    try {
      const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean()

      return response.json({ brands })
    } catch (error) {
      console.error('Get brands list error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Get single brand
   */
  async show({ params, response }: HttpContext) {
    try {
      if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return response.status(400).json({
          message: 'ID thương hiệu không hợp lệ',
        })
      }

      const brand = await Brand.findById(params.id).lean()

      if (!brand) {
        return response.status(404).json({
          message: 'Không tìm thấy thương hiệu',
        })
      }

      return response.json({ brand })
    } catch (error) {
      console.error('Get brand error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Create new brand (Admin only)
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'name',
        'description',
        'logo',
        'website',
        'country',
        'isActive',
        'order',
        'metaTitle',
        'metaDescription',
      ])

      const brand = await Brand.create(data)

      return response.status(201).json({
        message: 'Tạo thương hiệu thành công',
        brand,
      })
    } catch (error) {
      console.error('Create brand error:', error)

      if (error.code === 11000) {
        return response.status(400).json({
          message: 'Tên thương hiệu đã tồn tại',
        })
      }

      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Update brand (Admin only)
   */
  async update({ params, request, response }: HttpContext) {
    try {
      if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return response.status(400).json({
          message: 'ID thương hiệu không hợp lệ',
        })
      }

      const brand = await Brand.findById(params.id)

      if (!brand) {
        return response.status(404).json({
          message: 'Không tìm thấy thương hiệu',
        })
      }

      const data = request.only([
        'name',
        'description',
        'logo',
        'website',
        'country',
        'isActive',
        'order',
        'metaTitle',
        'metaDescription',
      ])

      Object.assign(brand, data)
      await brand.save()

      return response.json({
        message: 'Cập nhật thương hiệu thành công',
        brand,
      })
    } catch (error) {
      console.error('Update brand error:', error)

      if (error.code === 11000) {
        return response.status(400).json({
          message: 'Tên thương hiệu đã tồn tại',
        })
      }

      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Delete brand (Admin only)
   */
  async destroy({ params, response }: HttpContext) {
    try {
      if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return response.status(400).json({
          message: 'ID thương hiệu không hợp lệ',
        })
      }

      const brand = await Brand.findById(params.id)

      if (!brand) {
        return response.status(404).json({
          message: 'Không tìm thấy thương hiệu',
        })
      }

      // Check if brand has products (would need Product model)
      // const productsCount = await Product.countDocuments({ brandId: params.id })
      // if (productsCount > 0) {
      //   return response.status(400).json({
      //     message: 'Không thể xóa thương hiệu có sản phẩm',
      //   })
      // }

      await Brand.findByIdAndDelete(params.id)

      return response.json({
        message: 'Xóa thương hiệu thành công',
      })
    } catch (error) {
      console.error('Delete brand error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Toggle brand active status (Admin only)
   */
  async toggleActive({ params, response }: HttpContext) {
    try {
      if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return response.status(400).json({
          message: 'ID thương hiệu không hợp lệ',
        })
      }

      const brand = await Brand.findById(params.id)

      if (!brand) {
        return response.status(404).json({
          message: 'Không tìm thấy thương hiệu',
        })
      }

      brand.isActive = !brand.isActive
      await brand.save()

      return response.json({
        message: brand.isActive ? 'Đã kích hoạt thương hiệu' : 'Đã vô hiệu hóa thương hiệu',
        brand,
      })
    } catch (error) {
      console.error('Toggle brand active error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }
}
