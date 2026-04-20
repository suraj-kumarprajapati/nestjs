import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private isAuthenticated = false;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  login(email: string, password: string) {
    const user = this.usersService.getUserByEmail(email);

    console.log(user);

    if (!user) {
      return 'User not found';
    }
    if (user.password === password) {
      this.isAuthenticated = true;
      return 'Login successful';
    } else {
      return 'Invalid credentials';
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
