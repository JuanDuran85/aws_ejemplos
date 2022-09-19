import json


def lambda_handler(event, context):
    """_summary_

    Args:
        event (_type_): _description_
        context (_type_): _description_

    Returns:
        _type_: _description_
    """
    name = event['firstName'] + ' ' + event['lastName']
    print(context)
    return {'statusCode': 200, 'body': json.dumps(f'Hello from Lambda, {name}')}
