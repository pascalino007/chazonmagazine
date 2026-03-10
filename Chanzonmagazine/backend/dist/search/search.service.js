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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("../articles/entities/article.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const project_entity_1 = require("../projects/entities/project.entity");
let SearchService = class SearchService {
    constructor(articleRepo, categoryRepo, projectRepo) {
        this.articleRepo = articleRepo;
        this.categoryRepo = categoryRepo;
        this.projectRepo = projectRepo;
    }
    async search(query, limit = 10) {
        if (!query || query.trim().length < 2)
            return { articles: [], categories: [], projects: [] };
        const q = `%${query.trim()}%`;
        const [articles, categories, projects] = await Promise.all([
            this.articleRepo.find({
                where: [
                    { title: (0, typeorm_2.Like)(q), status: 'published' },
                    { shortDescription: (0, typeorm_2.Like)(q), status: 'published' },
                ],
                take: limit,
                order: { createdAt: 'DESC' },
            }),
            this.categoryRepo.find({
                where: [{ name: (0, typeorm_2.Like)(q) }, { slug: (0, typeorm_2.Like)(q) }],
                take: 5,
            }),
            this.projectRepo.find({
                where: [
                    { title: (0, typeorm_2.Like)(q), isActive: true },
                    { shortDescription: (0, typeorm_2.Like)(q), isActive: true },
                ],
                take: 5,
            }),
        ]);
        return { articles, categories, projects, total: articles.length + categories.length + projects.length };
    }
    async searchArticles(query, categorySlug, page = 1, limit = 12) {
        const q = `%${query.trim()}%`;
        const qb = this.articleRepo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.category', 'cat')
            .leftJoinAndSelect('a.tags', 'tag')
            .where('a.status = :status', { status: 'published' })
            .andWhere('(a.title LIKE :q OR a.shortDescription LIKE :q OR a.content LIKE :q)', { q })
            .orderBy('a.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (categorySlug)
            qb.andWhere('cat.slug = :catSlug', { catSlug: categorySlug });
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map