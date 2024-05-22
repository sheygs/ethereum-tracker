import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../entities';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '../helpers';
import { config } from '../config';
import { IUserResponse } from '../interfaces';
import { UserService } from './user';

@Service()
export class AuthService {
  private readonly SALT = 10;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private userService: UserService,
  ) {}

  public async signUp(payload: User): Promise<IUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: payload.email },
      });

      if (user) {
        throw new BadRequestException('account with email exists');
      }

      const hash = await this.hashPassword(payload.password);

      const userRecord = await this.userRepository.save({
        ...payload,
        password: hash,
      });

      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new UnprocessableEntityException('Unable to create user');
      }

      Reflect.deleteProperty(userRecord, 'password');

      return { user: userRecord, token };
    } catch (error) {
      throw error;
    }
  }
  public async login(email: string, password: string): Promise<IUserResponse> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('invalid email account');
      }

      const isValidPassword = this.comparePassword(password, user.password);

      if (!isValidPassword) {
        throw new BadRequestException('invalid credentials');
      }

      const token = this.generateToken(user);

      Reflect.deleteProperty(user, 'password');

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  public async currentUser(id: string): Promise<User> {
    try {
      const user = await this.userService.findOne({
        where: { id },
      });

      if (!user) {
        throw new UnauthorizedException('invalid token');
      }

      Reflect.deleteProperty(user, 'password');

      return user;
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      config.app.jwtSecret,
    );
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
