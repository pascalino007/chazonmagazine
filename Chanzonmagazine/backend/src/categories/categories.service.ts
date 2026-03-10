import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async create(dto: Partial<Category>): Promise<Category> {
    const cat = this.repo.create(dto)
    return this.repo.save(cat)
  }

  async findAll(activeOnly = false): Promise<Category[]> {
    const where: any = activeOnly ? { isActive: true } : {}
    return this.repo.find({ where, order: { order: 'ASC', name: 'ASC' } })
  }

  async findOne(id: number): Promise<Category> {
    const cat = await this.repo.findOne({ where: { id } })
    if (!cat) throw new NotFoundException(`Category #${id} not found`)
    return cat
  }

  async findBySlug(slug: string): Promise<Category> {
    const cat = await this.repo.findOne({ where: { slug } })
    if (!cat) throw new NotFoundException(`Category "${slug}" not found`)
    return cat
  }

  async update(id: number, dto: Partial<Category>): Promise<Category> {
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id)
    await this.repo.remove(cat)
  }
}
