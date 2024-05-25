const awsConfig = {
    Auth: {
        Cognito: {
          userPoolClientId: '1geo2fqaveaqa2c5fmic2f2g6b',
          region: 'us-east-1',
          userPoolId: 'us-east-1_PFvXZQdcW',
          //userPoolWebClientId: '1geo2fqaveaqa2c5fmic2f2g6b',
          loginWith: {oauth: {}},
        }
    }
};
export default awsConfig;
