import AWS from 'aws-sdk';

const userPoolId = process.env.USER_POOL_ID;
const cognitoClient = new AWS.CognitoIdentityServiceProvider();

export async function updateUserPermission(event) {
  const { id } = event.pathParameters;
  const { newGroup } = JSON.parse(event.body);

  if (!id || !newGroup) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'User ID and new group are required' })
    };
  }

  try {
    const currentGroups = await cognitoClient.adminListGroupsForUser({
      UserPoolId: userPoolId,
      Username: id
    }).promise();

    await Promise.all(currentGroups.Groups.map(group => 
      cognitoClient.adminRemoveUserFromGroup({
        UserPoolId: userPoolId,
        Username: id,
        GroupName: group.GroupName
      }).promise()
    ));

    await cognitoClient.adminAddUserToGroup({
      UserPoolId: userPoolId,
      Username: id,
      GroupName: newGroup
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'User group updated' })
    };
  } catch (error) {
    console.error('Error updating user group:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
