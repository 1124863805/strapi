const sqlite = {
  client: 'sqlite',
  connection: {
    filename: '.tmp/data.db',
  },
  useNullAsDefault: true,
};

const postgres = {
  client: 'postgres',
  connection: {
    database: 'leao',
    user: 'leao',
    password: 'leao',
    port: 5432,
    host: 'localhost',
  },
};

const mysql = {
  client: 'mysql',
  connection: {
    database: 'leao',
    user: 'leao',
    password: 'leao',
    port: 3306,
    host: 'localhost',
  },
};

const mariadb = {
  client: 'mysql',
  connection: {
    database: 'leao',
    user: 'leao',
    password: 'leao',
    port: 3307,
    host: 'localhost',
  },
};

const db = {
  mysql,
  sqlite,
  postgres,
  mariadb,
};

module.exports = {
  connection: process.env.DB ? db[process.env.DB] || db.sqlite : db.sqlite,
};
