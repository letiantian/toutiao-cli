var randomIpv4 = require('random-ipv4');
var request    = require('request');
var _          = require('underscore');
/**
 * 伪造IP
 * @return {String} [IP地址]
 */
var getFakeIp = function() {
    return randomIpv4('{token1}.{token2}.{token3}.{token4}', {
        token1:{
            min: 137,
            max: 191
        },
        token2:{
            min: 17,
            max: 192
        },
        token3:{
            min: 2,
            max: 200
        }
    });
};


var getCategories = function() {
    return {
        'default': '__all__',              // 推荐
        'hot': 'news_hot',                 // 热点
        'society': 'news_society',         // 社会
        'entertainment': 'news_entertainment',   // 娱乐
        'tech': 'news_tech',            // 科技
        'car': 'news_car',             // 汽车
        'sports': 'news_sports',          // 体育
        'finance': 'news_finance',         // 财经
        'world': 'news_world'            // 国际
    };
};

var getUrl = function(category, count) {
    return 'http://toutiao.com/api/article/recent/?source=2&count='+count+'&category=' +category+ '&utm_source=toutiao&offset=0';
};

var analyzeJsonResult = function(jsonString) {
    var obj = JSON.parse(jsonString);
    var result = [];
    if(obj.message && obj.message == 'success' && obj.data) {
        _.each(obj.data, function(item) {
            result.push({url: item.display_url, title: item.title, abstract: item.abstract});
        });
    }
    return result;
};


var getJsonResult = function(url) {
    return new Promise(function(resolve, reject){
        userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36';
        fakeIP = getFakeIp();
        requestConfig = {
            url: url, 
            timeout: 5000, 
            followRedirect: true,
            headers: {
                'User-Agent': userAgent,
                'X-Forwarded-For': fakeIP,
                'X-Real-IP': fakeIP
            }
        };

        request(requestConfig, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(Error(error));
            }
        });
    });
};



exports.getFakeIp = getFakeIp;
exports.getCategories = getCategories;
exports.getUrl = getUrl;
exports.analyzeJsonResult = analyzeJsonResult;
exports.getJsonResult = getJsonResult;