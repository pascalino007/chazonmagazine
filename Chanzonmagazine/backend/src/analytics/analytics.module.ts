import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PageView } from './entities/page-view.entity'
import { Article } from '../articles/entities/article.entity'
import { ArticleLike } from '../articles/entities/article-like.entity'
import { AnalyticsService } from './analytics.service'
import { AnalyticsController } from './analytics.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PageView, Article, ArticleLike])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
