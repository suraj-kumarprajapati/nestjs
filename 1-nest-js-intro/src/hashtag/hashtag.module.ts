import { Module } from '@nestjs/common';
import { HashTagController } from './hashtag.controller';
import { HashTagService } from './hashtag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTag } from './hashtag.entity';

@Module({
  controllers: [HashTagController],
  providers: [HashTagService],
  imports: [TypeOrmModule.forFeature([HashTag])],
  exports: [HashTagService],
})
export class HashTagModule {}
