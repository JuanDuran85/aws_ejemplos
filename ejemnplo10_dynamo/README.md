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

  - The Scan API is similar to the Query API except that since we want to scan the whole table and not just a single Item Collection, there is no Key Condition Expression for a Scan. However, you can specify useful options such as:
    1. --filter-expression : you can specify a Filter Expression which will reduce the size of the result set (even though it will not reduce the amount of capacity consumed).
    2. --max-items : you can limit the number of items returned in the result set. In that case, the scan response will include a NextToken which we can then issue to a subsequent scan call to pick up where we left off.
    3. --starting-token : you can specify a Starting Token to pick up where you left off. This is useful when you are paging through a large result set and you want to pick up where you left off.
    4. --expression-attribute-values : you can specify a set of Expression Attribute Values to use in the Filter Expression. If you specify ExpressionAttributeValues, then all of the other parameters should be specified.
    5. --expression-attribute-names : you can specify a set of Expression Attribute Names to use in the Filter Expression. If you specify ExpressionAttributeNames, then all of the other parameters should be specified.

```bash	
    aws dynamodb scan \
        --table-name MyTable \
        --filter-expression "Name = :n" \
        --expression-attribute-values '{ ":n": { "S": "John Doe" } }' \
        --max-items 2 \
        --return-consumed-capacity TOTAL
```

```bash
    aws dynamodb scan \
        --table-name MyTable \
        --filter-expression "Name = :n" \
        --expression-attribute-values '{ ":n": { "S": "John Doe" } }' \
        --max-items 2 \
        --starting-token "NextTokenValueHere"
        --return-consumed-capacity TOTAL
```

```bash
    aws dynamodb scan \
        --table-name MyTable \
        --filter-expression "Threads >= :threads AND #Views >= :views" \
        --expression-attribute-values '{ ":threads": { "N": "10" }, ":views": { "N": "100" } }' \
        --expression-attribute-names '{ "#Views": "Views" }' \
        --return-consumed-capacity TOTAL
```

### DynamoDB - Inserting Sample Data with PutItem

```bash
    aws dynamodb put-item \
        --table-name MyTable \
        --item '{ "ID": { "S": "John Doe" }, "Name": { "S": "John Doe" }, "Email": { "S": "qQp6U@example.com" } }'
        --return-consumed-capacity TOTAL
```

### DynamoDB - Update Sample Data with UpdateItem

```bash
    aws dynamodb update-item \
        --table-name MyTable \
        --key '{ "ID": { "S": "John Doe" } }' \
        --update-expression "SET Email = :newEmail" \
        --condition-expression "Email = :oldEmail" \
        --expression-attribute-values '{ ":oldEmail": { "S": "qQp6U@example.com" }, ":newEmail": { "S": "newEmail@example.com" }' \
        --return-consumed-capacity TOTAL
```

 - If we need to update a List attribute, we need to use the **list_append()** function in the UpdateExpression to add an item to the list.

```bash
    aws dynamodb update-item \
        --table-name MyTable \
        --key '{ "ID": { "S": "John Doe" } }' \
        --update-expression "SET #Countries = list_append(#Countries, :newValues)" \
        --expression-attribute-names '{ "#Countries": "Countries" }' \
        --expression-attribute-values '{
            ":values" : {"L": [{"S" : "France"}, {"S" : "Germany"}]}
        }' \
        --return-consumed-capacity TOTAL
```

 - If we want to remove some values from a list attribute, we have to reference the index number in the list. DynamoDB lists are 0-based.

```bash
    aws dynamodb update-item \
        --table-name MyTable \
        --key '{ "ID": { "S": "John Doe" } }' \
        --update-expression "REMOVE #Countries[0]" \
        --expression-attribute-names '{ "#Countries": "Countries" }' \
        --return-consumed-capacity TOTAL
```

### DynamoDB - Read just a single item with get-item
  - GetItem is the fastest and cheapest way to get data out of DynamoDB as you must specify the full Primary Key so the command is guaranteed to match at most one item in the table.
