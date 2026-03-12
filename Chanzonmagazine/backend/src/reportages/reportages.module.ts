import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reportage } from './entities/reportage.entity'
import { Tag } from '../articles/entities/tag.entity'
import { ReportagesService } from './reportages.service'
import { ReportagesController } from './reportages.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Reportage, Tag])],
  providers: [ReportagesService],
  controllers: [ReportagesController],
  exports: [ReportagesService],
})
export class ReportagesModule {}
