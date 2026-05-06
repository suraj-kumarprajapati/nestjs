import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TweetsService } from './tweet.service';
import { CreateTweetDto } from './dtos/create-tweet.dto';
import { UpdateTweetDto } from './dtos/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Get(':userId')
  getTweetsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.tweetsService.getTweetsByUserId(userId, paginationQueryDto);
  }

  @Post()
  createTweet(@Body() createTweetDto: CreateTweetDto) {
    return this.tweetsService.createTweet(createTweetDto);
  }

  @Patch(':id')
  updateTweet(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTweetDto: UpdateTweetDto,
  ) {
    return this.tweetsService.updateTweet(id, updateTweetDto);
  }

  @Delete(':id')
  deleteTweet(@Param('id', ParseIntPipe) id: number) {
    return this.tweetsService.deleteTweet(id);
  }
}
