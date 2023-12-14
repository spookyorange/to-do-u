import { DataSource } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { DatabaseConstants } from 'src/base/constants';

export const todoProviders = [
  {
    provide: DatabaseConstants.TODO_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Todo),
    inject: [DatabaseConstants.DATA_SOURCE],
  },
];
