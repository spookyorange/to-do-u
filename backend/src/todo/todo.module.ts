import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { todoProviders } from './todo.providers';
import { DatabaseModule } from 'src/database/database.module';
import { TodoGateway } from './todo.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TodoController],
  providers: [...todoProviders, TodoService, TodoGateway],
})
export class TodoModule {}
