import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { config } from '../config';
import { IUserResponse } from '../types';
import { UniversalRepository, User, dataSource } from '../database';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '../utils';

class AuthService {
  private readonly SALT = 10;
  private readonly userRepo: Repository<User> = dataSource.getRepository(User);
  private readonly universalRepo = new UniversalRepository<User>(this.userRepo);

  public async signUp(payload: User): Promise<IUserResponse> {
    try {
      const user = await this.universalRepo.findOne({
        where: { email: payload.email },
      });

      if (user) {
        throw new BadRequestException('account with email exists');
      }

      const hash = await this.hashPassword(payload.password);

      const userRecord = await this.universalRepo.create({
        ...payload,
        password: hash,
      });

      const token: string = this.generateToken(userRecord);

      if (!userRecord) {
        throw new UnprocessableEntityException('Unable to create user');
      }

      Reflect.deleteProperty(userRecord, 'password');

      return { user: userRecord, token };
    } catch (error) {
      throw error;
    }
  }
  public async signIn(email: string, password: string): Promise<IUserResponse> {
    try {
      const user: User | null = await this.universalRepo.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('invalid email account');
      }

      const isValidPassword: boolean = await this.comparePassword(
        password,
        user.password,
      );

      if (!isValidPassword) {
        throw new BadRequestException('invalid credentials');
      }

      const token: string = this.generateToken(user);

      Reflect.deleteProperty(user, 'password');

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  public async currentUser(id: string): Promise<User> {
    try {
      const user: User | null = await this.universalRepo.findByID(id);

      if (!user) {
        throw new UnauthorizedException('invalid email/password');
      }

      Reflect.deleteProperty(user, 'password');

      return user;
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: User): string {
    const { jwtSecret, jwtExpiresIn } = config.app;

    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: jwtExpiresIn,
      },
    );
  }

  public verifyToken(token: string) {
    const { jwtSecret } = config.app;

    return jwt.verify(token, jwtSecret);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export const authService: AuthService = new AuthService();
