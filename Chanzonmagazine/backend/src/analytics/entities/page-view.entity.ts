import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('page_views')
export class PageView {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  path: string

  @Column({ nullable: true })
  articleId: number

  @Column({ nullable: true })
  ipAddress: string

  @Column({ nullable: true })
  userAgent: string

  @Column({ nullable: true })
  referrer: string

  @CreateDateColumn()
  createdAt: Date
}
