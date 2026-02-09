import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { Product } from '#models/product'

export default class FixProductImages extends BaseCommand {
  static commandName = 'fix:product:images'
  static description = 'Replace broken external image URLs with working placeholder images'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting product images fix...')

    try {
      // Find all products with external brand CDN images
      const externalDomains = [
        'assets.adidas.com',
        'static.nike.com',
        'images.puma.com',
        'converse.com',
        'nb.scene7.com',
      ]

      let allProducts: any[] = []
      
      for (const domain of externalDomains) {
        const products = await Product.find({
          images: { $elemMatch: { $regex: domain } },
        })
        allProducts = allProducts.concat(products)
      }

      // Remove duplicates by _id
      const uniqueProducts = Array.from(
        new Map(allProducts.map((p) => [p._id.toString(), p])).values()
      )

      this.logger.info(`Found ${uniqueProducts.length} products with external brand CDN images`)

      // Placeholder images mapping
      const placeholderMap = [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Nike style
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80', // Adidas style
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80', // Sneaker 1
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80', // Sneaker 2
        'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80', // Sneaker 3
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', // Vans style
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', // Sport shoe
      ]

      let updatedCount = 0

      for (const product of uniqueProducts) {
        const updatedImages = product.images.map((imageUrl, index) => {
          // Check if it's an external brand CDN URL
          const isExternalBrand =
            imageUrl.includes('assets.adidas.com') ||
            imageUrl.includes('static.nike.com') ||
            imageUrl.includes('images.puma.com') ||
            imageUrl.includes('converse.com') ||
            imageUrl.includes('nb.scene7.com')

          if (isExternalBrand) {
            // Use modulo to cycle through placeholders
            return placeholderMap[index % placeholderMap.length]
          }
          return imageUrl
        })

        // Also check if imageUrl field exists and update it
        let updatedImageUrl = product.imageUrl
        if (product.imageUrl) {
          const isExternalBrand =
            product.imageUrl.includes('assets.adidas.com') ||
            product.imageUrl.includes('static.nike.com') ||
            product.imageUrl.includes('images.puma.com') ||
            product.imageUrl.includes('converse.com') ||
            product.imageUrl.includes('nb.scene7.com')

          if (isExternalBrand) {
            updatedImageUrl = placeholderMap[0]
          }
        }

        // Update the product
        await Product.findByIdAndUpdate(product._id, {
          images: updatedImages,
          imageUrl: updatedImageUrl || updatedImages[0],
        })

        updatedCount++
        this.logger.info(
          `✓ Updated product: ${product.name} (${product.brand}) - ${updatedImages.length} images`
        )
      }

      this.logger.success(`\n✅ Successfully updated ${updatedCount} products!`)
      this.logger.info('All broken image URLs have been replaced with working placeholders.')
    } catch (error) {
      this.logger.error('Error fixing product images:')
      this.logger.error(error.message)
      throw error
    }
  }
}