```bash
    aws dynamodb get-item --table-name MyTable --key '{ "ID": { "S": "John Doe" } }'
```
  - There are many useful options to the get-item command but a few that get used regularly are:
    1. --consistent-read : Specifying that you want a strongly consistent read
    2. --projection-expression : Specifying that you only want certain attributes returned in the request
    3. --return-consume-capacity : Tell us how much capacity was consumed by the request

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
    aws dynamodb query \
        --table-name MyTable \
        --key-condition-expression 'Name = :n and Email = :e and DateOfBirth > :dob' \
        --filter-expression 'LastName = :ln' \
        --expression-attribute-values '{ 
            ":n" : { "S": "John" }, 
            ":e" : { "S": "Pq5h8@example.com" },
            ":dob" : { "S": "2000-10-25" },
            ":ln" : { "S": "Smith" }
        }' \
        --return-consume-capacity TOTAL
```

- There are many useful options to the query command but a few that get used regularly are:
    1. --filter-expression : We can use Filter Expressions if we want to limit our results based on non-key attributes
    2. --max-items : If we want to limit the number of items 
    3. --scan-index-forward : If we want to order items in ascending order of the sort key
    4. --no-scan-index-forward : If we want to order items in descending order of the sort key

### DynamoDB - Deleting Data with DeleteItem

  - Deletes a single item in a table by primary key. You can perform a conditional delete operation that deletes the item if it exists, or if it has an expected attribute value.
  - In addition to deleting an item, you can also return the item's attribute values in the same operation, using the ReturnValues parameter.
  - Unless you specify conditions, the DeleteItem is an idempotent operation; running it multiple times on the same item or attribute does not result in an error response.
  - Conditional deletes are useful for deleting items only if specific conditions are met. If those conditions are met, DynamoDB performs the delete. Otherwise, the item is not deleted.

```bash
    aws dynamodb delete-item \
        --table-name MyTable \
        --key '{ "ID": { "S": "John Doe" } }' \
        --update-expression "SET Email = :newEmail" \
        --condition-expression "Email = :oldEmail" \
        --expression-attribute-values '{
            ":oldEmail": { "S": "Pq5h8@example.com" },
            ":newEmail": { "S": "Pq5h8@example.com" }
        }' \
        --return-consumed-capacity 'TOTAL'
```

### DynamoDB - Transaction write operations

  - TransactWriteItems is a synchronous write operation that groups up to 100 action requests. These actions can target items in different tables, but not in different Amazon Web Services accounts or Regions, and no two actions can target the same item.
  - The aggregate size of the items in the transaction cannot exceed 4 MB.
  - The actions are completed atomically so that either all of them succeed, or all of them fail. They are defined by the following objects: Put, update, Delete, and Condition.
  - When are some good times to use transactions?:
    - Maintaining uniqueness on multiple attributes
    - Handling counts and preventing duplicates
    - Authorizing a user to perform a certain action
    
  - DynamoDB rejects the entire TransactWriteItems request if any of the following is true:
    - A condition in one of the condition expressions is not met.
    - An ongoing operation is in the process of updating the same item.
    - There is insufficient provisioned capacity for the transaction to be completed.
    - An item size becomes too large (bigger than 400 KB), a local secondary index (LSI) becomes too large, or a similar validation error occurs because of changes made by the transaction.
    - The aggregate size of the items in the transaction exceeds 4 MB.
    There is a user error, such as an invalid data format.

```bash
    aws dynamodb transact-write-items --client-request-token TRANSACTION1 --transact-items '[
        {
            "Put": {
                "TableName": "MyTable",
                "Item": {
                    "ID": { "S": "John Doe" },
                    "Email": { "S": "qQp6U@example.com" }
                }
            }
        },
        {
            "Update": {
                "TableName": "MyTable",
                "Key": {
                    "ID": { "S": "John Doe" }
                },
                "UpdateExpression": "SET Email = :newEmail",
                "ExpressionAttributeValues": {
                    ":newEmail": { "S": "newEmail@example.com" }
                }
            }
        }
    ]'
