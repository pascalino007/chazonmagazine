import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Article } from './article.entity'

@Entity('article_likes')
export class ArticleLike {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  ipAddress: string

  @Column({ nullable: true })
  sessionId: string

  @ManyToOne(() => Article, (article) => article.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: Article

  @Column()
  articleId: number

  @CreateDateColumn()
  createdAt: Date
}
