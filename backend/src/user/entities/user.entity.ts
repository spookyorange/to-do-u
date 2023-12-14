import { Todo } from 'src/todo/entities/todo.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  hashedPassword: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
