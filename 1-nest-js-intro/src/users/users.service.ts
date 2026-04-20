import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getUsers(limit: number, page: number): Promise<User[]> {
    const users: User[] = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return users;
  }

  public async createUser(createUserDto: CreateUserDto) {
    // if user already exists with the same email, return an error
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      return 'User with this email already exists';
    }

    // this will only create a new user instance, but will not save it to the database
    const newUser: User = this.userRepository.create(createUserDto);
    // this will save the new user to the database and return the saved user instance
    const newSavedUser: User = await this.userRepository.save(newUser);
    return newSavedUser;
  }
}
