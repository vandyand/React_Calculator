import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)

    this.buttons = [
      ['C', '%', '^', '/'],
      ['7', '8', '9', 'x'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['+/-', '0', '.', '=']
    ];

    this.val1 = ''
    this.val2 = ''
    this.holder = ''
    this.operator = ''
    this.prep = ''
    this.showing = ''
    this.handle = this.handle.bind(this)
    this.lookingForSecondVal = false
    this.operatorEntered = false
  }

  handle = (char) => {
    if (char in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] || char === '.') {
      this.handleNumber(char)
    } else {
      this.handleOperator(char)
    }

    console.log(`val1: ${this.val1}, val2: ${this.val2}, looking: ${this.lookingForSecondVal}, operator: ${this.operator}, operatorEntered: ${this.operatorEntered}, prep: ${this.prep}`)

    this.showing = this.formatOutput(this.prep)

    this.forceUpdate()
  }

  formatOutput = (raw) => {

    let rtnStr = ''

    if (String(raw).indexOf('.') > -1) {
      let vals = String(raw).split('.')
      let ind9s = vals[1].indexOf('9999')
      let ind0s = vals[1].indexOf('0000')

      if (ind9s > -1) {
        if (ind9s === 0) {
          vals[0] = String(Number(vals[0]) + 1)
          vals[1] = ''
        } else {
          vals[1] = String(Number(vals[1].slice(0, ind9s)) + 1)
        }
      }

      if (ind0s > -1) {
        vals[1] = vals[1].slice(0, ind0s)
      }

      rtnStr = vals[1] || !this.lookingForSecondVal ? vals.join('.') : vals[0]
    } else {
      rtnStr = raw
    }

    return rtnStr

  }

  handleNumber = (val) => {
    if (this.prep === '') {
      this.prep = val
    }
    else if (this.operator === '') {
      if (!(val === '.' && this.prep.indexOf('.') > -1)) {
        this.prep = this.prep + val
      }
    }
    else if (this.operator !== '' && this.val1 === '') {
      this.val1 = Number(this.prep)
      this.prep = val
      this.lookingForSecondVal = false
    }
    else if (this.operator !== '' && this.val1 !== '' && !this.lookingForSecondVal) {
      this.prep = this.prep + val
    }
    else if (this.operator !== '' && this.val1 !== '' && this.val2 === '' && this.lookingForSecondVal) {
      this.prep = val
      this.lookingForSecondVal = false
      this.val2 = ''
    }
    else if (this.operator !== '' && this.val1 !== '' && this.val2 !== '' && this.lookingForSecondVal && !this.operatorEntered) {
      this.val1 = ''
      this.val2 = ''
      this.holder = ''
      this.lookingForSecondVal = false
      this.operator = ''
      this.operatorEntered = false
      this.prep = val
      this.showing = ''
    }
  }

  handleOperator = (op) => {
    if (op!=='=' && this.operator !== '' && this.val1 !== '' && this.val2 !== '' && this.lookingForSecondVal) {
      this.operatorEntered = true
    }

    if (op === 'C') {
      this.val1 = ''
      this.val2 = ''
      this.holder = ''
      this.lookingForSecondVal = false
      this.operator = ''
      this.operatorEntered = false
      this.prep = ''
      this.showing = ''
    }
    else if (op === '=') {
      if (this.val2 === '') {
        this.holder = Number(this.prep)
      }
      if (this.operator === '+') {
        this.prep = this.val2 ? this.val2 + Number(this.prep) : this.val1 + Number(this.prep)
      }
      else if (this.operator === '-') {
        this.prep = this.val2 ? Number(this.prep) - this.val2 : Number(this.prep) - this.val1
      }
      else if (this.operator === 'x') {
        this.prep = this.val2 ? this.val2 * Number(this.prep) : this.val1 * Number(this.prep)
      }
      else if (this.operator === '/') {
        this.prep = this.val2 ? Number(this.prep) / this.val2 : Number(this.prep) / this.val1
      }
      else if (this.operator === '^') {
        this.prep = this.val2 ? Math.pow(this.val2, Number(this.prep)) : Math.pow(this.val1, Number(this.prep))
      }
      if (this.val2 === '') {
        this.val2 = this.holder
        this.holder = ''
      }
      this.lookingForSecondVal = true
    }
    else if (op === '%') {
      this.prep = Number(this.prep) / 100
    }
    else if (op === '+/-') {
      this.prep = Number(this.prep) * -1
    }
    else {
      this.val1 = Number(this.prep)
      this.lookingForSecondVal = true
      this.operator = op !== '=' ? op : this.operator
    }
  }

  render() {

    return (
      <div className="App">
        <div className="row">
          <div className='display'>{this.showing}</div>
        </div>

        {this.buttons.map((valList, idx) => {
          return (
            <div key={idx.toString()} className="row">
              {valList.map(val => {
                return (
                  <button key={val} className="button" onClick={() => this.handle(val)}>
                    {val}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

export default App;
