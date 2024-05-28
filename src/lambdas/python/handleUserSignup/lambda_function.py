import boto3

def lambda_handler(event, context):
    user_pool_id = event['userPoolId']
    user_name = event['userName']

    client = boto3.client('cognito-idp')
    group_name = 'View'

    try:
        response = client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=user_name,
            GroupName=group_name
        )
        print(f"Successfully added user {user_name} to group {group_name}")
    except client.exceptions.ClientError as e:
        print(f"Error adding user {user_name} to group {group_name}: {e}")

    return event
