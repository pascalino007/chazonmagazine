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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
let ProjectsService = class ProjectsService {
    constructor(repo) {
        this.repo = repo;
    }
    generateSlug(title) {
        return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    }
    async create(dto) {
        if (!dto.slug && dto.title)
            dto.slug = this.generateSlug(dto.title);
        return this.repo.save(this.repo.create(dto));
    }
    async findAll(activeOnly = false) {
        const where = activeOnly ? { isActive: true } : {};
        return this.repo.find({ where, order: { order: 'ASC', createdAt: 'DESC' } });
    }
    async findOne(id) {
        const p = await this.repo.findOne({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException(`Project #${id} not found`);
        return p;
    }
    async findBySlug(slug) {
        const p = await this.repo.findOne({ where: { slug } });
        if (!p)
            throw new common_1.NotFoundException(`Project "${slug}" not found`);
        return p;
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const p = await this.findOne(id);
        await this.repo.remove(p);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map