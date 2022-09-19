import json
import logging
import os
import sys
import traceback

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event):
    """_summary_

    Args:
        event (_type_): _description_
        context (_type_): _description_

    Returns:
        _type_: _description_
    """

    try:
        logger.info(f'event: {event}')
        name = event['firstName'] + ' ' + event['lastName']
        logger.info(f'The name is: {name}')
        return {"status": "success", "message": 'finalizado', 'body': json.dumps(f'Hello from Lambda, {name}')}
      
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