import { Controller, Get, Param } from '@nestjs/common';
import { TweetsService } from './tweets.service';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Get(':userId')
  getTweetsByUserId(@Param('userId') userId: number) {
    return this.tweetsService.getTweetsByUserId(userId);
  }
}
