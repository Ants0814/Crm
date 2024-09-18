const { Pool } = require('pg');
// Create a configuration object for the PostgreSQL connection
const config = {
  host: 'db.antsnest.co.kr',
  user: 'admin',
  database: 'DEVELOPER',
  password: 'ants0814#C#',
  port: 5432,
  // Optional: Maximum number of clients in the pool
  max: 20,
  //ssl: { rejectUnauthorized: false },
  ssl: false,
  // Optional: Maximum milliseconds a client can stay idle before being removed
  idleTimeoutMillis: 30000,
  // Optional: Maximum milliseconds a client can stay active before being removed
  connectionTimeoutMillis: 2000,
};
const pool = new Pool(config);
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to PostgreSQL', err);
  } else {
    console.log('Successfully connected to PostgreSQL');
    // Once you've done with the client, call done()
    done();
  }
});
module.exports = pool;