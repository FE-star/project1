const htmlparser = require('htmlparser2')
const Generator = require('./generator')

module.exports = function (string) {
    const parsed = htmlparser.parseDOM(string)
    const g = new Generator(parsed, string)
    console.log('function result(context) {')
    console.log('  with (context) {')
    console.log(`${g.toString('init')}`)
    console.log('    return' + g.toString('ret').slice(3))
    console.log('  }')
    console.log('}')
}