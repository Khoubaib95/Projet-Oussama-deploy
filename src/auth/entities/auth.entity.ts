import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  auth_id: string;

  @Column('uuid')
  user_id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column()
  email_verification_code: string;

  @Column()
  reset_pwd_code: string;

  @Column({ nullable: true })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.auth)
  user: User;
}
/*
 @OneToOne(() => User, (user) => user.auth)
  @JoinColumn({ name: 'auth_id' })
  user: User;
*/
