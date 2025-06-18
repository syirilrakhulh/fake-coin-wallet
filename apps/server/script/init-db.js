import { neon } from '@neondatabase/serverless';

const initDatabase = async () => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const sqlQueries = [];

    /**
     * Drop existing wallets table
     */
    sqlQueries.push(sql`DROP TABLE IF EXISTS wallets CASCADE;`);

    /**
     * Create wallets table
     */
    sqlQueries.push(
      sql`CREATE TABLE wallets(address VARCHAR(42) PRIMARY KEY, balance DECIMAL(10, 4) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    );

    await sql.transaction(sqlQueries);
  } catch (error) {
    console.error('Failed initialize database: ', JSON.stringify(error));
    process.exit(1);
  }
};

initDatabase();
