const b01_calcLabel = document.querySelector('#b01js_label');
const b01_calcOutput = document.querySelector('#b01js_output');

const b01_calcBtn1 = document.querySelector('#b01js_1');
const b01_calcBtn2 = document.querySelector('#b01js_2');
const b01_calcBtn3 = document.querySelector('#b01js_3');
const b01_calcBtn4 = document.querySelector('#b01js_4');
const b01_calcBtn5 = document.querySelector('#b01js_5');
const b01_calcBtn6 = document.querySelector('#b01js_6');
const b01_calcBtn7 = document.querySelector('#b01js_7');
const b01_calcBtn8 = document.querySelector('#b01js_8');
const b01_calcBtn9 = document.querySelector('#b01js_9');
const b01_calcBtn0 = document.querySelector('#b01js_0');
const b01_calcBtnDecimalPoint = document.querySelector('#b01js_DecimalPoint');
const b01_calcBtnAdd = document.querySelector('#b01js_Add');
const b01_calcBtnSubtract = document.querySelector('#b01js_Subtract');
const b01_calcBtnMultiply = document.querySelector('#b01js_Multiply');
const b01_calcBtnDevide = document.querySelector('#b01js_Divide');
const b01_calcBtnEqual = document.querySelector('#b01js_Equal');

const b01_calcBtnAllClear = document.querySelector('#b01js_AllClear');
const b01_calcBtnBackSpace = document.querySelector('#b01js_BackSpace');
const b01_calcBtnClose = document.querySelector('.js_btnCloseDialog');

function getDecimalPosition(value){
  const strVal = String(value);
  if(strVal.indexOf('.') !== -1){
    return ((strVal.length - 1) - strVal.indexOf('.'));
  }
  return 0;
}

function splitExpression(expression) {
  let operatorIndex = 1;

  for (let i = 1; i < expression.length; i++) {
      if (isOperator(expression[i])) {
          operatorIndex = i;
          break;
      }
  }

  const operandLeft = expression.substring(0, operatorIndex);
  const operator = expression[operatorIndex];
  const operandRight = expression.substring(operatorIndex + 1);

  return [operandLeft, operator, operandRight];
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

const MAX_DIGITS = 12;

function getCurrentOperandDigitCount(expression) {
  let operatorIndex = -1;
  for (let i = 1; i < expression.length; i++) {
    if (isOperator(expression[i])) {
      operatorIndex = i;
    }
  }
  const operand = operatorIndex === -1 ? expression : expression.substring(operatorIndex + 1);
  return (operand.match(/[0-9]/g) || []).length;
}

const multiplication = (x, y) => {
  const z = 10 ** (getDecimalPosition(x) + getDecimalPosition(y));
  x = (x + '').replace('.', '');
  y = (y + '').replace('.', '');
  return (x * y) / z;
};

const addition = (x, y) => {
  const z = 10 ** Math.max(getDecimalPosition(x), getDecimalPosition(y));
  return (multiplication(x, z) + multiplication(y, z)) / z;
};

const subtract = (x, y) => {
  const z = 10 ** Math.max(getDecimalPosition(x), getDecimalPosition(y));
  return (multiplication(x, z) - multiplication(y, z)) / z;
};

const division = (x, y) => {
  const z = 10 ** Math.max(getDecimalPosition(x), getDecimalPosition(y));
  return multiplication(x, z) / multiplication(y, z);
}

const CALC_STATE = Object.freeze({
  Start: 0,
  NegativeNum1: 1,
  OperandZero1: 2,
  OperandInteger1: 3,
  OperandDecimal1: 4,
  Operator: 5,
  NegativeNum2: 6,
  OperandZero2: 7,
  OperandInteger2: 8,
  OperandDecimal2: 9,
  Result: 10,
  Error: 11,
});

const VALID_INPUTS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '.', '+', '-', '*', '/', '='
];

const INVALID_INPUTS_BY_STATE = Object.freeze({
  0:  ['+', '*', '/', '='],
  1:  ['+', '-', '*', '/', '='],
  2:  ['0', '='],
  3:  ['='],
  4:  ['.', '='],
  5:  ['+', '*', '/', '='],
  6:  ['+', '-', '*', '/', '='],
  7:  ['0'],
  8:  [],
  9:  ['.'],
  10: ['='],
  11: ['+', '*', '/', '=']
})

