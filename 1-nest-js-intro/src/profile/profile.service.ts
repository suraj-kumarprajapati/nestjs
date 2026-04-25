import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  public getProfiles() {
    return this.profileRepository.find({
      relations: {
        user: true,
      },
    });
  }
}
