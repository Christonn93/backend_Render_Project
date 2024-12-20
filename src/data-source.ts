import { DataSource } from 'typeorm';
import { User } from './entity/User';

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [User],
});

export default AppDataSource;