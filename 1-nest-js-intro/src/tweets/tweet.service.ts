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
import { PaginatedResult } from 'src/common/pagination/paginated-result.interface';

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
  ): Promise<PaginatedResult<Tweet>> {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

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

    const result: PaginatedResult<Tweet> =
      await this.paginationProvider.paginateQuery(
        paginationQueryDto,
        queryBuilder,
        'tweet',
        columns,
      );

    return result;
  }

  // create a new tweet
  public async createTweet(createTweetDto: CreateTweetDto): Promise<Tweet> {
    const user = await this.usersService.getUserById(createTweetDto.userId);

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createTweetDto.userId} not found`,
      );
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

  public async updateTweet(
    id: number,
    updateTweetDto: UpdateTweetDto,
  ): Promise<Tweet> {
    const existingTweet = await this.tweetsRepository.findOne({
      where: { id },
    });

    if (!existingTweet) {
      throw new NotFoundException('Tweet not found');
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
    const existingTweet = await this.tweetsRepository.findOne({
      where: { id },
    });

    if (!existingTweet) {
      throw new NotFoundException('Tweet not found');
    }

    return await this.tweetsRepository.remove(existingTweet);
  }
}
