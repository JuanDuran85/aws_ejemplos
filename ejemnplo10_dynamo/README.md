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
