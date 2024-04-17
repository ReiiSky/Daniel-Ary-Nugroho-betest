import { BaseEnv } from "./BaseEnv";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class Local extends BaseEnv {
  constructor(filepath: string) {
    const configFile = fs.readFileSync(filepath).toString('utf-8');
    const parsedEnv = dotenv.parse(configFile);

    super(parsedEnv);
  }
}