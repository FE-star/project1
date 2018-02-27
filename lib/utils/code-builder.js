/**
 * inspired from https://github.com/sveltejs/svelte/blob/master/src/utils/CodeBuilder.ts
 */
const LINE = {}
const BLOCK = {}
const indentString = require('indent-string')

class CodeBuilder {
  constructor(result = '', indent = 0) {
    this.result = result
    this.first = null
    this.last = null
    this.indent = indent
    this.level = 0
    if (this.result !== '') this.last = LINE
  }

  addCode(code) {
    this.result += code
  }

  addLine(line) {
    if (this.last === BLOCK) {
      this.result += `\n\n${indentString(line, 2 * this.indent, ' ')}`
    } else if (this.last === LINE) {
      this.result += `\n${indentString(line, 2 * this.indent, ' ')}`
    } else {
      this.result += indentString(line, 2 * this.indent, ' ')
    }

    this.last = LINE;
    if (!this.first) this.first = LINE
  }

  addLineAtStart(line) {
    if (this.first === BLOCK) {
      this.result = `${line}\n\n${this.result}`
    } else if (this.first === LINE) {
      this.result = `${line}\n${this.result}`
    } else {
      this.result += line
    }

    this.first = LINE;
    if (!this.last) this.last = LINE
  }

  addBlock(block) {
    if (this.result) {
      this.result += `\n\n${indentString(block, 2 * this.indent, ' ')}`
    } else {
      this.result += indentString(block, 2 * this.indent, ' ')
    }

    this.last = BLOCK
    if (!this.first) this.first = BLOCK
  }

  addBlockAtStart(block) {
    if (this.result) {
      this.result = `${indentString(block, 2 * this.indent, ' ')}\n\n${this.result}`
    } else {
      this.result += indentString(block, 2 * this.indent, ' ')
    }

    this.first = BLOCK;
    if (!this.last) this.last = BLOCK
  }

  trimLast(char) {
    if (this.result[this.result.length - 1] === char) {
      this.result = this.result.substring(0, this.result.length - 1)
    }
  }

  removeEmptyObj() {
    if (/\s+\{(\s+)\}$/.test(this.result)) {
      this.result = this.result.replace(/\s+\{(\s+)\}$/, '')
      return true
    }
    return false
  }

  isEmpty() {
    return this.result === ''
  }

  toString() {
    return this.result
      // fix return
      .replace(/\breturn \n +/g, 'return ')
  }
}

module.exports = CodeBuilder