import { ConnectionOptions } from 'typeorm';
import { TypeOrmConfig } from './typeorm.config';

import environment from '@environment';

export const UnitTestingTypeOrmConfig: ConnectionOptions = Object.assign({}, TypeOrmConfig, {
    name: 'unit_tests',
    database: 'test_db',
    host: environment.db_host
});