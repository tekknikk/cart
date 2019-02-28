// import mongoose = require('mongoose');
import { config } from './config/env';
import { app } from './config/restify';
import { logger } from './utils/logger';


const assert = require('assert');
const mongoose = require('mongoose');
mongoose.set('debug', true);



run().then(() => console.log('done')).catch(error => console.error(error.stack));

async function run() {
  await mongoose.connect(config.db, {
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
  });
}

// use native ES6 promises instead of mongoose promise library
// mongoose.Promise = global.Promise;
// temp debug
// mongoose.set('debug', true);

// connect to mongodb
// const options = { server: { socketOptions: { keepAlive: 1 } } };
// const db: mongoose.Connection = mongoose.connect(config.db, options).connection;

// print mongoose logs in dev and test env
// if (config.debug) {
//   mongoose.set('debug', true);
// }

// throw error on db error
// db.on('error', (err: any) => {
//   throw new Error(`Unable to connect to database: ${err}`);
// });

// start the server as soon as db connection is made
// db.once('open', () => {
//   logger.trace(`Connected to database: ${config.db}`);
// });

app.listen(config.port, () => {
  logger.trace(`${config.name} is running at ${app.url}`);
});

export { app };
