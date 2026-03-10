import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  imageUrl: string

  @Column({ nullable: true })
  linkUrl: string

  @Column({ nullable: true })
  linkLabel: string

  @Column({ type: 'enum', enum: ['hero', 'editorial', 'sidebar', 'footer'], default: 'editorial' })
  position: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: 0 })
  order: number

  @Column({ nullable: true })
  accentColor: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
