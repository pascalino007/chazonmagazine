import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './entities/transaction.entity'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private repo: Repository<Transaction>) {}

  async create(dto: Partial<Transaction>): Promise<Transaction> {
    if (!dto.reference) dto.reference = `DON-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`
    return this.repo.save(this.repo.create(dto))
  }

  async findAll(page = 1, limit = 20, status?: string): Promise<{ data: Transaction[]; total: number }> {
    const where: any = status ? { status } : {}
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total }
  }

  async findOne(id: number): Promise<Transaction> {
    const t = await this.repo.findOne({ where: { id } })
    if (!t) throw new NotFoundException(`Transaction #${id} not found`)
    return t
  }

  async update(id: number, dto: Partial<Transaction>): Promise<Transaction> {
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async getStats() {
    const total = await this.repo.count()
    const completed = await this.repo.count({ where: { status: 'completed' } })
    const pending = await this.repo.count({ where: { status: 'pending' } })
    const sumResult = await this.repo
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.status = :status', { status: 'completed' })
      .getRawOne()
    return { total, completed, pending, totalAmount: parseFloat(sumResult?.total || '0') }
  }
}
