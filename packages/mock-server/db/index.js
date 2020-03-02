/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const basic = require('./default/basic');
const random = require('./default/random');

// Constants
const dbs = {
  basic,
  random
};

//
const buildDb = (dbName) => {
  // Load db from .dbs/ , if it doesn't exist, load the default db
  const filePath = path.resolve(`${__dirname}/.db/${dbName}.json`);
  let rawData;
  let store = {};
  if (fs.existsSync(filePath)) {
    console.log(`Loading previously-saved ${dbName} db from '${filePath}'.
      To use the original db, delete ${dbName}.json, in the client/packages/mock-service/db/.db path`);
    rawData = fs.readFileSync(filePath);
    store = JSON.parse(rawData);
  } else {
    console.log(`Loading new ${dbName} db from defaults...`);
    store = dbs[dbName.toLowerCase()];
  }

  // return store, with a save function
  return {
    store,
    save: () => {
      const txt = JSON.stringify(store, null, 2);
      const p = path.resolve(`${__dirname}/.db`);
      fs.mkdirSync(p, { recursive: true });
      fs.writeFileSync(path.resolve(`${p}/${dbName}.json`), txt, { flag: 'w'});
    }
  };
};

module.exports = {
  create: dbName => buildDb(dbName),
};
