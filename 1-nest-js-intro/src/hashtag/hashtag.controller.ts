import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { HashTagService } from './hashtag.service';
import { CreateHashTagDto } from './dtos/create-hashtag.dto';

@Controller('hashtags')
export class HashTagController {
  constructor(private readonly hashTagService: HashTagService) {}

  @Post()
  createHashTag(@Body() createHashTagDto: CreateHashTagDto) {
    return this.hashTagService.createHashTag(createHashTagDto);
  }

  @Get()
  getHashTags() {
    return this.hashTagService.getHashAllTags();
  }

  @Delete(':id')
  deleteHashTag(@Param('id', ParseIntPipe) id: number) {
    return this.hashTagService.deleteHashTag(id);
  }

  @Delete('soft-delete/:id')
  softDeleteHashTag(@Param('id', ParseIntPipe) id: number) {
    return this.hashTagService.softDeleteHashTag(id);
  }
}
