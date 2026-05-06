import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ResourceAlreadyExistsException } from 'src/exceptions/resource-already-exists.exception';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { SelectQueryBuilder } from 'typeorm/browser';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { PaginatedResult } from 'src/common/pagination/paginated-result.interface';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getUsers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<ResponseDto<PaginatedResult<User>>> {
    const envType: string = this.configService.get<string>('ENV_TYPE') ?? '';
    console.log('Current environment type:', envType);

    // const users = await this.userRepository.find({
    //   relations: {
    //     profile: true,
    //   },
    // });
    // return users;

    const queryBuilder: SelectQueryBuilder<User> = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');
    // .addSelect('user.password'); // include the password field in the query results

    const columns: string[] =
      queryBuilder.expressionMap.mainAlias!.metadata.columns.map(
        (col) => col.propertyName,
      );

    const result = await this.paginationProvider.paginateQuery(
      paginationQueryDto,
      queryBuilder,
      'user',
      columns,
    );

    return new ResponseDto<PaginatedResult<User>>({
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: '',
      message: 'Users retrieved successfully',
      data: result,
    });
  }

  public async createUser(createUserDto: CreateUserDto) {
    // if user already exists with the same email, return an error
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ResourceAlreadyExistsException(
        'User',
        'email',
        createUserDto.email,
      );
    }

    // find user by username
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto?.username ?? '' },
    });

    if (existingUserByUsername) {
      throw new ResourceAlreadyExistsException(
        'User',
        'username',
        createUserDto.username,
      );
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
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id : ${id} not found`);
    }

    return await this.userRepository.delete({ id });
  }

  public async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      // relations: {
      //   profile: true,
      // },
    });

    if (!user) {
      throw new NotFoundException(`User with id : ${id} not found`);
    }

    return user;
  }
}
