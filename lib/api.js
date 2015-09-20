//
// podcast api interface switcher
//
if (process.env.USE_AUDIOSEARCH) {
  exports = module.exports = require('./audiosearch');
}
else {
  exports = module.exports = require('./pmp');
}
