import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entites/user.entity';
import { UserProfile } from './entites/user-profile.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
