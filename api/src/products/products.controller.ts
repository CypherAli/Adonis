import { Controller, Get, Query, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: GetProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get('filters/categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('filters/brands')
  async getBrands() {
    return this.productsService.getBrands();
  }

  @Get('filters/sizes')
  async getSizes() {
    return this.productsService.getSizes();
  }

  @Get('filters/colors')
  async getColors() {
    return this.productsService.getColors();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post(':id/view')
  async incrementView(@Param('id') id: string) {
    return this.productsService.incrementView(id);
  }
}
