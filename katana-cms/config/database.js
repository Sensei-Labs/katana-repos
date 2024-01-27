module.exports = ({ env }) => {
  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString: env('APP_DATABASE_URL') || env('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false)
        }
      }
    }
  };
};
