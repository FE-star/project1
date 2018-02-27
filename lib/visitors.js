const attr = require('./utils/attr')
const nodeMap = {
  view: 'div',
  button: 'button',
  block: 'div',
  image: 'img',
  text: 'p'
}
const customNodeMap = {

}

module.exports = {
  tag: {
    enter: function (generator, node) {
      // fall back to div
      let tagName = `'div'`
      if (nodeMap[node.name]) {
        tagName = `'${nodeMap[node.name]}'`
      } else if (customNodeMap[node.name]) {
        const init = generator.getNewInitCodeBuilder() 
        tagName = this.getUniqueName(node.name)
        init.addLine(`const ${tagName} = require('${customNodeMap[node.name]}')`)
      }
      generator.current.addLine(`React.createElement(`)
      generator.current.indent++
      generator.current.addLine(`${tagName.trim()},`)
      attr(generator, node)
      generator.current.addCode(`,`)
    },
    leave: function (generator, node) {
      generator.current.trimLast(',')
      generator.current.indent--
      generator.current.addLine(`)`)
    }
  },
  text: {
    enter: function (generator, node) {
      const trim = node.data.trim()
      if (trim) {
        const match = node.data.match(/^\{\{(.+)\}\}$/)
        if (match) {
          generator.current.addLine(`${match[1]},`)
        } else {
          generator.current.addLine(`'${trim}',`)
        }
      }
    },
    leave: function (generator, node) {

    }
  }
}