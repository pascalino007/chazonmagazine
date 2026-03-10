"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const articles_module_1 = require("./articles/articles.module");
const categories_module_1 = require("./categories/categories.module");
const banners_module_1 = require("./banners/banners.module");
const projects_module_1 = require("./projects/projects.module");
const transactions_module_1 = require("./transactions/transactions.module");
const upload_module_1 = require("./upload/upload.module");
const analytics_module_1 = require("./analytics/analytics.module");
const search_module_1 = require("./search/search.module");
const auth_module_1 = require("./auth/auth.module");
const article_entity_1 = require("./articles/entities/article.entity");
const category_entity_1 = require("./categories/entities/category.entity");
const banner_entity_1 = require("./banners/entities/banner.entity");
const project_entity_1 = require("./projects/entities/project.entity");
const transaction_entity_1 = require("./transactions/entities/transaction.entity");
const tag_entity_1 = require("./articles/entities/tag.entity");
const article_like_entity_1 = require("./articles/entities/article-like.entity");
const page_view_entity_1 = require("./analytics/entities/page-view.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 3306),
                    username: config.get('DB_USERNAME', 'root'),
                    password: config.get('DB_PASSWORD', ''),
                    database: config.get('DB_NAME', 'chanzon_db'),
                    entities: [article_entity_1.Article, category_entity_1.Category, banner_entity_1.Banner, project_entity_1.Project, transaction_entity_1.Transaction, tag_entity_1.Tag, article_like_entity_1.ArticleLike, page_view_entity_1.PageView],
                    synchronize: true,
                    charset: 'utf8mb4',
                }),
            }),
            articles_module_1.ArticlesModule,
            categories_module_1.CategoriesModule,
            banners_module_1.BannersModule,
            projects_module_1.ProjectsModule,
            transactions_module_1.TransactionsModule,
            upload_module_1.UploadModule,
            analytics_module_1.AnalyticsModule,
            search_module_1.SearchModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map