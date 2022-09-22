import AWS from 'aws-sdk';
import { getEnvironmentVariable } from '../utils';

const regionAws: string | undefined = getEnvironmentVariable('AWS_REGION');

const s3 = new AWS.S3({
    region: regionAws,
});

const ssm = new AWS.SSM({
    region: regionAws,
});

const readDragons = async () => {
    const fileName = await getFileName();
    const bucketName = await getBucketName();
    return readDragonsFromS3(bucketName as string,fileName as string);
}

const getFileName = async () => {
    const fileNameParameters = {
        Name:  'dragon_data_file_name',
        WithDecryption: false
    };

    const promise = await ssm.getParameter(fileNameParameters).promise();

    return promise.Parameter?.Value;
}

const getBucketName = async () => {
    const bucketNameParameters = {
        Name:  'dragon_data_bucket_name',
        WithDecryption: false
    };

    const promise = await ssm.getParameter(bucketNameParameters).promise();

    return promise.Parameter?.Value;
}

const readDragonsFromS3 = (bucketName: string, fileName: string) => {
 
    s3.selectObjectContent({
       Bucket: bucketName,
       Expression: 'select * from s3object s',
       ExpressionType: 'SQL',
       Key: fileName,
       InputSerialization: {
         JSON: {
           Type: 'DOCUMENT',
         }
       },
       OutputSerialization: {
         JSON: {
           RecordDelimiter: ','
         }
       }
     }, (err, data) => {
       if (err) {
           console.error(err);
       } else {
         handleData(data);
       }
     }
    );
  }

const handleData = (dataIn: any) => {
    if (dataIn.Payload){
        dataIn.Payload.on('data', (event: any) => {
              if (event.Records) {
                  console.log(event.Records.Payload.toString());
              }
          });
    }else{
        console.error("No existe data");
    }
  }
  
  readDragons();

