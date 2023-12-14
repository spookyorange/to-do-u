import { DataSource } from 'typeorm';
import { AppUser } from './entities/user.entity';
import { DatabaseConstants } from 'src/base/constants';

export const userProviders = [
  {
    provide: DatabaseConstants.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AppUser),
    inject: [DatabaseConstants.DATA_SOURCE],
  },
];
