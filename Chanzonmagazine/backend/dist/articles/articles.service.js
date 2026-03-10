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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./entities/article.entity");
const tag_entity_1 = require("./entities/tag.entity");
const article_like_entity_1 = require("./entities/article-like.entity");
let ArticlesService = class ArticlesService {
    constructor(articleRepo, tagRepo, likeRepo) {
        this.articleRepo = articleRepo;
        this.tagRepo = tagRepo;
        this.likeRepo = likeRepo;
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    async create(dto) {
        const slug = this.generateSlug(dto.title);
        let tags = [];
        if (dto.tags?.length) {
            tags = await Promise.all(dto.tags.map(async (name) => {
                const tagSlug = this.generateSlug(name);
                let tag = await this.tagRepo.findOne({ where: { slug: tagSlug } });
                if (!tag) {
                    tag = this.tagRepo.create({ name: name.trim(), slug: tagSlug });
                    await this.tagRepo.save(tag);
                }
                return tag;
            }));
        }
        const article = this.articleRepo.create({ ...dto, slug, tags });
        return this.articleRepo.save(article);
    }
    async findAll(page = 1, limit = 20, status, categoryId) {
        const where = {};
        if (status)
            where.status = status;
        if (categoryId)
            where.categoryId = categoryId;
        const [data, total] = await this.articleRepo.findAndCount({
            where,
            relations: ['category', 'tags'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }
    async findPublished(page = 1, limit = 12, categorySlug) {
        const qb = this.articleRepo.createQueryBuilder('a')
            .leftJoinAndSelect('a.category', 'cat')
            .leftJoinAndSelect('a.tags', 'tag')
            .where('a.status = :status', { status: 'published' })
            .orderBy('a.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (categorySlug)
            qb.andWhere('cat.slug = :slug', { slug: categorySlug });
        const [data, total] = await qb.getManyAndCount();
        return { data, total };
    }
    async findOne(id) {
        const article = await this.articleRepo.findOne({ where: { id }, relations: ['category', 'tags'] });
        if (!article)
            throw new common_1.NotFoundException(`Article #${id} not found`);
        await this.articleRepo.increment({ id }, 'viewCount', 1);
        return article;
    }
    async findBySlug(slug) {
        const article = await this.articleRepo.findOne({ where: { slug }, relations: ['category', 'tags'] });
        if (!article)
            throw new common_1.NotFoundException(`Article "${slug}" not found`);
        await this.articleRepo.increment({ id: article.id }, 'viewCount', 1);
        return article;
    }
    async update(id, dto) {
        const article = await this.findOne(id);
        if (dto.tags !== undefined) {
            const tags = await Promise.all(dto.tags.map(async (name) => {
                const tagSlug = this.generateSlug(name);
                let tag = await this.tagRepo.findOne({ where: { slug: tagSlug } });
                if (!tag) {
                    tag = this.tagRepo.create({ name: name.trim(), slug: tagSlug });
                    await this.tagRepo.save(tag);
                }
                return tag;
            }));
            article.tags = tags;
        }
        Object.assign(article, dto);
        return this.articleRepo.save(article);
    }
    async remove(id) {
        const article = await this.findOne(id);
        await this.articleRepo.remove(article);
    }
    async toggleLike(articleId, ipAddress) {
        const existing = await this.likeRepo.findOne({ where: { articleId, ipAddress } });
        if (existing) {
            await this.likeRepo.remove(existing);
            const count = await this.likeRepo.count({ where: { articleId } });
            return { liked: false, count };
        }
        const like = this.likeRepo.create({ articleId, ipAddress });
        await this.likeRepo.save(like);
        const count = await this.likeRepo.count({ where: { articleId } });
        return { liked: true, count };
    }
    async getLikeCount(articleId) {
        return this.likeRepo.count({ where: { articleId } });
    }
    async getStats() {
        const total = await this.articleRepo.count();
        const published = await this.articleRepo.count({ where: { status: 'published' } });
        const draft = await this.articleRepo.count({ where: { status: 'draft' } });
        const totalViews = await this.articleRepo
            .createQueryBuilder('a')
            .select('SUM(a.viewCount)', 'sum')
            .getRawOne();
        return { total, published, draft, totalViews: parseInt(totalViews?.sum || '0') };
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __param(2, (0, typeorm_1.InjectRepository)(article_like_entity_1.ArticleLike)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map