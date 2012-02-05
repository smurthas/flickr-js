var crypto = require('crypto'),
    request = require('request');
    
var base_url = 'http://api.flickr.com/services/rest/';

var Client = function(apiKey, apiSecret) {
    
    function getSignature(params) {
        var hash = crypto.createHash('md5');
        params.sort();
        var baseString = apiSecret;
        for(i in params)
            baseString += params[i].replace(/=/, '');
        hash.update(baseString);
        return hash.digest('hex');
    }
    
    function getSignedMethodURL(method, params) {
        var params2 = [];
        for(i in params) 
            params2.push(i + '=' + params[i]);
        params2.push('method=' + method);
        params2.push('format=json');
        params2.push('api_key=' + apiKey);
        params2.push('nojsoncallback=1');
        var api_sig = getSignature(params2);
        var url = base_url +'?api_sig=' + api_sig;
        for(i in params2)
            url += '&' + params2[i];
        return url;
    }
    
    
    var client = {};
    
    client.getAuthURL = function(perms) {
        var url = 'http://flickr.com/services/auth/?';
        var sig = getSignature(['api_key=' + apiKey,'perms=' + perms]);
        url += 'api_key=' + apiKey + '&perms=' + perms + '&api_sig=' + sig;
        return url;
    }
    
    client.getTokenFromFrob = function(frob, callback) {
        var url = getSignedMethodURL('flickr.auth.getToken', {frob: frob});
        request.get({uri:url}, function(err, resp, body) {
            if(err)
                callback(err);
            else {
                var json = JSON.parse(body);
                callback(null, json.auth);
            }
        });
    }
    
    client.apiCall = function(httpMethod, apiMethod, params, callback) {
        request({method: httpMethod, uri: getSignedMethodURL(apiMethod, params)}, callback);
    }
    
    return client;
}

module.exports = Client;