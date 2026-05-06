import { Module } from '@nestjs/common';
import { TweetsController } from './tweet.controller';
import { TweetsService } from './tweet.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { HashTagModule } from 'src/hashtag/hashtag.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [TweetsController],
  providers: [TweetsService],
  imports: [
    PaginationModule,
    UsersModule,
    HashTagModule,
    TypeOrmModule.forFeature([Tweet]),
  ],
})
export class TweetsModule {}
