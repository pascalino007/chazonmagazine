import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Article } from '../../articles/entities/article.entity'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  slug: string

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  color: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: 0 })
  order: number

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
