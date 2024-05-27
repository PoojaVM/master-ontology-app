import pkg from 'pg';

const { Client } = pkg;

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

export async function getConcepts() {
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
  try {
    await client.connect();

    const query = `
      SELECT c.id, c.display_name, c.description, c.alternate_names,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT cr_parent.parent_id), NULL) AS parent_ids,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT cr_child.child_id), NULL) AS child_ids
      FROM ontology_clinical_concepts c
      LEFT JOIN ontology_clinical_relationships cr_parent ON c.id = cr_parent.child_id
      LEFT JOIN ontology_clinical_relationships cr_child ON c.id = cr_child.parent_id
      GROUP BY c.id, c.display_name, c.description, c.alternate_names
    `;
  
    const res = await client.query(query);
    await client.end();
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(res.rows),
    };
  } catch (error) {
    await client.end();
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: error?.detail || 'Error getting concepts' }),
    };
  }
}
