import pkg from 'pg';

const { Client } = pkg;

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

export async function updateConcept(concept) {
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
    UPDATE ontology_clinical_concepts
    SET display_name = $2, description = $3, alternate_names = $4
    WHERE id = $1
  `;
  const values = [concept.id, concept.display_name, concept.description, concept.alternate_names];

  await client.query(query, values);

  const deleteRelationshipsQuery = 'DELETE FROM ontology_clinical_relationships WHERE parent_id = $1 OR child_id = $1';
  await client.query(deleteRelationshipsQuery, [concept.id]);

  if (concept.parent_ids) {
    const parentIds = concept.parent_ids.split(',');
    for (const parentId of parentIds) {
      const parentQuery = 'INSERT INTO ontology_clinical_relationships (parent_id, child_id) VALUES ($1, $2)';
      await client.query(parentQuery, [parentId, concept.id]);
    }
  }

  if (concept.child_ids) {
    const childIds = concept.child_ids.split(',');
    for (const childId of childIds) {
      const childQuery = 'INSERT INTO ontology_clinical_relationships (parent_id, child_id) VALUES ($1, $2)';
      await client.query(childQuery, [concept.id, childId]);
    }
  }

  await client.end();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ message: 'Concept updated' }),
  };
}
