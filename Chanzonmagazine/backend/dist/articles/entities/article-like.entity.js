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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleLike = void 0;
const typeorm_1 = require("typeorm");
const article_entity_1 = require("./article.entity");
let ArticleLike = class ArticleLike {
};
exports.ArticleLike = ArticleLike;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ArticleLike.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ArticleLike.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ArticleLike.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => article_entity_1.Article, (article) => article.likes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'articleId' }),
    __metadata("design:type", article_entity_1.Article)
], ArticleLike.prototype, "article", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ArticleLike.prototype, "articleId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ArticleLike.prototype, "createdAt", void 0);
exports.ArticleLike = ArticleLike = __decorate([
    (0, typeorm_1.Entity)('article_likes')
], ArticleLike);
//# sourceMappingURL=article-like.entity.js.map