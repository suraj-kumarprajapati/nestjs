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

  public async getUsers(): Promise<User[]> {
    // for eager loading
    // const users: User[] = await this.userRepository.find({
    //   relations: {
    //     profile: true,
    //   },
    // });

    const users = await this.userRepository.find({
      relations: {
        profile: true,
      },
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

    // first create the profile even if it is optional, because we need to save the profile to the database before we can save the user
    if (!createUserDto.profile) {
      createUserDto.profile = {};
    }

    const newUser: User = this.userRepository.create(createUserDto); // create a new user instance from the DTO
    const newSavedUser: User = await this.userRepository.save(newUser); // save the new user to the database
    return newSavedUser;
  }

  public async deleteUser(id: number) {
    return await this.userRepository.delete({ id });
  }

  public async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      // relations: {
      //   profile: true,
      // },
    });
  }
}
