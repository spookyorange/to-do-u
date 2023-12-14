import { DataSource } from 'typeorm';
import { DatabaseConstants } from 'src/base/constants';

export const databaseProviders = [
  {
    provide: DatabaseConstants.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        // host: 'localhost',
        // port: 5432,
        // username: 'spookyorange',
        // password: 'postgres',
        // database: 'test',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
