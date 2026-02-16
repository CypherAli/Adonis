import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.newsService.findAll(page, limit);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: any,
    @Body()
    body: {
      title: string;
      content: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      status?: string;
    },
  ) {
    return this.newsService.create({
      ...body,
      author: user._id || user.id,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      status?: string;
    },
  ) {
    return this.newsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
}
