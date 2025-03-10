

const config_json = {
  // 'aws_appsync_graphqlEndpoint': "https://2tgc2447zzcsrkxdogmrolzvjy.appsync-api.ap-south-1.amazonaws.com/graphql",
  //   'aws_appsync_region': "ap-south-1",
  //   'aws_appsync_authenticationType': "API_KEY",
  //   'aws_appsync_apiKey': "da2-e7nucradp5hg7ilori2jyufy2a",
    API: {
      GraphQL: {
        endpoint: 'https://2tgc2447zzcsrkxdogmrolzvjy.appsync-api.ap-south-1.amazonaws.com/graphql',
        region: "ap-south-1",
        // Set the default auth mode to "apiKey" and provide the API key value
        defaultAuthMode: 'apiKey',
        apiKey: "da2-e7nucradp5hg7ilori2jyufy2a"
      }
    },
    Storage: {
      S3: {
        bucket: "slumsoccer",
        region: "ap-south-1"
      }
    }
    // "aws_user_files_s3_bucket": "slumsoccer",
    // "aws_user_files_s3_bucket_region": "ap-south-1",
    }
    
export default config_json;