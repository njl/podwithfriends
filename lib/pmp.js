var PmpSdk = require('pmpsdk');

// initialize PMP sdk, or die trying
if (!process.env.PMP_HOST) {
  throw 'You must set secrets/PMP_HOST!';
}
if (!process.env.PMP_CLIENT_ID) {
  throw 'You must set secrets/PMP_CLIENT_ID!';
}
if (!process.env.PMP_CLIENT_SECRET) {
  throw 'You must set secrets/PMP_CLIENT_SECRET!';
}

/**
 * Raw PMP SDK object
 */
exports.sdk = new PmpSdk({
  host:         process.env.PMP_HOST,
  clientid:     process.env.PMP_CLIENT_ID,
  clientsecret: process.env.PMP_CLIENT_SECRET
});

/**
 * Run a query
 *
 * @param text     - the text search query (optional)
 * @param callback - function(err, data)
 */
exports.query = function(text, callback) {
  var params = {
    profile: 'story',
    has:     'audio,image',
    limit:   10,
    text:    text
  };

  // query the pmp
  exports.sdk.queryDocs(params, function(query, resp) {
    async.map(query.items, formatPodcast, function(err, results) {
      callback(err, {total: query.total(), podcasts: results});
    });
  });
}

/**
 * Format PMP documents "nicely" (fetch all the hypermedia)
 *
 */
var formatPodcast = function(doc, callback) {
  callback(null, {
    title: doc.attributes.title,
    teaser: doc.attributes.teaser,
  });
}
