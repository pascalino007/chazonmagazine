import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  slug: string

  @Column()
  title: string

  @Column({ type: 'text' })
  shortDescription: string

  @Column({ type: 'longtext', nullable: true })
  content: string

  @Column({ nullable: true })
  imageUrl: string

  @Column({ type: 'json', nullable: true })
  imageUrls: string[]

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  category: string

  @Column({ nullable: true })
  status: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  goalAmount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  raisedAmount: number

  @Column({ nullable: true })
  startDate: Date

  @Column({ nullable: true })
  endDate: Date

  @Column({ default: true })
  isActive: boolean

  @Column({ default: 0 })
  order: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
