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
    return "";
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
