var Flickr = require('./flickr');
var client = new Flickr(process.argv[2], process.argv[3]);

client.getTokenFromFrob(process.argv[4], function(err, resp) {
    console.error('DEBUG: resp', resp);
    client.apiCall('GET', 'flickr.people.getPhotos', {auth_token:resp.token._content, user_id:resp.user.nsid}, 
    function(err, resp2, body) {
        console.error('DEBUG: err', err);
        console.error('DEBUG: body', body);
    })
});