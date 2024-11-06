import {
  LambdaIntegration,
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  helloLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    const api: RestApi = new RestApi(this, "SpacesApi");
    const spacesResource: Resource = api.root.addResource("spaces");
    spacesResource.addMethod("GET", props?.helloLambdaIntegration);
  }
}
