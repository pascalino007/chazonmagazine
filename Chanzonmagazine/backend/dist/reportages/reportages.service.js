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
exports.ReportagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reportage_entity_1 = require("./entities/reportage.entity");
const tag_entity_1 = require("../articles/entities/tag.entity");
let ReportagesService = class ReportagesService {
    constructor(reportageRepo, tagRepo) {
        this.reportageRepo = reportageRepo;
        this.tagRepo = tagRepo;
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
        const reportage = this.reportageRepo.create({ ...dto, slug, tags });
        return this.reportageRepo.save(reportage);
    }
    async findAll(page = 1, limit = 20, status, categoryId) {
        const where = {};
        if (status)
            where.status = status;
        if (categoryId)
            where.categoryId = categoryId;
        const [data, total] = await this.reportageRepo.findAndCount({
            where,
            relations: ['category', 'tags'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }
    async findPublished(page = 1, limit = 12, categorySlug) {
        const qb = this.reportageRepo.createQueryBuilder('r')
            .leftJoinAndSelect('r.category', 'cat')
            .leftJoinAndSelect('r.tags', 'tag')
            .where('r.status = :status', { status: 'published' })
            .orderBy('r.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (categorySlug)
            qb.andWhere('cat.slug = :slug', { slug: categorySlug });
        const [data, total] = await qb.getManyAndCount();
        return { data, total };
    }
    async findOne(id) {
        const reportage = await this.reportageRepo.findOne({ where: { id }, relations: ['category', 'tags'] });
        if (!reportage)
            throw new common_1.NotFoundException(`Reportage #${id} not found`);
        await this.reportageRepo.increment({ id }, 'viewCount', 1);
        return reportage;
    }
    async findBySlug(slug) {
        const reportage = await this.reportageRepo.findOne({ where: { slug }, relations: ['category', 'tags'] });
        if (!reportage)
            throw new common_1.NotFoundException(`Reportage "${slug}" not found`);
        await this.reportageRepo.increment({ id: reportage.id }, 'viewCount', 1);
        return reportage;
    }
    async update(id, dto) {
        const reportage = await this.findOne(id);
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
            reportage.tags = tags;
        }
        Object.assign(reportage, dto);
        return this.reportageRepo.save(reportage);
    }
    async remove(id) {
        const reportage = await this.findOne(id);
        await this.reportageRepo.remove(reportage);
    }
    async getStats() {
        const total = await this.reportageRepo.count();
        const published = await this.reportageRepo.count({ where: { status: 'published' } });
        const draft = await this.reportageRepo.count({ where: { status: 'draft' } });
        const totalViews = await this.reportageRepo
            .createQueryBuilder('r')
            .select('SUM(r.viewCount)', 'sum')
            .getRawOne();
        return { total, published, draft, totalViews: parseInt(totalViews?.sum || '0') };
    }
};
exports.ReportagesService = ReportagesService;
exports.ReportagesService = ReportagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reportage_entity_1.Reportage)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportagesService);
//# sourceMappingURL=reportages.service.js.map