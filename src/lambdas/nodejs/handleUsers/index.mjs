import { listUsers } from './listUsers.js';
import { updateUserPermission } from './updateUserPermission.js';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import AWS from 'aws-sdk';

const userPoolId = process.env.USER_POOL_ID;
const region = process.env.REGION;

const client = jwksClient({
  jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

async function isAdmin(userPoolId, username) {
  const cognitoClient = new AWS.CognitoIdentityServiceProvider();
  const params = {
    UserPoolId: userPoolId,
    Username: username
  };

  const data = await cognitoClient.adminListGroupsForUser(params).promise();
  return data.Groups.some(group => group.GroupName === 'SuperAdmin' || group.GroupName === 'Admin');
}

export const handler = async (event) => {
  const authorizationHeader = event.headers.Authorization || event.headers.authorization;

  if (!authorizationHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Authorization header missing' }),
    };
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Token missing from Authorization header' }),
    };
  }

  let decodedToken;
  try {
    decodedToken = await verifyToken(token);
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' }),
    };
  }

  const username = decodedToken['cognito:username'];

  const isAdminUser = await isAdmin(userPoolId, username);
  if (!isAdminUser) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden' }),
    };
  }

  const method = event.httpMethod;
  if (method === 'GET') {
    return await listUsers(event);
  } else if (method === 'PUT') {
    return await updateUserPermission(event);
  } else {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }
};
