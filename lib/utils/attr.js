const DEFAULT_TPL = function (r) { return `${r}` }

const first2UpperCase = (value) => {
  return value.replace(/^(\w)/, (m) => {
    return m.toUpperCase()
  })
}

module.exports = function attributes(generator, node) {
  generator.current.addLine(`{`)
  generator.current.indent++
  const attrs = node.attribs
  Object.keys(attrs)
    .filter(v => v.indexOf('wx:'))
    .forEach(v => {
      const match = attrs[v].match(/^\{\{(.+)\}\}$/)
      let name = v
      // fixed v
      if (v.indexOf('-') > -1) {
        name = v.split('-')
          .map((word, i) => {
            if (i > 0) return first2UpperCase(word)
            return word
          }).join('')
      }
      if (match) {
        generator.current.addLine(`'${name}': ${match[1]},`)
      } else {
        generator.current.addLine(`'${name}': '${attrs[v]}',`)
      }
    })
  generator.current.indent--
  generator.current.addLine(`}`)
  if (generator.current.removeEmptyObj()) {
    generator.current.addLine(`null`)
  }
}