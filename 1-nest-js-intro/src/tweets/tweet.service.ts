import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dtos/create-tweet.dto';
import { HashTagService } from 'src/hashtag/hashtag.service';
import { HashTag } from 'src/hashtag/hashtag.entity';
import { UpdateTweetDto } from './dtos/update-tweet.dto';

@Injectable()
export class TweetsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashTagService: HashTagService,
    @InjectRepository(Tweet)
    private readonly tweetsRepository: Repository<Tweet>,
  ) {}

  public async getTweetsByUserId(userId: number) {
    return await this.tweetsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        // user: true,
        hashTags: true,
      },
    });
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
