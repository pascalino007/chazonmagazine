import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  reference: string

  @Column()
  donorName: string

  @Column({ nullable: true })
  donorEmail: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ default: 'EUR' })
  currency: string

  @Column({ nullable: true })
  message: string

  @Column({ nullable: true })
  projectId: number

  @Column({ type: 'enum', enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' })
  status: string

  @Column({ nullable: true })
  paymentMethod: string

  @Column({ nullable: true })
  paymentRef: string

  @Column({ default: false })
  isAnonymous: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
