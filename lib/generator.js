const CodeBuilder = require('./utils/code-builder')
const counter = require('./utils/counter')
const visitors = require('./visitors')
const directives = require('./directives')

class Generator {
  constructor(parsed, source) {
    this.parsed = parsed
    this.source = source
    this.builders = {
      inits: [],
      context: new CodeBuilder('', 1),
      ret: new CodeBuilder('', 1)
    }
    this.visitors = visitors
    this.directives = directives
    this.current = this.builders.ret
    this.lasts = []
    this.getUniqueName = counter([])
    this.params = ['props']
    this.imports = []
    this.visit(this.parsed[0])
  }

  getNewInitCodeBuilder() {
    const codeBuilder = new CodeBuilder()
    this.builders.inits.unshift(codeBuilder)
    return codeBuilder
  }

  scan(node) {
    const res = []
    if (node.type === 'tag') {
      const attribs = node.attribs
      for (var key in attribs) {
        if (key.indexOf('wx:') === 0) {
          const match = attribs[key].match(/^\{\{(.+)\}\}$/)
          if (match) {
            res.push({ key: `${key.slice(3)}`, value: match[1] })
          }
        }
      }
    }
    return res
  }

  visit(node) {
    const visitor = this.visitors[node.type]
    const directives = this.directives
    if (!visitor) throw new Error(`Not implemented: ${node.type}`)

    const directiveList = this.scan(node)

    directiveList.forEach(parsed => {
      const directive = directives[parsed.key]
      directive.enter(this, parsed.value)
    })

    if (visitor.enter) visitor.enter(this, node)

    if (node.children) {
        node.children.forEach(child => {
            this.visit(child)
        })
    }

    if (visitor.leave) visitor.leave(this, node)

    directiveList.forEach(parsed => {
      const directive = directives[parsed.key]
      directive.leave(this, parsed.value)
    })
  }

  setCurrent(current) {
    this.lasts.push(this.current)
    this.current = current
  }

  back() {
    if (this.lasts.length > 0) {
      this.current = this.lasts.pop()
    }
  }

  toString(key) {
    if (key === 'init') {
      return this.builders.inits.map((codeBuilder) => codeBuilder.toString()).join('\n')
    } else {
      return this.builders[key].toString()
    }
  }
}

module.exports = Generator