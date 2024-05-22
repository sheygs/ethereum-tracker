import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../interfaces';

@Entity({ name: 'users' })
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'username',
    type: 'varchar',
    nullable: true,
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
    length: 50,
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
}

export { User };
