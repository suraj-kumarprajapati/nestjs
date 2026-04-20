import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TweetsService {
  constructor(private readonly usersService: UsersService) {}

  tweets = [
    { id: 1, userId: 1, content: 'Hello World!' },
    { id: 2, userId: 1, content: 'NestJS is great!' },
    { id: 3, userId: 2, content: 'I love programming!' },
    { id: 4, userId: 3, content: 'TypeScript is awesome!' },
  ];

  getTweetsByUserId(userId: number) {
    const user = this.usersService.getUser(userId);
    if (!user) {
      return `User with ID ${userId} not found.`;
    }

    const tweets = this.tweets.filter((tweet) => tweet.userId === userId);
    const response = tweets.map((t) => ({ ...t, user: user }));
    return response;
  }
}
