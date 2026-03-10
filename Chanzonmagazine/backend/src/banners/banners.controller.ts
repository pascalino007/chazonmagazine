import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { BannersService } from './banners.service'

@Controller('banners')
export class BannersController {
  constructor(private readonly svc: BannersService) {}

  @Post()
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Get()
  findAll(@Query('active') active?: string, @Query('position') position?: string) {
    if (position) return this.svc.findByPosition(position)
    return this.svc.findAll(active === 'true')
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id) }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.update(id, dto) }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id) }
}
