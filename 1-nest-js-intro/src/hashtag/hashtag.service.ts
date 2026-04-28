import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { HashTag } from './hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHashTagDto } from './dtos/create-hashtag.dto';

@Injectable()
export class HashTagService {
  constructor(
    @InjectRepository(HashTag)
    private readonly hashTagRepository: Repository<HashTag>,
  ) {}

  public async createHashTag(createHashTagDto: CreateHashTagDto) {
    const newHashTag = this.hashTagRepository.create({
      name: createHashTagDto.name,
    });
    return await this.hashTagRepository.save(newHashTag);
  }

  public async getHashTags(hashTagIds: number[]) {
    return await this.hashTagRepository.find({
      where: {
        id: In(hashTagIds),
      },
    });
  }

  public async deleteHashTag(id: number) {
    return await this.hashTagRepository.delete({ id: id });
  }

  public async softDeleteHashTag(id: number) {
    return await this.hashTagRepository.softDelete({ id: id });
  }

  public async getHashAllTags() {
    return await this.hashTagRepository.find();
  }
}
