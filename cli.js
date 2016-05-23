#!/usr/bin/env node
'use strict';

var util = require('./util');
var co   = require('co');
var _    = require('underscore');
var chalk = require('chalk');


co(function *(){
    var argv = require('minimist')(process.argv.slice(2));
    var human_category, category, count;
    if (argv._) {
        if (argv._.length == 0) {
            human_category = 'default';
        } else {
            human_category = argv._[0];
        }
    }

    var cats = util.getCategories();
    if (cats.hasOwnProperty(human_category)) {
        category = cats[human_category];
    } else {
        throw new Error("invalid category!");
        return;
    }

    if (argv.c && parseInt(argv.c) > 4) {
        count = parseInt(argv.c);
    } else {
        count = 4
    }

    // console.log(category);
    // console.log(count);

    var url = util.getUrl(category, count);
    var json = yield util.getJsonResult(url);
    var urlList = util.analyzeJsonResult(json);
    _.each(urlList, function(item) {
        console.log(chalk.white.bgBlue.bold(item.title));
        console.log(item.abstract);
        console.log();
    });
}).then(function(){}, function(err){
    console.error(err);
});