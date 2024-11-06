import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}
export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    const helloLambda: LambdaFunction = new LambdaFunction(
      this,
      "HelloHandler",
      {
        runtime: Runtime.NODEJS_20_X,
        handler: "hello.main",
        code: Code.fromAsset(join(__dirname, "../../services")),
        environment: {
          TABLE_NAME: props!.spacesTable.tableName,
        },
      }
    );
    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
