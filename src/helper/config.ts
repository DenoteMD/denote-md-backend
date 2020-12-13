import dotenv from 'dotenv';
import fs from 'fs';
import { objToCamelCase } from './utilities';

interface ApplicationConfig {
  nodeEnv: string;
  mongoConnectString: string;
  serviceCors: string;
  serviceHost: string;
  servicePort: string;
}

export default <ApplicationConfig>objToCamelCase(dotenv.parse(fs.readFileSync(`${__dirname}/../../.env`)));
