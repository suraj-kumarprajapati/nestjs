import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweet.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { HashTagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';

const ENV = process.env.ENV_MODE;

// current env path
const envPath =
  !ENV || ENV.trim() === ''
    ? '.env'
    : ENV.trim().toLowerCase() === 'development'
      ? '.env.development'
      : '.env.test';

console.log('Using environment file:', envPath);

@Module({
  imports: [
    // config module
    ConfigModule.forRoot({
      isGlobal: true, // make the configuration available globally
      envFilePath: envPath, // specify the path to the .env file based on the environment
      load: [() => appConfig], // load the appConfig configuration
    }),
    UsersModule,
    TweetsModule,
    AuthModule,
    ProfileModule,
    HashTagModule,

    // async configuration for TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // type: configService.get<'postgres'>('DB_TYPE'),
        type: 'postgres',
        // entities: [User, Profile, Tweet, HashTag, Auth],
        autoLoadEntities: true, // automatically load entities from modules
        synchronize: true, // set to false in production
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('database.databaseName'), // using configfile and not env var
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
