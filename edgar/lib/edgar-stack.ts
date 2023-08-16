import * as cdk from "aws-cdk-lib";
import { CfnOutput, CfnParameter, Duration } from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(
    scope: Construct,
    id: string,
    expiration: number,
    bucketName: string
  ) {
    super(scope, id);

    new Bucket(this, "L3Bucket", {
      bucketName,
      lifecycleRules: [
        {
          expiration: Duration.days(expiration),
        },
      ],
    });
  }
}
export class EdgarStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'EdgarQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // create an s3 bucket 3 ways:
    new CfnBucket(this, "MyL1Bucket", {
      bucketName: "myl1-ecv",
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 1,
            status: "Enabled",
          },
        ],
      },
    });

    const duration = new CfnParameter(this, "duration", {
      default: 6,
      minValue: 1,
      maxValue: 10,
      type: "Number",
    });

    const myL2Bucket = new Bucket(this, "MyL2Bucket", {
      bucketName: "myl2-ecv",
      lifecycleRules: [
        {
          expiration: Duration.days(duration.valueAsNumber),
        },
      ],
    });

    new CfnOutput(this, "MyL2BucketName", {
      value: myL2Bucket.bucketName,
    });

    new L3Bucket(this, "MyL3Bucket", 3, "myl3-ecv");
  }
}
