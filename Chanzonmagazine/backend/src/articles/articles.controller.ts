import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, Req, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('articles')
export class ArticlesController {
  constructor(private readonly svc: ArticlesService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.svc.create(dto)
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.svc.findAll(+page, +limit, status, categoryId ? +categoryId : undefined)
  }

  @Get('published')
  findPublished(
    @Query('page') page = '1',
    @Query('limit') limit = '12',
    @Query('category') category?: string,
  ) {
    return this.svc.findPublished(+page, +limit, category)
  }

  @Get('stats')
  getStats() {
    return this.svc.getStats()
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id)
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateArticleDto>) {
    return this.svc.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id)
  }

  @Post(':id/like')
  toggleLike(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
    return this.svc.toggleLike(id, ip)
  }

  @Get(':id/likes')
  getLikes(@Param('id', ParseIntPipe) id: number) {
    return this.svc.getLikeCount(id)
  }
}
