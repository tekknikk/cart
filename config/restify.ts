import * as fs from 'fs';
import * as restify from 'restify';
import * as path from 'path';
import { config } from './env';

// const jsonwebtoken = require('jsonwebtoken')
const jwt = require('restify-jwt-community');

// get path to route handlers
const pathToRoutes: string = path.join(config.root, '/app/routes');

// create Restify server with the configured name
const app: restify.Server = restify.createServer({ name: config.name });

const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
  // preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['API-Token', 'Authorization'],
  exposeHeaders: ['API-Token-Expiry']
});

app.pre(cors.preflight);
app.use(cors.actual);

// parse the HTTP query string use
app.use(restify.plugins.queryParser({
  mapParams: true
}));

// parse the body of the request into req.params
app.use(restify.plugins.bodyParser({
  mapParams: true
}));

const verifykey = fs.readFileSync('signkey.pub', 'utf8');

const jwtConfig = {
  secret: verifykey,
  issuer: 'PontoonX',
  expiresIn: '100h',
  algorithm: ['RS256']
};

app.use(jwt(jwtConfig).unless({
  path: [
      '/products'
  ]
}));


// add route handlers
fs.readdir(pathToRoutes, (err: any, files: string[]) => {
  if (err) {
    throw new Error(err);
  } else {
    files
      .filter((file: string) => path.extname(file) === '.js')
      .forEach((file: string) => {
        const route = require(path.join(pathToRoutes, file));
        route.default(app);
      });
  }
});

export { app };
