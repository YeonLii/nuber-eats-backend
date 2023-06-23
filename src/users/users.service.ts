import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    // 새로운 user인지 확인
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return {
          ok: false,
          error: '해당 이메일을 가진 사용자가 이미 존재합니다.',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
    // 계정을 생성하고 비밀번호를 hashing

    // Database에 존재하지 않는 email을 확인
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // 해당 email을 가진 user를 찾기
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return { ok: false, error: '사용자를 찾을 수 없습니다.' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: '비밀번호가 일치하지 않습니다.' };
      }
      return { ok: true, error: 'lalalala' };
    } catch (error) {
      return { ok: false, error };
    }

    // 비밀번호가 일치하는지 확인

    // JWT를 만들고 user에게 배포
  }
}