import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IAspect } from "aws-cdk-lib";
import { IConstruct } from "constructs";

export class BucketTagger implements IAspect {
  private readonly key: string;
  private readonly value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  public visit(node: IConstruct): void {
    console.debug(`Tagging ${node} with ${this.key}:${this.value}`);
    console.debug(`Visiting ${node.node.id}`);

    if (node instanceof CfnBucket) {
      node.tags.setTag(this.key, this.value);
    }
  }
}
