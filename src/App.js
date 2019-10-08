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
    this.lookingForSecondVal = false
    this.operator = ''
    this.showing = ''
    this.handle = this.handle.bind(this)
  }

  handle = (char) => {
    if(char in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] || char === '.'){
      this.handleNumber(char)
    } else {
      this.handleOperator(char)
    }

    console.log(`val1: ${this.val1}, looking: ${this.lookingForSecondVal}, operator: ${this.operator}, showing: ${this.showing}`)

    this.forceUpdate()
  }

  handleNumber = (val) => {
    if(this.showing === ''){
      this.showing = val
    }
    else if(this.operator === ''){
      if(!(val === '.' && this.showing.indexOf('.') > -1)){
        this.showing = this.showing + val
      }
    }
    else if(this.operator !== '' && this.val1 === ''){
      this.val1 = Number(this.showing)
      this.showing = val
      this.lookingForSecondVal = false
    }
    else if(this.operator !== '' && this.val1 !== '' && !this.lookingForSecondVal){
      this.showing = this.showing + val
    }
    else if(this.operator !== '' && this.val1 !== '' && this.lookingForSecondVal){
      this.showing = val
      this.lookingForSecondVal = false
    }
  }

  handleOperator = (op) => {
    if(op === 'C'){
      this.val1 = ''
      this.lookingForSecondVal = false
      this.operator = ''
      this.showing = ''
    }
    else if(op === '='){
      if(this.operator === '+'){
        this.showing = this.val1 + Number(this.showing)
      }
      else if(this.operator === '-'){
        this.showing = this.val1 - Number(this.showing)
      }
      else if(this.operator === 'x'){
        this.showing = this.val1 * Number(this.showing)
      }
      else if(this.operator === '/'){
        this.showing = this.val1 / Number(this.showing)
      }
      else if(this.operator === '^'){
        this.showing = Math.pow(this.val1,  Number(this.showing))
      }
      this.lookingForSecondVal = true
    }
    else if(op === '%'){
      this.showing = Number(this.showing) / 100
    }
    else if(op === '+/-'){
      this.showing = Number(this.showing) * -1
    }
    else {
      this.val1 = Number(this.showing)
      this.operator = op
      this.lookingForSecondVal = true
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