class Calculator {
  constructor() {
    this._expression = '';
    this._state = CALC_STATE.Start;
  }

  get expression(){
    return this._expression;
  }

  pushExpression(input) {
    if ((!VALID_INPUTS.includes(input)) || (INVALID_INPUTS_BY_STATE[this._state].includes(input))) {
      return false;
    }
    if (/[0-9]/.test(input) && getCurrentOperandDigitCount(this._expression) >= MAX_DIGITS) {
      return false;
    }
    switch (this._state){
      case CALC_STATE.Error:
        switch (input){
          case '0':
            this._expression = input;
            this._state = CALC_STATE.OperandZero1;
            break;
          case '-':
            this._expression = input;
            this._state = CALC_STATE.NegativeNum1;
            break;
          case '.':
            this._expression = '0';
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal1;
            break;
          default:
            this._expression = input;
            this._state = CALC_STATE.OperandInteger1;
        }
        break;
      case CALC_STATE.Start:
        switch (input){
          case '0':
            this._expression += input;
            this._state = CALC_STATE.OperandZero1;
            break;
          case '-':
            this._expression += input;
            this._state = CALC_STATE.NegativeNum1;
            break;
          case '.':
            this._expression += '0';
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal1;
            break;
          default:
            this._expression += input;
            this._state = CALC_STATE.OperandInteger1;
        }
        break;
      case CALC_STATE.NegativeNum1:
        switch (input){
          case '0':
            this._expression += input;
            this._state = CALC_STATE.OperandZero1;
            break;
          case '.':
            this._expression += '0';
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal1;
            break;
          default:
            this._expression += input;
            this._state = CALC_STATE.OperandInteger1;
        }
        break;
      case CALC_STATE.OperandZero1:
        switch (input){
          case '.':
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal1;
            break;
          case '+':
          case '-':
          case '*':
          case '/':
            this._expression += input;
            this._state = CALC_STATE.Operator;
            break;
          default:
            this._expression = this._expression.slice(0, -1);
            this._expression += input;
            this._state = CALC_STATE.OperandInteger1;
        }
        break;
      case CALC_STATE.OperandInteger1:
        switch (input){
          case '.':
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal1;
            break;
          case '+':
          case '-':
          case '*':
          case '/':
            this._expression += input;
            this._state = CALC_STATE.Operator;
            break;
          default:
            this._expression += input;
        }
        break;
      case CALC_STATE.OperandDecimal1:
        switch (input){
          case '+':
          case '-':
          case '*':
          case '/':
            this._expression += input;
            this._state = CALC_STATE.Operator;
            break;
          default:
            this._expression += input;
        }
        break;
      case CALC_STATE.Operator:
        switch (input){
          case '0':
            this._expression += input;
            this._state = CALC_STATE.OperandZero2;
            break;
          case '.':
            this._expression += '0';
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal2;
            break;
          case '-':
            this._expression += input;
            this._state = CALC_STATE.NegativeNum2;
            break;
          default:
            this._expression += input;
            this._state = CALC_STATE.OperandInteger2;
        }
        break;
      case CALC_STATE.NegativeNum2:
        switch (input){
          case '0':
            this._expression += input;
            this._state = CALC_STATE.OperandZero2;
            break;
          case '.':
            this._expression += '0';
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal2;
            break;
          default:
            this._expression += input;
            this._state = CALC_STATE.OperandInteger2;
        }
        break;
      case CALC_STATE.OperandZero2:
        switch (input){
          case '.':
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal2;
            break;
          case '=':
            this._expression = String(this.calculate());
            if(isFinite(this._expression)){
              this._state = CALC_STATE.Result;
            } else {
              this._state = CALC_STATE.Error;
            }
            break;
          case '+':
          case '-':
          case '*':
          case '/':
            this._expression = String(this.calculate());
            if(isFinite(this._expression)){
              this._expression += input;
              this._state = CALC_STATE.Operator;
            } else {
              this._state = CALC_STATE.Error;
            }
            break;
          default:
            this._expression = this._expression.slice(0, -1);
            this._expression += input;
            this._state = CALC_STATE.OperandInteger2;
        }
        break;
      case CALC_STATE.OperandInteger2:
        switch (input){
          case '.':
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal2;
            break;
          case '=':
            this._expression = String(this.calculate());
            if(isFinite(this._expression)){
              this._state = CALC_STATE.Result;
            } else {
              this._state = CALC_STATE.Error;
            }
            break;
          case '+':
          case '-':
          case '*':
          case '/':
            this._expression = String(this.calculate());
            if(isFinite(this._expression)){
              this._expression += input;
              this._state = CALC_STATE.Operator;
            } else {
              this._state = CALC_STATE.Error;
            }
            break;
          default:
            this._expression += input;
        }
        break;
      case CALC_STATE.OperandDecimal2:
        switch (input){
          case '=':
            this._expression = String(this.calculate());
            if(isFinite(this._expression)){
              this._state = CALC_STATE.Result;
            } else {
              this._state = CALC_STATE.Error;
            }
            break;
          case '+':
          case '-':
          case '*':
          case '/':
            this._expression = String(this.calculate());
            if(isFinite(this._expression)){
              this._expression += input;
              this._state = CALC_STATE.Operator;
            } else {
              this._state = CALC_STATE.Error;
            }
            break;
          default:
            this._expression += input;
        }
        break;
      case CALC_STATE.Result:
        switch (input){
          case '+':
          case '-':
          case '*':
          case '/':
            this._expression += input;
            this._state = CALC_STATE.Operator;
            break;
          case '.':
            this._expression = '0';
            this._expression += input;
            this._state = CALC_STATE.OperandDecimal1;
            break;
          case '0':
            this._expression = input;
            this._state = CALC_STATE.OperandZero1;
            break;
          default:
            this._expression = input;
            this._state = CALC_STATE.OperandInteger1;
        }
        break;
      default:
        return false;
    }
    return true;
  }

