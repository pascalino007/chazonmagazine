import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '../articles/entities/article.entity'
import { Category } from '../categories/entities/category.entity'
import { Project } from '../projects/entities/project.entity'
import { SearchService } from './search.service'
import { SearchController } from './search.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Project])],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule {}
