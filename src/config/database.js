import { Sequelize } from 'sequelize';
import 'dotenv/config';

console.log('DATABASE_URL en Railway:', process.env.DATABASE_URL || 'No definido');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;