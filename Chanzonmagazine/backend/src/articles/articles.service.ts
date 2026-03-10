import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, FindManyOptions } from 'typeorm'
import { Article } from './entities/article.entity'
import { Tag } from './entities/tag.entity'
import { ArticleLike } from './entities/article-like.entity'
import { CreateArticleDto } from './dto/create-article.dto'

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(ArticleLike) private likeRepo: Repository<ArticleLike>,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  async create(dto: CreateArticleDto): Promise<Article> {
    const slug = this.generateSlug(dto.title)
    let tags: Tag[] = []
    if (dto.tags?.length) {
      tags = await Promise.all(
        dto.tags.map(async (name) => {
          const tagSlug = this.generateSlug(name)
          let tag = await this.tagRepo.findOne({ where: { slug: tagSlug } })
          if (!tag) {
            tag = this.tagRepo.create({ name: name.trim(), slug: tagSlug })
            await this.tagRepo.save(tag)
          }
          return tag
        }),
      )
    }
    const article = this.articleRepo.create({ ...dto, slug, tags })
    return this.articleRepo.save(article)
  }

  async findAll(page = 1, limit = 20, status?: string, categoryId?: number): Promise<{ data: Article[]; total: number; page: number; lastPage: number }> {
    const where: any = {}
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId

    const [data, total] = await this.articleRepo.findAndCount({
      where,
      relations: ['category', 'tags'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total, page, lastPage: Math.ceil(total / limit) }
  }

  async findPublished(page = 1, limit = 12, categorySlug?: string): Promise<{ data: Article[]; total: number }> {
    const qb = this.articleRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.category', 'cat')
      .leftJoinAndSelect('a.tags', 'tag')
      .where('a.status = :status', { status: 'published' })
      .orderBy('a.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    if (categorySlug) qb.andWhere('cat.slug = :slug', { slug: categorySlug })
    const [data, total] = await qb.getManyAndCount()
    return { data, total }
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepo.findOne({ where: { id }, relations: ['category', 'tags'] })
    if (!article) throw new NotFoundException(`Article #${id} not found`)
    await this.articleRepo.increment({ id }, 'viewCount', 1)
    return article
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepo.findOne({ where: { slug }, relations: ['category', 'tags'] })
    if (!article) throw new NotFoundException(`Article "${slug}" not found`)
    await this.articleRepo.increment({ id: article.id }, 'viewCount', 1)
    return article
  }

  async update(id: number, dto: Partial<CreateArticleDto>): Promise<Article> {
    const article = await this.findOne(id)
    if (dto.tags !== undefined) {
      const tags = await Promise.all(
        dto.tags.map(async (name) => {
          const tagSlug = this.generateSlug(name)
          let tag = await this.tagRepo.findOne({ where: { slug: tagSlug } })
          if (!tag) {
            tag = this.tagRepo.create({ name: name.trim(), slug: tagSlug })
            await this.tagRepo.save(tag)
          }
          return tag
        }),
      )
      article.tags = tags
    }
    Object.assign(article, dto)
    return this.articleRepo.save(article)
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id)
    await this.articleRepo.remove(article)
  }

  async toggleLike(articleId: number, ipAddress: string): Promise<{ liked: boolean; count: number }> {
    const existing = await this.likeRepo.findOne({ where: { articleId, ipAddress } })
    if (existing) {
      await this.likeRepo.remove(existing)
      const count = await this.likeRepo.count({ where: { articleId } })
      return { liked: false, count }
    }
    const like = this.likeRepo.create({ articleId, ipAddress })
    await this.likeRepo.save(like)
    const count = await this.likeRepo.count({ where: { articleId } })
    return { liked: true, count }
  }

  async getLikeCount(articleId: number): Promise<number> {
    return this.likeRepo.count({ where: { articleId } })
  }

  async getStats() {
    const total = await this.articleRepo.count()
    const published = await this.articleRepo.count({ where: { status: 'published' } })
    const draft = await this.articleRepo.count({ where: { status: 'draft' } })
    const totalViews = await this.articleRepo
      .createQueryBuilder('a')
      .select('SUM(a.viewCount)', 'sum')
      .getRawOne()
    return { total, published, draft, totalViews: parseInt(totalViews?.sum || '0') }
  }
}
