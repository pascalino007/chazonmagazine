import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Reportage } from './entities/reportage.entity'
import { Tag } from '../articles/entities/tag.entity'
import { CreateReportageDto } from './dto/create-reportage.dto'

@Injectable()
export class ReportagesService {
  constructor(
    @InjectRepository(Reportage) private reportageRepo: Repository<Reportage>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
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

  async create(dto: CreateReportageDto): Promise<Reportage> {
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
    const reportage = this.reportageRepo.create({ ...dto, slug, tags })
    return this.reportageRepo.save(reportage)
  }

  async findAll(page = 1, limit = 20, status?: string, categoryId?: number): Promise<{ data: Reportage[]; total: number; page: number; lastPage: number }> {
    const where: any = {}
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId

    const [data, total] = await this.reportageRepo.findAndCount({
      where,
      relations: ['category', 'tags'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total, page, lastPage: Math.ceil(total / limit) }
  }

  async findPublished(page = 1, limit = 12, categorySlug?: string): Promise<{ data: Reportage[]; total: number }> {
    const qb = this.reportageRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.category', 'cat')
      .leftJoinAndSelect('r.tags', 'tag')
      .where('r.status = :status', { status: 'published' })
      .orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    if (categorySlug) qb.andWhere('cat.slug = :slug', { slug: categorySlug })
    const [data, total] = await qb.getManyAndCount()
    return { data, total }
  }

  async findOne(id: number): Promise<Reportage> {
    const reportage = await this.reportageRepo.findOne({ where: { id }, relations: ['category', 'tags'] })
    if (!reportage) throw new NotFoundException(`Reportage #${id} not found`)
    await this.reportageRepo.increment({ id }, 'viewCount', 1)
    return reportage
  }

  async findBySlug(slug: string): Promise<Reportage> {
    const reportage = await this.reportageRepo.findOne({ where: { slug }, relations: ['category', 'tags'] })
    if (!reportage) throw new NotFoundException(`Reportage "${slug}" not found`)
    await this.reportageRepo.increment({ id: reportage.id }, 'viewCount', 1)
    return reportage
  }

  async update(id: number, dto: Partial<CreateReportageDto>): Promise<Reportage> {
    const reportage = await this.findOne(id)
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
      reportage.tags = tags
    }
    Object.assign(reportage, dto)
    return this.reportageRepo.save(reportage)
  }

  async remove(id: number): Promise<void> {
    const reportage = await this.findOne(id)
    await this.reportageRepo.remove(reportage)
  }

  async getStats() {
    const total = await this.reportageRepo.count()
    const published = await this.reportageRepo.count({ where: { status: 'published' } })
    const draft = await this.reportageRepo.count({ where: { status: 'draft' } })
    const totalViews = await this.reportageRepo
      .createQueryBuilder('r')
      .select('SUM(r.viewCount)', 'sum')
      .getRawOne()
    return { total, published, draft, totalViews: parseInt(totalViews?.sum || '0') }
  }
}
