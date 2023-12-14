import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UserPayload } from 'src/base/authentication/userPayload';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: { user: UserPayload },
  ) {
    return this.todoService.create(createTodoDto, req);
  }

  @Get()
  findAll(
    @Req() req: { user: UserPayload },
    @Body() query: { skip: number; take: number },
  ) {
    return this.todoService.findAll(req, {
      skip: query.skip || 0,
      take: query.take || 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: UserPayload }) {
    return this.todoService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: { user: UserPayload },
  ) {
    return this.todoService.update(+id, updateTodoDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: UserPayload }) {
    return this.todoService.remove(+id, req);
  }
}
