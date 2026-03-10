import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from './entities/article.entity'
import { Tag } from './entities/tag.entity'
import { ArticleLike } from './entities/article-like.entity'
import { ArticlesService } from './articles.service'
import { ArticlesController } from './articles.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, ArticleLike])],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
