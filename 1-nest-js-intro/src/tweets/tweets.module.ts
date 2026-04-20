import { Module } from '@nestjs/common';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TweetsController],
  providers: [TweetsService],
  imports: [UsersModule],
})
export class TweetsModule {}
