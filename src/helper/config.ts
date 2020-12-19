import dotenv from 'dotenv';
import fs from 'fs';
import { objToCamelCase } from './utilities';

interface ApplicationConfig {
  nodeEnv: string;
  mongoConnectString: string;
  awsKeyId: string;
  awsAccessKey: string;
  serviceCors: string;
  serviceHost: string;
  servicePort: string;
}

export default <ApplicationConfig>objToCamelCase(dotenv.parse(fs.readFileSync(`${__dirname}/../../.env`)));
