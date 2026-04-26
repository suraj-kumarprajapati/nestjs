import { Body, Controller, Post } from '@nestjs/common';
import { HashTagService } from './hashtag.service';
import { CreateHashTagDto } from './dtos/create-hashtag.dto';

@Controller('hashtags')
export class HashTagController {
  constructor(private readonly hashTagService: HashTagService) {}

  @Post()
  createHashTag(@Body() createHashTagDto: CreateHashTagDto) {
    return this.hashTagService.createHashTag(createHashTagDto);
  }
}
