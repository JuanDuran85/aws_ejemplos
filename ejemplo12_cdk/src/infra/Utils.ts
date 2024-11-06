import { Fn, Stack } from "aws-cdk-lib";

export function getSuffixFromStack(stack: Stack): string {
  const shortStackId: string = Fn.select(2, Fn.split("/", stack.stackId));
  return Fn.select(4, Fn.split("-", shortStackId));
}
