import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async findByForgotToken(forgotToken: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { forgotToken } });
  }

  async updateUserWithForgotToken(email: string): Promise<string | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return;
    }

    const rand = Array(10 + 1)
      .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
      .slice(0, 10);
    const forgotToken = rand + Date.now();
    await this.userRepository.update(user.id, { forgotToken });

    return forgotToken;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async saveUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  // async updateUser(iuser: IUpdateUser): Promise<void> {
  //   const updateUser = new UpdateUser(iuser);
  //   const currentUser = RequestContextHelper.getCurrentUser();
  //   Object.assign(currentUser, updateUser);
  //   await this.userRepository.save(currentUser);
  // }
}
