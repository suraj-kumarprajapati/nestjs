import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  isMarried: boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  // update the users data according to create-user dto
  // keeps 10 users data
  private users: UserType[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'john@123',
      age: 30,
      gender: 'male',
      isMarried: false,
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'jane@123',
      age: 25,
      gender: 'female',
      isMarried: true,
    },
    {
      id: 3,
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'bob@123',
      age: 35,
      gender: 'male',
      isMarried: true,
    },
    {
      id: 4,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'alice@123',
      age: 28,
      gender: 'female',
      isMarried: false,
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: 'charlie@123',
      age: 32,
      gender: 'male',
      isMarried: false,
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily@example.com',
      password: 'emily@123',
      age: 29,
      gender: 'female',
      isMarried: true,
    },
    {
      id: 7,
      name: 'David Wilson',
      email: 'david@example.com',
      password: 'david@123',
      age: 40,
      gender: 'male',
      isMarried: true,
    },
    {
      id: 8,
      name: 'Sarah Miller',
      email: 'sarah@example.com',
      password: 'sarah@123',
      age: 33,
      gender: 'female',
      isMarried: false,
    },
    {
      id: 9,
      name: 'Michael Taylor',
      email: 'michael@example.com',
      password: 'michael@123',
      age: 27,
      gender: 'male',
      isMarried: false,
    },
    {
      id: 10,
      name: 'Olivia Anderson',
      email: 'olivia@example.com',
      password: 'olivia@123',
      age: 31,
      gender: 'female',
      isMarried: true,
    },
  ];

  getAllUsers(limit: number, page: number, isMarried?: boolean): UserType[] {
    const startIndex = page && limit ? (page - 1) * limit : 0;
    const endIndex = limit ? startIndex + limit : this.users.length;

    // first filter based on isMarried if it's provided, then apply pagination
    const filteredUsers =
      isMarried !== undefined
        ? this.users.filter((user) => user.isMarried === isMarried)
        : this.users;

    if (!this.authService.getIsAuthenticated()) {
      return [];
    }

    return filteredUsers.slice(startIndex, endIndex);
  }

  getUser(id: number): UserType | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): UserType | undefined {
    return this.users.find((u) => u.email === email);
  }
}
