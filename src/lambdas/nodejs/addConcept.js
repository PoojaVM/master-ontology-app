import pkg from 'pg';

const { Client } = pkg;

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

export async function addConcept(concept) {
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

  const query = `
    INSERT INTO ontology_clinical_concepts (display_name, description, alternate_names)
    VALUES ($1, $2, $3)
  `;
  const values = [concept.display_name, concept.description, concept.alternate_names];

  const res = await client.query(query, values);
  const newConceptId = res.rows[0].id;

  if (concept.parent_ids) {
    const parentIds = concept.parent_ids.split(',');
    for (const parentId of parentIds) {
      const parentQuery = 'INSERT INTO ontology_clinical_relationships (parent_id, child_id) VALUES ($1, $2)';
      await client.query(parentQuery, [parentId, newConceptId]);
    }
  }

  if (concept.child_ids) {
    const childIds = concept.child_ids.split(',');
    for (const childId of childIds) {
      const childQuery = 'INSERT INTO ontology_clinical_relationships (parent_id, child_id) VALUES ($1, $2)';
      await client.query(childQuery, [newConceptId, childId]);
    }
  }

  await client.end();

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ message: 'Concept added' }),
  };
}
