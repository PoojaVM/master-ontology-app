import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { getConcepts } from './getConcepts.js';
import { addConcept } from './addConcept.js';
import { updateConcept } from './updateConcept.js';
import { deleteConcept } from './deleteConcept.js';

const userPoolId = process.env.USER_POOL_ID;
const region = process.env.REGION;

const cognitoClient = new AWS.CognitoIdentityServiceProvider();

const client = jwksClient({
  jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export async function handler(event) {
  const authorizationHeader = event.headers.Authorization || event.headers.authorization;

  if (!authorizationHeader) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Authorization header missing' }),
    };
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Token missing from Authorization header' }),
    };
  }

  let decodedToken;
  try {
    decodedToken = await verifyToken(token);
  } catch (error) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Invalid token' }),
    };
  }

  const username = decodedToken['cognito:username'];

  const groups = await getUserGroups(userPoolId, username);

  const method = event.httpMethod;
  const body = event.body ? JSON.parse(event.body) : null;

  try {
    if (method === 'GET') {
      return await getConcepts();
    } else if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      if (groups.includes('Admin') || groups.includes('Edit')) {
        if (method === 'POST') {
          return await addConcept(body);
        } else if (method === 'PUT') {
          return await updateConcept(body);
        } else if (method === 'DELETE') {
          return await deleteConcept(event.pathParameters.id);
        }
      } else {
        return {
          statusCode: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ message: 'Forbidden' }),
        };
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Bad Request' }),
      };
    }
  } catch (error) {
    console.error('Error processing request', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

async function getUserGroups(userPoolId, username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  const data = await cognitoClient.adminListGroupsForUser(params).promise();
  return data.Groups.map(group => group.GroupName);
}

