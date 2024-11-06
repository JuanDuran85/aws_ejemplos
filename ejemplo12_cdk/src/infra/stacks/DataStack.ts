import {
  AttributeType,
  Table as DynamoDbTable,
} from "aws-cdk-lib/aws-dynamodb";
import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";

export class DataStack extends Stack {
  public readonly spacesTable: DynamoDbTable;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix: string = getSuffixFromStack(this);

    this.spacesTable = new DynamoDbTable(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${suffix}`,
    });
  }
}
