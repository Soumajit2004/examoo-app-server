import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../../common/database/database.module';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, AuthStrategy],
  controllers: [AuthController],
  exports: [PassportModule, AuthStrategy],
})
export class AuthModule {}
