import { ConnectionOptions } from 'typeorm';
import { UnitTestingTypeOrmConfig } from './unit-testing.config';

export const EndToEndTestingTypeOrmConfig: ConnectionOptions = Object.assign({}, UnitTestingTypeOrmConfig,
  {
    name: 'default',
    database: 'test_db'
  }
);