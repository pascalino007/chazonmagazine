import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PageView } from './entities/page-view.entity'
import { Article } from '../articles/entities/article.entity'
import { ArticleLike } from '../articles/entities/article-like.entity'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView) private pvRepo: Repository<PageView>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(ArticleLike) private likeRepo: Repository<ArticleLike>,
  ) {}

  async trackView(path: string, articleId?: number, ipAddress?: string, userAgent?: string, referrer?: string) {
    const pv = this.pvRepo.create({ path, articleId, ipAddress, userAgent, referrer })
    return this.pvRepo.save(pv)
  }

  async getDashboardStats() {
    const totalArticles = await this.articleRepo.count()
    const publishedArticles = await this.articleRepo.count({ where: { status: 'published' } })
    const totalViews = await this.pvRepo.count()
    const totalLikes = await this.likeRepo.count()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const viewsToday = await this.pvRepo
      .createQueryBuilder('pv')
      .where('pv.createdAt >= :today', { today })
      .getCount()

    return { totalArticles, publishedArticles, totalViews, totalLikes, viewsToday }
  }

  async getArticlesPerDay(days = 30) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const result = await this.articleRepo
      .createQueryBuilder('a')
      .select('DATE(a.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('a.createdAt >= :since', { since })
      .groupBy('DATE(a.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany()
    return result
  }

  async getArticlesPerMonth(months = 12) {
    const since = new Date()
    since.setMonth(since.getMonth() - months)
    const result = await this.articleRepo
      .createQueryBuilder('a')
      .select("DATE_FORMAT(a.createdAt, '%Y-%m')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('a.createdAt >= :since', { since })
      .groupBy("DATE_FORMAT(a.createdAt, '%Y-%m')")
      .orderBy('month', 'ASC')
      .getRawMany()
    return result
  }

  async getViewsPerDay(days = 30) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const result = await this.pvRepo
      .createQueryBuilder('pv')
      .select('DATE(pv.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('pv.createdAt >= :since', { since })
      .groupBy('DATE(pv.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany()
    return result
  }

  async getLikesPerArticle(limit = 10) {
    return this.likeRepo
      .createQueryBuilder('l')
      .select('l.articleId', 'articleId')
      .addSelect('COUNT(*)', 'likes')
      .leftJoin('l.article', 'a')
      .addSelect('a.title', 'title')
      .addSelect('a.slug', 'slug')
      .groupBy('l.articleId')
      .addGroupBy('a.title')
      .addGroupBy('a.slug')
      .orderBy('likes', 'DESC')
      .limit(limit)
      .getRawMany()
  }

  async getTopArticles(limit = 10) {
    return this.articleRepo.find({
      where: { status: 'published' },
      order: { viewCount: 'DESC' },
      take: limit,
      select: ['id', 'title', 'slug', 'viewCount', 'createdAt'],
    })
  }
}
