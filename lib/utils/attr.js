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
      if (match) {
        generator.current.addLine(`'${v}': ${match[1]},`)
      } else {
        generator.current.addLine(`'${v}': '${attrs[v]}',`)
      }
    })
  generator.current.indent--
  generator.current.addLine(`}`)
}