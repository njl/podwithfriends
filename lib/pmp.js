var PmpSdk = require('pmpsdk');

// initialize PMP sdk, or die trying
console.log('process', process.env.PMP_HOST);
if (!process.env.PMP_HOST) {
  throw 'You must set secrets/PMP_HOST!';
}
if (!process.env.PMP_CLIENT_ID) {
  throw 'You must set secrets/PMP_CLIENT_ID!';
}
if (!process.env.PMP_CLIENT_SECRET) {
  throw 'You must set secrets/PMP_CLIENT_SECRET!';
}

exports.sdk = new PmpSdk({
  host:         process.env.PMP_HOST,
  clientid:     process.env.PMP_CLIENT_ID,
  clientsecret: process.env.PMP_CLIENT_SECRET
});

exports.formatStory = function(story) {
  return {
    title: story.attributes.title
  };
}
