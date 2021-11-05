const aws = require('aws-sdk');
const ddb = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  if (!event?.request?.userAttributes?.sub) {
    console.log('No sub provided');
    return;
  }

  const now = new Date();
  const timestamp = now.getTime();

  // Greasemann, CC BY-SA 4.0 <https://creativecommons.org/licenses/by-sa/4.0>, via Wikimedia Commons

  const userItem = {
    __typename: { S: 'User' },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: '1' },
    createdAt: { S: now.toISOString() },
    updatedAt: { S: now.toISOString() },
    id: { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email },
    imageUri: {
      S: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
    },
  };

  const params = {
    Item: userItem,
    TableName: tableName,
  };

  try {
    await ddb.putItem(params).promise();
    console.log('Success');
  } catch (error) {
    console.log(error);
  }
};
