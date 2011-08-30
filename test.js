var Flickr = require('./flickr');
var client = new Flickr(process.argv[2], process.argv[3]);

console.error('open \n' + client.getAuthURL('read') + '\nand then run node test-frob.js <key> <secret> <frob>');