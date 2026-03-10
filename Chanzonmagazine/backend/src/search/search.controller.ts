import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private readonly svc: SearchService) {}

  @Get()
  search(@Query('q') q: string, @Query('limit') limit = '10') {
    return this.svc.search(q, +limit)
  }

  @Get('articles')
  searchArticles(
    @Query('q') q: string,
    @Query('category') category?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '12',
  ) {
    return this.svc.searchArticles(q, category, +page, +limit)
  }
}
