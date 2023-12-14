import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { DatabaseConstants } from 'src/base/constants';

export const userProviders = [
  {
    provide: DatabaseConstants.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DatabaseConstants.DATA_SOURCE],
  },
];
