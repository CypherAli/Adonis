/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.newsModel
        .find({ status: 'published' })
        .populate('author', 'name')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.newsModel.countDocuments({ status: 'published' }),
    ]);

    return {
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const news = await this.newsModel
      .findOne({ slug, status: 'published' })
      .populate('author', 'name avatar')
      .exec();

    if (news) {
      await this.newsModel.findByIdAndUpdate(news._id, {
        $inc: { viewCount: 1 },
      });
    }

    return news;
  }

  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
    status?: string;
    author: string;
  }) {
    const slug = this.generateSlug(data.title);

    const news = await this.newsModel.create({
      ...data,
      slug,
      publishedAt: data.status === 'published' ? new Date() : undefined,
    });

    return news;
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      excerpt: string;
      coverImage: string;
      tags: string[];
      status: string;
    }>,
  ) {
    const news = await this.newsModel.findById(id);
    if (!news) {
      throw new NotFoundException('News article not found');
    }

    if (data.title && data.title !== news.title) {
      (data as any).slug = this.generateSlug(data.title);
    }

    if (data.status === 'published' && news.status !== 'published') {
      (data as any).publishedAt = new Date();
    }

    return this.newsModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    const news = await this.newsModel.findById(id);
    if (!news) {
      throw new NotFoundException('News article not found');
    }
    await this.newsModel.findByIdAndDelete(id);
    return { message: 'News article deleted successfully' };
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() +
      '-' +
      Date.now().toString(36)
    );
  }
}
