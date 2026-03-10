"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_view_entity_1 = require("./entities/page-view.entity");
const article_entity_1 = require("../articles/entities/article.entity");
const article_like_entity_1 = require("../articles/entities/article-like.entity");
let AnalyticsService = class AnalyticsService {
    constructor(pvRepo, articleRepo, likeRepo) {
        this.pvRepo = pvRepo;
        this.articleRepo = articleRepo;
        this.likeRepo = likeRepo;
    }
    async trackView(path, articleId, ipAddress, userAgent, referrer) {
        const pv = this.pvRepo.create({ path, articleId, ipAddress, userAgent, referrer });
        return this.pvRepo.save(pv);
    }
    async getDashboardStats() {
        const totalArticles = await this.articleRepo.count();
        const publishedArticles = await this.articleRepo.count({ where: { status: 'published' } });
        const totalViews = await this.pvRepo.count();
        const totalLikes = await this.likeRepo.count();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const viewsToday = await this.pvRepo
            .createQueryBuilder('pv')
            .where('pv.createdAt >= :today', { today })
            .getCount();
        return { totalArticles, publishedArticles, totalViews, totalLikes, viewsToday };
    }
    async getArticlesPerDay(days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const result = await this.articleRepo
            .createQueryBuilder('a')
            .select('DATE(a.createdAt)', 'date')
            .addSelect('COUNT(*)', 'count')
            .where('a.createdAt >= :since', { since })
            .groupBy('DATE(a.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
        return result;
    }
    async getArticlesPerMonth(months = 12) {
        const since = new Date();
        since.setMonth(since.getMonth() - months);
        const result = await this.articleRepo
            .createQueryBuilder('a')
            .select("DATE_FORMAT(a.createdAt, '%Y-%m')", 'month')
            .addSelect('COUNT(*)', 'count')
            .where('a.createdAt >= :since', { since })
            .groupBy("DATE_FORMAT(a.createdAt, '%Y-%m')")
            .orderBy('month', 'ASC')
            .getRawMany();
        return result;
    }
    async getViewsPerDay(days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const result = await this.pvRepo
            .createQueryBuilder('pv')
            .select('DATE(pv.createdAt)', 'date')
            .addSelect('COUNT(*)', 'count')
            .where('pv.createdAt >= :since', { since })
            .groupBy('DATE(pv.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
        return result;
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
            .getRawMany();
    }
    async getTopArticles(limit = 10) {
        return this.articleRepo.find({
            where: { status: 'published' },
            order: { viewCount: 'DESC' },
            take: limit,
            select: ['id', 'title', 'slug', 'viewCount', 'createdAt'],
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_view_entity_1.PageView)),
    __param(1, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(2, (0, typeorm_1.InjectRepository)(article_like_entity_1.ArticleLike)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map