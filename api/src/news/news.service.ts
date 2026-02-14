import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
  ) {}

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
}
