import * as cdk from "aws-cdk-lib";

import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

interface PhotosHandlerStackProps extends cdk.StackProps {
  targetBucketArn: string;
}

export class PhotosHandlerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: PhotosHandlerStackProps) {
    super(scope, id, props);

    new LambdaFunction(this, "PhotosHandler", {
      runtime: Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Hello!:::: " + process.env.TARGET_BUCKET);
        };
        `),
      environment: {
        TARGET_BUCKET: props?.targetBucketArn!,
      },
    });
  }
}
