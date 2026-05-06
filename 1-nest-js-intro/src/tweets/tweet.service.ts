import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dtos/create-tweet.dto';
import { HashTagService } from 'src/hashtag/hashtag.service';
import { HashTag } from 'src/hashtag/hashtag.entity';
import { UpdateTweetDto } from './dtos/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';

@Injectable()
export class TweetsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashTagService: HashTagService,
    @InjectRepository(Tweet)
    private readonly tweetsRepository: Repository<Tweet>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getTweetsByUserId(
    userId: number,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // return await this.tweetsRepository.find({
    //   where: {
    //     user: {
    //       id: userId,
    //     },
    //   },
    //   relations: {
    //     user: true,
    //     hashTags: true,
    //   },
    //   skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
    //   take: paginationQueryDto.limit,
    // });

    const queryBuilder = this.tweetsRepository
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.user', 'user')
      .leftJoinAndSelect('tweet.hashTags', 'hashTags')
      .where('user.id = :userId', { userId: userId });
    // .addSelect('user.password');

    const columns: string[] =
      queryBuilder.expressionMap.mainAlias!.metadata.columns.map(
        (col) => col.propertyName,
      );

    const result = await this.paginationProvider.paginateQuery(
      paginationQueryDto,
      queryBuilder,
      'tweet',
      columns,
    );

    return result;
  }

  // create a new tweet
  public async createTweet(createTweetDto: CreateTweetDto) {
    const user = await this.usersService.getUserById(createTweetDto.userId);

    if (!user) {
      return 'User not found';
    }

    const hashTags: HashTag[] = await this.hashTagService.getHashTags(
      createTweetDto.hashTagIds ?? [],
    );

    const newTweet = this.tweetsRepository.create({
      text: createTweetDto.text,
      image: createTweetDto.image,
      user: user,
      hashTags: hashTags,
    });

    return await this.tweetsRepository.save(newTweet);
  }

  public async updateTweet(id: number, updateTweetDto: UpdateTweetDto) {
    const existingTweet = await this.tweetsRepository.findOne({
      where: { id },
    });

    if (!existingTweet) {
      return 'Tweet not found';
    }

    const newHashTags: HashTag[] = await this.hashTagService.getHashTags(
      updateTweetDto.hashTagIds ?? [],
    );

    existingTweet.text = updateTweetDto.text ?? existingTweet.text;
    existingTweet.image = updateTweetDto.image ?? existingTweet.image;
    existingTweet.hashTags = newHashTags;

    return await this.tweetsRepository.save(existingTweet);
  }

  public async deleteTweet(id: number) {
    return await this.tweetsRepository.delete({ id });
  }
}
