import { Repository } from 'typeorm';
import { PageView } from './entities/page-view.entity';
import { Article } from '../articles/entities/article.entity';
import { ArticleLike } from '../articles/entities/article-like.entity';
export declare class AnalyticsService {
    private pvRepo;
    private articleRepo;
    private likeRepo;
    constructor(pvRepo: Repository<PageView>, articleRepo: Repository<Article>, likeRepo: Repository<ArticleLike>);
    trackView(path: string, articleId?: number, ipAddress?: string, userAgent?: string, referrer?: string): Promise<PageView>;
    getDashboardStats(): Promise<{
        totalArticles: number;
        publishedArticles: number;
        totalViews: number;
        totalLikes: number;
        viewsToday: number;
    }>;
    getArticlesPerDay(days?: number): Promise<any[]>;
    getArticlesPerMonth(months?: number): Promise<any[]>;
    getViewsPerDay(days?: number): Promise<any[]>;
    getLikesPerArticle(limit?: number): Promise<any[]>;
    getTopArticles(limit?: number): Promise<Article[]>;
}
