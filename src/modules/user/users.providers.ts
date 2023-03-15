import { userRepository } from 'src/constants';
import { DataSource } from 'typeorm';
import { User } from 'src/db/entities/User';

export const userProviders = [
  {
    provide: userRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
