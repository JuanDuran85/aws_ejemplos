import * as cdk from "aws-cdk-lib";

import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class PhotosStack extends cdk.Stack {
  private stackSuffix: string;
  public readonly photosBucketArn: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.initializeSuffix();
    const photoBucket: cdk.aws_s3.Bucket = new Bucket(this, "PhotosBucket", {
      bucketName: `photos-bucket-${this.stackSuffix}`,
    });
    this.photosBucketArn = photoBucket.bucketArn;
  }

  private initializeSuffix(): void {
    const shortStackId: string = cdk.Fn.select(
      2,
      cdk.Fn.split("/", this.stackId)
    );
    this.stackSuffix = cdk.Fn.select(4, cdk.Fn.split("-", shortStackId));
  }
}
