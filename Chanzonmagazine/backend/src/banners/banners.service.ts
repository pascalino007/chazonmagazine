import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Banner } from './entities/banner.entity'

@Injectable()
export class BannersService {
  constructor(@InjectRepository(Banner) private repo: Repository<Banner>) {}

  async create(dto: Partial<Banner>): Promise<Banner> {
    return this.repo.save(this.repo.create(dto))
  }

  async findAll(activeOnly = false): Promise<Banner[]> {
    const where: any = activeOnly ? { isActive: true } : {}
    return this.repo.find({ where, order: { order: 'ASC' } })
  }

  async findByPosition(position: string): Promise<Banner[]> {
    return this.repo.find({ where: { position, isActive: true }, order: { order: 'ASC' } })
  }

  async findOne(id: number): Promise<Banner> {
    const b = await this.repo.findOne({ where: { id } })
    if (!b) throw new NotFoundException(`Banner #${id} not found`)
    return b
  }

  async update(id: number, dto: Partial<Banner>): Promise<Banner> {
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const b = await this.findOne(id)
    await this.repo.remove(b)
  }
}
