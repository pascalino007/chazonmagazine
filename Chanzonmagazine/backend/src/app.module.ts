import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ArticlesModule } from './articles/articles.module'
import { CategoriesModule } from './categories/categories.module'
import { BannersModule } from './banners/banners.module'
import { ProjectsModule } from './projects/projects.module'
import { TransactionsModule } from './transactions/transactions.module'
import { UploadModule } from './upload/upload.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { SearchModule } from './search/search.module'
import { AuthModule } from './auth/auth.module'
import { Article } from './articles/entities/article.entity'
import { Category } from './categories/entities/category.entity'
import { Banner } from './banners/entities/banner.entity'
import { Project } from './projects/entities/project.entity'
import { Transaction } from './transactions/entities/transaction.entity'
import { Tag } from './articles/entities/tag.entity'
import { ArticleLike } from './articles/entities/article-like.entity'
import { PageView } from './analytics/entities/page-view.entity'
import { ReportagesModule } from './reportages/reportages.module'
import { Reportage } from './reportages/entities/reportage.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'chanzon_db'),
        entities: [Article, Category, Banner, Project, Transaction, Tag, ArticleLike, PageView ,Reportage],
        synchronize: true,
        charset: 'utf8mb4',
      }),
    }),
    ArticlesModule,
    CategoriesModule,
    BannersModule,
    ProjectsModule,
    TransactionsModule,
    UploadModule,
    AnalyticsModule,
    SearchModule,
    AuthModule,
    ReportagesModule,
  ],
})
export class AppModule {}