  calculate() {
    let [strOpeLeft, operator, strOpeRight] = splitExpression(this._expression);
    let calcResult = 0;
    switch(operator){
      case '+':
        try {
          calcResult = addition(strOpeLeft, strOpeRight)
        } catch (error) {
          calcResult = NaN;
        }
        break;
      case '-':
        try {
          calcResult = subtract(strOpeLeft, strOpeRight);
        } catch (error) {
          calcResult = NaN;
        }
        break;
      case '*':
        try {
          calcResult = multiplication(strOpeLeft, strOpeRight);
        } catch (error) {
          calcResult = NaN;
        }
        break;
      case '/':
        try {
          calcResult = division(strOpeLeft, strOpeRight);
        } catch (error) {
          calcResult = NaN;
        }
        break;
      default:
        calcResult = NaN;
    }
    return calcResult;
  }

  reset(){
    this._state = CALC_STATE.Start;
    this._expression = '';
  }

  back(){
    if(
      (this._state == CALC_STATE.Result) ||
      (this._state == CALC_STATE.Error) ||
      (this._expression.length === 0)
    ){
      return false;
    }
    const expr = this._expression.slice(0, -1);
    this.reset();
    if(expr.length >= 1){
      for (var i = 0; i < expr.length; i++) {
        this.pushExpression(expr[i]);
      }
    }
    return true;
  }
}

class htmlCalculator extends Calculator{
  constructor(btns){
    super();
    this._label = '';
    this._btn = {};
    this._btn['0'] = btns['0'] || null;
    this._btn['1'] = btns['1'] || null;
    this._btn['2'] = btns['2'] || null;
    this._btn['3'] = btns['3'] || null;
    this._btn['4'] = btns['4'] || null;
    this._btn['5'] = btns['5'] || null;
    this._btn['6'] = btns['6'] || null;
    this._btn['7'] = btns['7'] || null;
    this._btn['8'] = btns['8'] || null;
    this._btn['9'] = btns['9'] || null;
    this._btn['.'] = btns['.'] || null;
    this._btn['+'] = btns['+'] || null;
    this._btn['-'] = btns['-'] || null;
    this._btn['*'] = btns['*'] || null;
    this._btn['/'] = btns['/'] || null;
    this._btn['='] = btns['='] || null;
  }

