import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator'

export class CreateArticleDto {
  @IsString()
  title: string

  @IsString()
  shortDescription: string

  @IsString()
  content: string

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsOptional()
  @IsArray()
  imageUrls?: string[]

  @IsOptional()
  @IsString()
  audioUrl?: string

  @IsOptional()
  @IsString()
  videoUrl?: string

  @IsOptional()
  @IsString()
  author?: string

  @IsOptional()
  @IsString()
  readTime?: string

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: string

  @IsOptional()
  @IsNumber()
  categoryId?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]
}
