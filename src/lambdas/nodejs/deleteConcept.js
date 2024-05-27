import pkg from 'pg';

const { Client } = pkg;

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

export async function deleteConcept(conceptId) {
  const client = new Client({
    host: dbHost,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();

  const deleteConceptQuery = 'DELETE FROM ontology_clinical_concepts WHERE id = $1';
  await client.query(deleteConceptQuery, [conceptId]);

  const deleteRelationshipsQuery = 'DELETE FROM ontology_clinical_relationships WHERE parent_id = $1 OR child_id = $1';
  await client.query(deleteRelationshipsQuery, [conceptId]);

  await client.end();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ message: 'Concept deleted' }),
  };
}
