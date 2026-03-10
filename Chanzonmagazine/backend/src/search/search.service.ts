import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Article } from '../articles/entities/article.entity'
import { Category } from '../categories/entities/category.entity'
import { Project } from '../projects/entities/project.entity'

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
  ) {}

  async search(query: string, limit = 10) {
    if (!query || query.trim().length < 2) return { articles: [], categories: [], projects: [] }
    const q = `%${query.trim()}%`

    const [articles, categories, projects] = await Promise.all([
      this.articleRepo.find({
        where: [
          { title: Like(q), status: 'published' },
          { shortDescription: Like(q), status: 'published' },
        ],
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.categoryRepo.find({
        where: [{ name: Like(q) }, { slug: Like(q) }],
        take: 5,
      }),
      this.projectRepo.find({
        where: [
          { title: Like(q), isActive: true },
          { shortDescription: Like(q), isActive: true },
        ],
        take: 5,
      }),
    ])

    return { articles, categories, projects, total: articles.length + categories.length + projects.length }
  }

  async searchArticles(query: string, categorySlug?: string, page = 1, limit = 12) {
    const q = `%${query.trim()}%`
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.category', 'cat')
      .leftJoinAndSelect('a.tags', 'tag')
      .where('a.status = :status', { status: 'published' })
      .andWhere('(a.title LIKE :q OR a.shortDescription LIKE :q OR a.content LIKE :q)', { q })
      .orderBy('a.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (categorySlug) qb.andWhere('cat.slug = :catSlug', { catSlug: categorySlug })

    const [data, total] = await qb.getManyAndCount()
    return { data, total, page, lastPage: Math.ceil(total / limit) }
  }
}
