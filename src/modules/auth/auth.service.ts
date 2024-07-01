import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../common/database/repositories/user/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
}
