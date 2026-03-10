import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from 'typeorm'
import { Article } from './article.entity'

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  slug: string

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[]

  @CreateDateColumn()
  createdAt: Date
}
