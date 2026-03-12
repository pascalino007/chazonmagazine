import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { ReportagesService } from './reportages.service'
import { CreateReportageDto } from './dto/create-reportage.dto'

@Controller('reportages')
export class ReportagesController {
  constructor(private readonly svc: ReportagesService) {}

  @Post()
  create(@Body() dto: CreateReportageDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateReportageDto>) {
    return this.svc.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id)
  }
}
