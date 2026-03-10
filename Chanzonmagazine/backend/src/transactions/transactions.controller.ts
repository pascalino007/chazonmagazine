import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { TransactionsService } from './transactions.service'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @Post()
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) { return this.svc.findAll(+page, +limit, status) }

  @Get('stats')
  getStats() { return this.svc.getStats() }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id) }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.update(id, dto) }
}
