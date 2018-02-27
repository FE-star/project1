let ifExp

module.exports = {
  'if': {
    enter: function (generator, value) {
      const name = generator.getUniqueName('ifBlock')
      generator.current.addLine(`${name}(),`)
      generator.setCurrent(generator.getNewInitCodeBuilder())
      generator.current.addLine(`function ${name} {`)
      generator.current.indent++
      generator.current.addLine(`if (${value}) {`)
      generator.current.indent++
      generator.current.addLine('return ')
    },
    leave: function (generator) {
      generator.current.indent--
      generator.current.addLine(`}`)
      generator.current.indent--
      generator.current.addLine(`}`)
      generator.back()
    }
  }
}