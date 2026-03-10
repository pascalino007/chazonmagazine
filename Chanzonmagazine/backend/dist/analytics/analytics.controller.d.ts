import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly svc;
    constructor(svc: AnalyticsService);
    track(body: any, req: any): Promise<import("./entities/page-view.entity").PageView>;
    getDashboardStats(): Promise<{
        totalArticles: number;
        publishedArticles: number;
        totalViews: number;
        totalLikes: number;
        viewsToday: number;
    }>;
    articlesPerDay(days?: string): Promise<any[]>;
    articlesPerMonth(months?: string): Promise<any[]>;
    viewsPerDay(days?: string): Promise<any[]>;
    likesPerArticle(limit?: string): Promise<any[]>;
    topArticles(limit?: string): Promise<import("../articles/entities/article.entity").Article[]>;
}
