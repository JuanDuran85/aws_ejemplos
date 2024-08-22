# DynamoDB

## [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html) - Using [CLI commands](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/)

### DynamoDB - create table

```bash
    aws dynamodb create-table \
        --table-name MyTable \
        --attribute-definitions \
            AttributeName=ID,AttributeType=S \
        --key-schema \
            AttributeName=ID,KeyType=HASH \
        --provisioned-throughput \
            ReadCapacityUnits=10,WriteCapacityUnits=5 \
        --query 'TableDescription.TableStatus' \
```
### DynamoDB - wait table-exists
- wait pauses and resumes only after it can confirm that the specified table exists.

```bash
    aws dynamodb wait table-exists --table-name MyTable
```

### DynamoDB - describe table

```bash
    aws dynamodb describe-table --table-name MyTable
```

### DynamoDB - Load data from JSON file

```bash
    aws dynamodb batch-write-item --request-items file://file_name.json
```

### DynamoDB - delete table

```bash
    aws dynamodb delete-table --table-name MyTable
```

### DynamoDB - Read Sample Data with Scan

```bash
    aws dynamodb scan --table-name MyTable
```

### DynamoDB - Read just a single item with get-item
  - GetItem is the fastest and cheapest way to get data out of DynamoDB as you must specify the full Primary Key so the command is guaranteed to match at most one item in the table.
```bash
    aws dynamodb get-item --table-name MyTable --key '{ "ID": { "S": "John Doe" } }'
```
  - There are many useful options to the get-item command but a few that get used regularly are:
    --consistent-read : Specifying that you want a strongly consistent read
    --projection-expression : Specifying that you only want certain attributes returned in the request
    --return-consume-capacity : Tell us how much capacity was consumed by the request

```bash	
    aws dynamodb get-item \
        --table-name MyTable \
        --key '{ "ID": { "S": "John Doe" } }' 
        --consistent-read \
        --projection-expression 'Name, Email' \
        --return-consume-capacity TOTAL
```

### DynamoDB - Reading Item Collections using Query

```bash
    aws dynamodb query --table-name MyTable