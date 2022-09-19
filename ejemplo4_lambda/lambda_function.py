import json
import logging
import sys
import traceback
from time import gmtime, strftime

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('HelloWorldDatabase')
now = strftime("%a, %d %b %Y %H:%M:%S +0000", gmtime())

def lambda_handler(event, context):
    """_summary_

    Args:
        event (_type_): _description_
        context (_type_): _description_

    Returns:
        _type_: _description_
    """
    try:
        logger.info(f'event: {event}')
        logger.info(f'context: {context}')
        name = event['firstName'] + ' ' + event['lastName']
        logger.info(f'The name is: {name}')
        response = table.put_item(
            Item={
                'ID': name,
                'LatestGreetingTime':now
                })
        logger.info(f'response: {response}')
        return {"status": "success", "message": 'finalizado en DB', 'body': json.dumps(f'Hello from Lambda, {name}')}
        
    except Exception as exp:
            exception_type, exception_value, exception_traceback = sys.exc_info()
            traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
            err_msg = json.dumps({
                "errorType": exception_type.__name__,
                "errorMessage": str(exception_value),
                "stackTrace": traceback_string
            })
            logger.error(err_msg)
            logger.error(exp)