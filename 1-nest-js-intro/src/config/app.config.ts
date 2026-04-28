export const appConfig = {
  env: process.env.ENV_TYPE || 'production',
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root123',
    databaseName: process.env.DB_NAME || 'nestjs',
    synchronize: process.env.DB_SYNC === 'true',
    autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true',
  },
};