  get label(){
    return this._label;
  }

  pushExpression(input){
    switch (this._state){
      case CALC_STATE.OperandZero2:
      case CALC_STATE.OperandInteger2:
      case CALC_STATE.OperandDecimal2:
        if((isOperator(input)) || (input == '=')){
          this._label = this.expression;
        }
        break;
      case CALC_STATE.Result:
      case CALC_STATE.Error:
        if((!isOperator(input)) && (input != '=')){
          this._label = '';
        }
        break;
    }
    const result = super.pushExpression(input);
    this.refreshButtons();
    return result;
  }

  reset(){
    this._label = '';
    super.reset();
    this.refreshButtons();
  }

  back(){
    const buf = this._label;
    const result = super.back();
    this._label = buf;
    return result;
  }

  refreshButtons(){
    const invalidNames = INVALID_INPUTS_BY_STATE[this._state];
    for(const name of VALID_INPUTS){
      this._btn[name].disabled = invalidNames.includes(name);
    }
  }
}

const buttons = {
  '0': b01_calcBtn0,
  '1': b01_calcBtn1,
  '2': b01_calcBtn2,
  '3': b01_calcBtn3,
  '4': b01_calcBtn4,
  '5': b01_calcBtn5,
  '6': b01_calcBtn6,
  '7': b01_calcBtn7,
  '8': b01_calcBtn8,
  '9': b01_calcBtn9,
  '.': b01_calcBtnDecimalPoint,
  '+': b01_calcBtnAdd,
  '-': b01_calcBtnSubtract,
  '*': b01_calcBtnMultiply,
  '/': b01_calcBtnDevide,
  '=': b01_calcBtnEqual,
}

const calculator = new htmlCalculator(buttons);
calculator.reset();

const b01_calcBtns = [
  b01_calcBtn1, b01_calcBtn2, b01_calcBtn3, b01_calcBtn4, b01_calcBtn5,
  b01_calcBtn6, b01_calcBtn7, b01_calcBtn8, b01_calcBtn9, b01_calcBtn0,
  b01_calcBtnDecimalPoint, b01_calcBtnAdd, b01_calcBtnSubtract,
  b01_calcBtnMultiply, b01_calcBtnDevide, b01_calcBtnEqual,
];

function fitOutputText(el) {
  el.style.fontSize = '';
  const baseSize = parseFloat(getComputedStyle(el).fontSize);
  let size = baseSize;
  while (el.scrollWidth > el.clientWidth && size > 10) {
    size -= 1;
    el.style.fontSize = size + 'px';
  }
}

function formatExpression(expr) {
  if (!expr) return '';
  let result = '';
  let currentNum = '';
  const exprStr = String(expr);
  for (let i = 0; i < exprStr.length; i++) {
    const char = exprStr[i];
    if (/[0-9.]/.test(char)) {
      currentNum += char;
    } else {
      if (currentNum) {
        result += formatNumberString(currentNum);
        currentNum = '';
      }
      result += char;
    }
  }
  if (currentNum) {
    result += formatNumberString(currentNum);
  }
  return result;
}

function formatNumberString(numStr) {
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function updateDisplay() {
  b01_calcOutput.textContent = formatExpression(calculator.expression) || '0';
  b01_calcLabel.textContent = formatExpression(calculator.label);
  fitOutputText(b01_calcOutput);
}

for (const btn of b01_calcBtns){
  btn.addEventListener('click', (e) => {
    if(calculator.pushExpression(e.target.getAttribute('data-calc')) === true) {
      updateDisplay();
    }
  })
}

b01_calcBtnAllClear.addEventListener('click', () => {
  calculator.reset();
  updateDisplay();
})

b01_calcBtnBackSpace.addEventListener('click', () => {
  if(calculator.back() == true){
    updateDisplay();
  }
});

b01_calcBtnClose.addEventListener('click', () => {
  if (confirm('計算機を閉じますか？')) {
    window.close();
  }
});

const b01_calcBtnCopy = document.querySelector('#b01js_Copy');
b01_calcBtnCopy.addEventListener('click', () => {
  navigator.clipboard
  .writeText(calculator.expression)
  .then()
  .catch(e => {
    console.error(e);
  });
});

updateDisplay();
