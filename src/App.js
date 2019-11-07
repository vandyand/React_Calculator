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

    this.staging_operation = {
      "operator": '',
      "number": ''
    }

    this.current_number = ''
    this.State = 0
    this.display = '\u00a0'
  }

  keyboardPressed = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault()
      this.keyPressed('=')
    } else if(event.key === 'c'){
      this.keyPressed('C')
    } else if(event.key === '*'){
      this.keyPressed('x')
    } else if('1234567890+-x/^%.='.split('').includes(event.key)){
      this.keyPressed(event.key)
    }
  }

  keyPressed = (key) => {
    let transitioned = this.stateTransitions(key)
    this.display = this.outputUpdate(key, transitioned)
    this.forceUpdate()
  }

  stateTransitions = (key) => {
    let keyIsNumber = '1234567890.'.split('').includes(key)
    let keyIsOperator = '+-x/^'.split('').includes(key)
    let keyIsSpecialOperator = key === '+/-' || key === '%'
    let keyIsEquals = key === '='
    let keyIsClear = key === 'C'
    let tempState = this.State

    if (keyIsClear) {
      this.State = 0
    }
    else if (this.State === 0 && keyIsNumber) {
      this.State = 1
    }
    else if (this.State === 1 && keyIsOperator) {
      this.State = 2
    }
    else if (this.State === 1 && keyIsSpecialOperator) {
      this.State = 5
    }
    else if (this.State === 2 && keyIsNumber) {
      this.State = 3
    }
    else if (this.State === 3 && keyIsOperator) {
      this.State = 4
    }
    else if (this.State === 3 && keyIsEquals) {
      this.State = 5
    }
    else if (this.State === 4 && keyIsNumber) {
      this.State = 3
    }
    else if (this.State === 5 && keyIsEquals) {
      this.State = 5
    }
    else if (this.State === 5 && keyIsNumber) {
      this.State = 1
    }
    else if (this.State === 5 && keyIsOperator) {
      this.State = 2
    }

    return tempState !== this.State
  }

  outputUpdate = (key, transitioned) => {
    let keyIsNumber = '1234567890.'.split('').includes(key)
    let keyIsOperator = '+-x/^'.split('').includes(key)
    let keyIsSpecialOperator = key === '+/-' || key === '%'
    let keyIsEquals = key === '='

    if (this.State === 0) {
      this.display = '\u00a0'
    }
    if (this.State === 1 && keyIsNumber) {
      let doublePeriod = key === '.' && this.current_number.includes('.')
      this.current_number = transitioned ? key : doublePeriod ? this.current_number : this.current_number + key
      this.display = this.current_number
    }
    if (this.State === 2 && keyIsOperator) {
      this.staging_operation.operator = key
    }
    if (this.State === 3 && keyIsNumber) {
      let doublePeriod = key === '.' && this.staging_operation.number.includes('.')
      this.staging_operation.number = transitioned ? key : doublePeriod ? this.staging_operation.number : this.staging_operation.number + key
      this.display = this.staging_operation.number
    }
    if (this.State === 4 && keyIsOperator && transitioned) {
      this.current_number = this.calculate(this.staging_operation, this.current_number)
      this.display = this.current_number
      this.staging_operation.operator = key
    }
    if (this.State === 5 && (keyIsEquals || keyIsSpecialOperator)) {
      if (keyIsSpecialOperator) {
        if (key === '+/-') {
          this.staging_operation.number = '-1'
          this.staging_operation.operator = 'x'
        }
        else if (key === '%') {
          this.staging_operation.number = '100'
          this.staging_operation.operator = '/'
        }
      }
      this.current_number = this.calculate(this.staging_operation, this.current_number)
      this.display = this.current_number
    }
    return this.display
  }


  calculate = (operation, current) => {
    if (operation.operator === '+') {
      return String(Number(current) + Number(operation.number))
    }
    else if (operation.operator === '-') {
      return String(Number(current) - Number(operation.number))
    }
    else if (operation.operator === 'x') {
      return String(Number(current) * Number(operation.number))
    }
    else if (operation.operator === '/') {
      return String(Number(current) / Number(operation.number))
    }
    else if (operation.operator === '^') {
      return String(Math.pow(Number(current), Number(operation.number)))
    }
  }


  // formatOutput = (raw) => {

  //   let rtnStr = ''

  //   if (String(raw).indexOf('.') > -1) {
  //     let vals = String(raw).split('.')
  //     let ind9s = vals[1].indexOf('999999999999')
  //     let ind0s = vals[1].indexOf('000000000000')

  //     if (ind9s > -1) {
  //       if (ind9s === 0) {
  //         vals[0] = String(Number(vals[0]) + 1)
  //         vals[1] = ''
  //       } else {
  //         vals[1] = String(Number(vals[1].slice(0, ind9s)) + 1)
  //       }
  //     }

  //     if (ind0s > -1) {
  //       vals[1] = vals[1].slice(0, ind0s)
  //     }

  //     rtnStr = vals[1] || !this.lookingForSecondVal ? vals.join('.') : vals[0]
  //   } else {
  //     rtnStr = raw
  //   }

  //   return rtnStr

  // }

  render() {
    console.log(`current number: ${this.current_number}, st_op.op: ${this.staging_operation.operator}, st_op.num: ${this.staging_operation.number}, state: ${this.State}, display: ${this.display}`)

    return (
      <div className="App">
        {/* {() => this.ComponentA} */}
        
      {/* <KeyboardEventHandler
        handleKeys={['1', '2', '3', '4','5','6','7','8','9','0','C','+','-','x','/','^','%','=','']}
        onKeyEvent={(key) => this.keyPressed(key)} /> */}

        <div className="row">
          <div className='display'>{this.display}</div>
        </div>

        {this.buttons.map((valList, idx) => {
          return (
            <div key={idx.toString()} className="row">
              {valList.map(val => {
                return (
                  <button autoFocus key={val} className="button" onClick={() => this.keyPressed(val)} onKeyPress={(e) => this.keyboardPressed(e)}>
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
