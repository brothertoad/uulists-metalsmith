const Metalsmith = require('metalsmith');

const inplace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const metalsmith = require('metalsmith');
const sass = require('metalsmith-sass');
const assets = require('metalsmith-static');
const dataLoader = require('metalsmith-data-loader');
const fs = require('fs');

const toUpper = function (string) {
    return string.toUpperCase();
};

const spaceToDash = function (string) {
    return string.replace(/\s+/g, "-");
};

const templateConfig = {
    engineOptions: {
        filters: {
            toUpper: toUpper,
            spaceToDash: spaceToDash
        }
    }
};

let listNames = [];

fs.readdirSync('./lists/').forEach(file => {
  listNames.push(file);
});

Metalsmith(__dirname)
    .metadata({ fs: fs, listNames: listNames })
    .source('./src')         // source directory for the pipeline
    .destination(process.env.HOME + '/www/uulists/')  // destination directory of the pipeline 
    .use(sass({ outputDir: 'css/' }))
    .use(dataLoader({
      removeSource: true
    }))
    .use(assets({
      src: "public",
      dest: "."
    }))
    .use(inplace(templateConfig))
    .use(layouts(templateConfig))
    .clean(true)             // clean the destination directory before build
    .build(function (err) {  // execute the build
        if (err) {
            throw err;
        }
    });
