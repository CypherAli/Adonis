import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { Product } from '#models/product'

export default class CheckExternalImages extends BaseCommand {
  static commandName = 'check:external:images'
  static description = 'Check for any remaining external image URLs'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Checking for external image URLs...\n')

    try {
      // Check for various external domains
      const externalDomains = [
        'assets.adidas.com',
        'static.nike.com',
        'images.puma.com',
        'converse.com',
        'nb.scene7.com',
      ]

      let totalFound = 0

      for (const domain of externalDomains) {
        const products = await Product.find({
          images: { $elemMatch: { $regex: domain } },
        })

        if (products.length > 0) {
          this.logger.warning(`Found ${products.length} products with ${domain} images:`)
          products.forEach((p) => {
            this.logger.info(`  - ${p.name} (${p.brand})`)
          })
          totalFound += products.length
        }
      }

      if (totalFound === 0) {
        this.logger.success('✅ No external brand URLs found! All images are using stable sources.')
      } else {
        this.logger.warning(`\n⚠️  Total: ${totalFound} products with external brand URLs`)
        this.logger.info('Run: node ace fix:product:images to fix them')
      }
    } catch (error) {
      this.logger.error('Error checking images:')
      this.logger.error(error.message)
      throw error
    }
  }
}
