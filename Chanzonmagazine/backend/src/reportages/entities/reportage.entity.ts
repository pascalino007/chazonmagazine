import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn,
} from 'typeorm'
import { Category } from '../../categories/entities/category.entity'
import { Tag } from '../../articles/entities/tag.entity'

@Entity('reportages')
export class Reportage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  slug: string

  @Column()
  title: string

  @Column({ type: 'text' })
  shortDescription: string

  @Column({ type: 'longtext' })
  content: string

  @Column({ type: 'text', nullable: true })
  imageUrl: string

  @Column({ type: 'json', nullable: true })
  imageUrls: string[]

  @Column({ nullable: true })
  audioUrl: string

  @Column({ nullable: true })
  videoUrl: string

  @Column({ nullable: true })
  author: string

  @Column({ nullable: true })
  readTime: string

  @Column({ type: 'enum', enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string

  @Column({ default: 0 })
  viewCount: number

  @ManyToOne(() => Category, (category) => category.articles, { eager: true, nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category

  @Column({ nullable: true })
  categoryId: number

  @ManyToMany(() => Tag, (tag) => tag.articles, { eager: true, cascade: true })
  @JoinTable({ name: 'reportage_tags' })
  tags: Tag[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
