import * as path from 'path';

interface ConfigSettings {
  root: string;
  name: string;
  port: number;
  env: string;
  db: string;
  debug: boolean
}

const env: string = process.env.NODE_ENV || 'development';
const debug: boolean = false;
// const debug: boolean = process.env.DEBUG || false;

// default settings are for dev environment
const config: ConfigSettings = {
  name: 'API Locations',
  env: env,
  debug: debug,
  root: path.join(__dirname, '/..'),
    port: 5000,
  db: 'mongodb://localhost:27017/cart'
};

if (env === 'test') {
  config.port = 5000;
  config.debug = debug;
}

if (env === 'production') {
  config.port = 5000;
  config.db = process.env.MONGO_URL;
  config.debug = true;
}

export { config };
