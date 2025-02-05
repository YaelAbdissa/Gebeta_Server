const mongoose = require('mongoose');
const { mongo, env } = require('./vars');

const migration = require('../lib/migration.lib');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => { 
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
    mongoose.set('debug', true);
  }

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
    mongoose
      .connect(mongo.uri, {
        useCreateIndex: true,
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(async () => {
        console.log('mongoDB connected...') 
        await migration.migrateAdmin();
        await migration.migrateClient(); 
        await migration.migrateOrder();
        await migration.migrateDriver();    
      });
    return mongoose.connection;
  };