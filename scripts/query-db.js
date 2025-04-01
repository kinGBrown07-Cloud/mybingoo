const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres.qqwvqfpgkqkrxvpxzqjz:bingoo2023@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
});

async function queryDb() {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM users');
    console.log('Contenu de la table users:', result.rows);
  } catch (err) {
    console.error('Erreur:', err);
  } finally {
    await client.end();
  }
}

queryDb();
