import AWS from 'aws-sdk';

const userPoolId = process.env.USER_POOL_ID;
const cognitoClient = new AWS.CognitoIdentityServiceProvider();

export async function listUsers(event) {
  const { page = 1, limit = 10 } = event.queryStringParameters || {};

  try {
    let allUsers = [];
    let totalCount = 0;
    let paginationToken;

    // Get the total count of all users in the user pool
    let paramsForTotalCount = {
      UserPoolId: userPoolId,
      Limit: 60
    };

    do {
      const data = await cognitoClient.listUsers(paramsForTotalCount).promise();
      totalCount += data.Users.length;
      paramsForTotalCount.PaginationToken = data.PaginationToken;
    } while (paramsForTotalCount.PaginationToken);

    // Fetch users based on the current page and limit
    const params = {
      UserPoolId: userPoolId,
      Limit: Number(limit)
    };

    let currentPage = 1;

    do {
      if (paginationToken) {
        params.PaginationToken = paginationToken;
      }
      const data = await cognitoClient.listUsers(params).promise();
      paginationToken = data.PaginationToken;

      for (const user of data.Users) {
        const groupParams = {
          UserPoolId: userPoolId,
          Username: user.Username
        };

        const groupData = await cognitoClient.adminListGroupsForUser(groupParams).promise();
        const role = groupData.Groups.length > 0 ? groupData.Groups[0].GroupName : 'None';

        allUsers.push({
          userName: user.Username,
          email: user.Attributes.find(attr => attr.Name === 'email')?.Value,
          role,
        });
      }

      currentPage++;
    } while (paginationToken && currentPage <= page);

    const startIndex = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        users: paginatedUsers,
        totalCount: totalCount,
        paginationToken: paginationToken // Include PaginationToken in the response for the next request
      })
    };
  } catch (error) {
    console.error('Error listing users:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
