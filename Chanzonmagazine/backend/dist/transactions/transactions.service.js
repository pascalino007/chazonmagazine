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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("./entities/transaction.entity");
const uuid_1 = require("uuid");
let TransactionsService = class TransactionsService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        if (!dto.reference)
            dto.reference = `DON-${Date.now()}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        return this.repo.save(this.repo.create(dto));
    }
    async findAll(page = 1, limit = 20, status) {
        const where = status ? { status } : {};
        const [data, total] = await this.repo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
    async findOne(id) {
        const t = await this.repo.findOne({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException(`Transaction #${id} not found`);
        return t;
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async getStats() {
        const total = await this.repo.count();
        const completed = await this.repo.count({ where: { status: 'completed' } });
        const pending = await this.repo.count({ where: { status: 'pending' } });
        const sumResult = await this.repo
            .createQueryBuilder('t')
            .select('SUM(t.amount)', 'total')
            .where('t.status = :status', { status: 'completed' })
            .getRawOne();
        return { total, completed, pending, totalAmount: parseFloat(sumResult?.total || '0') };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map