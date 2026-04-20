import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService, UserType } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // getAllUsers(
  //   @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  // ): UserType[]

  @Get()
  getAllUsers(@Query() query: GetUserDto): UserType[] {
    return this.usersService.getAllUsers(
      query.limit,
      query.page,
      query.isMarried,
    );
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number): UserType | undefined {
    return this.usersService.getUser(id);
  }

  @Post()
  // createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): string {
  createUser(@Body() createUserDto: CreateUserDto): string {
    console.log('CreateUserDto:', createUserDto); // Log the DTO for debugging
    console.log('Type of createUserDto:', typeof createUserDto); // Log the type of DTO for debugging
    console.log('DTO constructor:', createUserDto?.constructor?.name);

    // true -> if used transform and validation pipe
    console.log(
      'Is instance of CreateUserDto:',
      createUserDto instanceof CreateUserDto,
    );

    return 'User created successfully';
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): string {
    console.log('ID:', id); // Log the ID for debugging
    console.log('UpdateUserDto:', updateUserDto); // Log the DTO for debugging
    return 'User updated successfully';
  }
}
