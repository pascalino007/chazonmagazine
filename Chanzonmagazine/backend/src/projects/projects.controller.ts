import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { ProjectsService } from './projects.service'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly svc: ProjectsService) {}

  @Post()
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Get()
  findAll(@Query('active') active?: string) { return this.svc.findAll(active === 'true') }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) { return this.svc.findBySlug(slug) }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id) }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.update(id, dto) }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id) }
}
