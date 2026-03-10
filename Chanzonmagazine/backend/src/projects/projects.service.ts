import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private repo: Repository<Project>) {}

  private generateSlug(title: string): string {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
  }

  async create(dto: Partial<Project>): Promise<Project> {
    if (!dto.slug && dto.title) dto.slug = this.generateSlug(dto.title)
    return this.repo.save(this.repo.create(dto))
  }

  async findAll(activeOnly = false): Promise<Project[]> {
    const where: any = activeOnly ? { isActive: true } : {}
    return this.repo.find({ where, order: { order: 'ASC', createdAt: 'DESC' } })
  }

  async findOne(id: number): Promise<Project> {
    const p = await this.repo.findOne({ where: { id } })
    if (!p) throw new NotFoundException(`Project #${id} not found`)
    return p
  }

  async findBySlug(slug: string): Promise<Project> {
    const p = await this.repo.findOne({ where: { slug } })
    if (!p) throw new NotFoundException(`Project "${slug}" not found`)
    return p
  }

  async update(id: number, dto: Partial<Project>): Promise<Project> {
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const p = await this.findOne(id)
    await this.repo.remove(p)
  }
}
