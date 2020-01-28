const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withFonts = require('next-fonts');

module.exports = withCSS(withSass(withFonts({
  // Need to get non-local imports working
  // cssModules: true,
  target: 'serverless'
})));