```

### DynamoDB - Transaction read operations

  - TransactGetItems is a synchronous operation that atomically retrieves multiple items from one or more tables (but not from indexes) in a single account and Region. 
  - A TransactGetItems call can contain up to 100 TransactGetItem objects, each of which contains a Get structure that specifies an item to retrieve from a table in the account and Region. 
  - A call to TransactGetItems cannot retrieve items from tables in more than one Amazon Web Services account or Region. 
  - The aggregate size of the items in the transaction cannot exceed 4 MB.
  
  - DynamoDB rejects the entire TransactGetItems request if any of the following is true:
    - A conflicting operation is in the process of updating an item to be read.
    - There is insufficient provisioned capacity for the transaction to be completed.
    - There is a user error, such as an invalid data format.
    - The aggregate size of the items in the transaction exceeded 4 MB.

```bash
    aws dynamodb transact-get-items --transact-items '[
        {
            "Get": {
                "TableName": "MyTable",
                "Key": {
                    "ID": { "S": "John Doe" }
                },
                "ProjectionExpression": "Name, Email",
                "ExpressionAttributeNames": { "#name": "Name" }
            }
        }
    ]'
```

### DynamoDB - Global Secondary Indexes

  - If we wanted to look for items based on non-key attributes we had to do a full table scan and use filter conditions to find what we wanted, which would be both very slow and very expensive for systems operating at large scale.
  - Some applications might need to perform many kinds of queries, using a variety of different attributes as query criteria. To support these requirements, you can create one or more global secondary indexes and issue Query requests against these indexes in Amazon DynamoDB.
  - DynamoDB provides a feature called Global Secondary Indexes (GSIs) which will automatically pivot your data around different Partition and Sort Keys. Data can be re-grouped and re-sorted to allow for more access patterns to be quickly served with the Query and Scan APIs.
  - GSIs can be created and removed at any time, even if the table has data in it already! This new GSI will use the PostedBy attribute as the Partition (HASH) key and we will still keep the messages sorted by some attribute as the Sort key. We want all the attributes from the table copied (projected) into the GSI so we will use the ALL ProjectionType.
  - It can take a little time while DynamoDB creates the GSI and backfills data from the table into the index. We can watch this from the command line and wait until the IndexStatus goes ACTIVE.

```bash
    aws dynamodb update-table \
        --table-name MyTable \
        --attribute-definitions AttributeName=PostedBy,AttributeType=S AttributeName=ID,AttributeType=S \
        --global-secondary-index-updates '[{
            "Create": {
                "IndexName": "PostedByIndex-gsi",
                "KeySchema": [{
                    "AttributeName": "PostedBy",
                    "KeyType": "HASH"
                }, {
                    "AttributeName": "ID",
                    "KeyType": "RANGE"
                }],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 10,
                    "WriteCapacityUnits": 5
                }
            }
        }
    ]'
```

```bash
#Get initial status
aws dynamodb describe-table --table-name MyTable --query "Table.GlobalSecondaryIndexes[0].IndexStatus"
#Watch the status with the wait command (use Ctrl+C to exit):
watch -n 5 "aws dynamodb describe-table --table-name MyTable --query "Table.GlobalSecondaryIndexes[0].IndexStatus""
```

  - Running a query on a GSI is no different than running it against a table, except we also need to specify which GSI to use with the --index-name option and we'll use the GSI key attributes in the KeyConditionExpression.
```bash	
    aws dynamodb query \
        --table-name MyTable \
        --key-condition-expression "PostedBy = :postedBy" \
        --expression-attribute-values '{ ":postedBy": { "S": "John Doe" } }' \
        --index-name PostedByIndex-gsi \
        --return-consumed-capacity TOTAL
```

  - When you are done with a GSI you can remove it with the --global-secondary-index-name option.

```bash
    aws dynamodb update-table \
        --table-name MyTable \
        --global-secondary-index-updates '[{
            "Delete": {
                "IndexName": "PostedByIndex-gsi"
            }
        }
    ]'
```

### DynamoDB - Backup, Remove and Restore
  
  - First, let’s understand some AWS Backup terminology:
    - Backup vault: a container that you organize your backups in.
    - Backup plan: a policy expression that defines when and how you want to back up your AWS resources. The backup plan is attached to a backup vault.
    - Resource assignment: defines which resources should be backed up. You can select resources by tags or by resource ARN.
    - Recovery point: a snapshot/backup of a resource backed up by AWS Backup. Each recovery point can be restored with AWS Backup.
