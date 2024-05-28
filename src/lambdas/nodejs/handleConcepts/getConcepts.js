import pkg from "pg";

const { Client } = pkg;

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

export async function getConcepts({ search, page, perPage, sortBy, sortOrder }) {
  const client = new Client({
    host: dbHost,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();

    let query = `SELECT c.id, c.display_name, c.description, c.alternate_names,
    COALESCE(
        ARRAY(
            SELECT jsonb_build_object('id', p.id, 'display_name', p.display_name)
            FROM ontology_clinical_concepts p
            JOIN ontology_clinical_relationships cr_parent ON p.id = cr_parent.parent_id
            WHERE cr_parent.child_id = c.id
        ),
        '{}'::jsonb[]
    ) AS parents,
    COALESCE(
        ARRAY(
            SELECT jsonb_build_object('id', ch.id, 'display_name', ch.display_name)
            FROM ontology_clinical_concepts ch
            JOIN ontology_clinical_relationships cr_child ON ch.id = cr_child.child_id
            WHERE cr_child.parent_id = c.id
        ),
        '{}'::jsonb[]
    ) AS children
    FROM ontology_clinical_concepts c
    `

    // let query = `
    //   SELECT c.id, c.display_name, c.description, c.alternate_names,
    //          ARRAY_REMOVE(ARRAY_AGG(DISTINCT cr_parent.parent_id), NULL) AS parent_ids,
    //          ARRAY_REMOVE(ARRAY_AGG(DISTINCT cr_child.child_id), NULL) AS child_ids
    //   FROM ontology_clinical_concepts c
    //   LEFT JOIN ontology_clinical_relationships cr_parent ON c.id = cr_parent.child_id
    //   LEFT JOIN ontology_clinical_relationships cr_child ON c.id = cr_child.parent_id
    // `;

    // Adds search query if search is provided
    if (search) {
      query += ` WHERE c.display_name ILIKE ${`'%${search}%'`}`;
    }

    // // Groups data
    // query += `
    //   GROUP BY c.id, c.display_name, c.description, c.alternate_names
    // `;

    // Orders data
    if (sortBy && sortOrder) {
      query += ` ORDER BY c.${sortBy} ${sortOrder}`;
    }

    // paginates data if provided
    if (page && perPage) {
      // page starts at 1
      const offset = (page - 1) * perPage;
      query += ` LIMIT ${perPage} OFFSET ${offset}`;
    }

    const res = await client.query(query);

    // Get total count
    const countQuery = "SELECT COUNT(*) FROM ontology_clinical_concepts";
    const countRes = await client.query(countQuery);
    const totalCount = countRes.rows[0].count;

    await client.end();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        rows: res.rows,
        totalCount,
      }),
    };
  } catch (error) {
    console.error("GET ERROR", error);
    await client.end();
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: error?.detail || "Error getting concepts",
      }),
    };
  }
}
