import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [TypeOrmModule.forFeature([Report])],
})
export class ReportModule {}
