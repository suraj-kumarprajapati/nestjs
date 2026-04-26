import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweet.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/profile.entity';
import { HashTagModule } from './hashtag/hashtag.module';

@Module({
  imports: [
    UsersModule,
    TweetsModule,
    AuthModule,
    ProfileModule,
    HashTagModule,
    // async configuration for TypeORM
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        // entities: [User, Profile, Tweet, HashTag, Auth],
        autoLoadEntities: true, // automatically load entities from modules
        synchronize: true, // set to false in production
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root123',
        database: 'nestjs',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
