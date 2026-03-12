import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Post('track')
  track(@Body() body: any, @Req() req: any): Promise<any> {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress
    return this.svc.trackView(body.path, body.articleId, ip, req.headers['user-agent'], req.headers['referer'])
  }

  @Get('stats')
  getDashboardStats(): Promise<any> { return this.svc.getDashboardStats() }

  @Get('articles-per-day')
  articlesPerDay(@Query('days') days = '30'): Promise<any> { return this.svc.getArticlesPerDay(+days) }

  @Get('articles-per-month')
  articlesPerMonth(@Query('months') months = '12'): Promise<any> { return this.svc.getArticlesPerMonth(+months) }

  @Get('views-per-day')
  viewsPerDay(@Query('days') days = '30'): Promise<any> { return this.svc.getViewsPerDay(+days) }

  @Get('likes-per-article')
  likesPerArticle(@Query('limit') limit = '10'): Promise<any> { return this.svc.getLikesPerArticle(+limit) }

  @Get('top-articles')
  topArticles(@Query('limit') limit = '10'): Promise<any> { return this.svc.getTopArticles(+limit) }
}
