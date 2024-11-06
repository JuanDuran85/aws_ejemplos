
import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";


const app: App = new App();
const dataStack: DataStack = new DataStack(app, "DataStack");
const lambdaStack: LambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
});
new ApiStack(app, "ApiStack", {
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration,
});
