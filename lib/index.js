const htmlparser = require('htmlparser2')
const Generator = require('./generator')

module.exports = function (string) {
    const parsed = htmlparser.parseDOM(string)
    const g = new Generator(parsed, string)
    console.log(g.toString('init'))
    console.log('function result() {')
    console.log('  return ' + g.toString('ret'))
    console.log('}')
}