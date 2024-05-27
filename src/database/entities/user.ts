import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';

import { Role } from '../../types';
import { ID } from '../repositories';
import { Transaction } from './transaction';

@Entity({ name: 'users' })
@Index('idx_email', ['email'], { unique: true })
class User implements ID {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'username',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username!: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password!: string;

  @Column({
    name: 'role',
    type: 'varchar',
    default: 'user',
  })
  role!: Role;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
  })
  created_at!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updated_at!: Date;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.user)
  transactions!: Transaction[];
}

export { User };
