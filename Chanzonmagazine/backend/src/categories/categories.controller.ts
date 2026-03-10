import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly svc: CategoriesService) {}

  @Post()
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Get()
  findAll(@Query('active') active?: string) {
    return this.svc.findAll(active === 'true')
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) { return this.svc.findBySlug(slug) }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id) }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.update(id, dto) }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id) }
}
