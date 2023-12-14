import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UserPayload } from 'src/base/authentication/userPayload';
import { DatabaseConstants } from 'src/base/constants';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @Inject(DatabaseConstants.TODO_REPOSITORY)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, req: { user: UserPayload }) {
    const { user } = req;

    const todo = await this.todoRepository.save({
      ...createTodoDto,
      user,
    });

    return todo;
  }

  async findAll(
    req: { user: UserPayload },
    query: { skip: number; take: number },
  ) {
    const { user } = req;

    const todos = await this.todoRepository.find({
      where: { user: { id: user.id } },
      skip: query.skip,
      take: query.take,
    });

    return todos;
  }

  async findOne(id: number, req: { user: UserPayload }) {
    const { user } = req;

    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!todo) {
      throw new NotFoundException(
        'Todo with the provided id is not found, or you are not the owner of this todo',
      );
    }

    return todo;
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    req: { user: UserPayload },
  ) {
    const { user } = req;

    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!todo) {
      throw new NotFoundException(
        'Todo with the provided id is not found, or you are not the owner of this todo',
      );
    }

    const updatedTodo = await this.todoRepository.save({
      ...todo,
      ...updateTodoDto,
    });

    return updatedTodo;
  }

  async remove(id: number, req: { user: UserPayload }) {
    const { user } = req;

    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!todo) {
      throw new NotFoundException(
        'Todo with the provided id is not found, or you are not the owner of this todo',
      );
    }

    await this.todoRepository.delete({ id });

    return todo;
  }
}
