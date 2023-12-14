import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AppUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  hashedPassword: string;
}
