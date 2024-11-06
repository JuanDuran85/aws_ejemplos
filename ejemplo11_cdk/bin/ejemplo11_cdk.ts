#!/usr/bin/env node

import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { BucketTagger } from "./Tagger";
import { PhotosHandlerStack } from "../lib/PhotosHandlerStack";
import { PhotosStack } from "../lib/photos_stack";

const app: cdk.App = new cdk.App();
const photosStack: PhotosStack = new PhotosStack(app, "PhotosStack");
new PhotosHandlerStack(app, "PhotosHandlerStack", {
  targetBucketArn: photosStack.photosBucketArn,
});
const tagger: BucketTagger = new BucketTagger("TagKey", "TagValue");
cdk.Aspects.of(app).add(tagger);
