/* eslint-disable no-console */
const Converter = require('openapi-to-postmanv2');
const fs = require('fs');
const path = require('path');

const DATA_PATH = '../../';
const OUTPUT_PATH = '../../dist-postman';

const loadOpenAPI = (filename) => new Promise( (resolve, reject) => {
  const openApiPath = path.resolve(`${__dirname}/${DATA_PATH}/${filename}.yaml`);
  console.log(`Opening file ${openApiPath}...`);
  try {
    const openAPI = fs.readFileSync(openApiPath, { encoding: 'UTF8' });
    resolve(openAPI);
  }
  catch (err) {
    reject(err);
  }
});

const convertToPostman = (openAPIData) => new Promise( (resolve, reject) => {
  console.log(`Converting file...`);

  // See 'https://github.com/postmanlabs/openapi-to-postman' for more info on configuration
  const CONFIG = {
    // schemaFaker: true,
    // requestNameSource: 'fallback',
    // indentCharacter: ' ',
  };

  try {
    Converter.convert({ type: 'string', data: openAPIData }, CONFIG, (err, conversionResult) => {
      if (!conversionResult.result) {
        reject(new Error(`Could not convert ${conversionResult.reason}`));
        return;
      }
      resolve(conversionResult.output[0].data);
    });
  }
  catch (err) {
    reject(err);
  }
});

const saveOutput = (filename, data) =>
  new Promise((resolve, reject) => {
    const savePath = path.resolve(`${__dirname}/${OUTPUT_PATH}/${filename}.postman_collection.json`);
    console.log(`Saving file... ${savePath}`);
    fs.mkdir(path.resolve(`${__dirname}/${OUTPUT_PATH}`), { recursive: true }, errMd => {
      if (errMd) {
        reject(errMd);
        return;
      }
      resolve(savePath, data);
    });
  }).then(savePath => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(path.resolve(savePath), jsonData, errSave => {
      if (errSave) {
        throw errSave;
      }
      console.log(`Success!`);
    });
  });

module.exports = {
  loadOpenAPI,
  convertToPostman,
  saveOutput,
};
