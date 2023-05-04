// -------------------------DOM---------------------------- //
const box = document.querySelector('.calc');
const result = document.querySelector('.result');
const display = document.querySelector('.display-calc');
const operations1 = document.querySelectorAll('.operation1');
const operations2 = document.querySelectorAll('.operation2');
const numbers = document.querySelectorAll('.number');
// -----------------------기본 세팅------------------------ //
let expression = [];
let currentNumber = '0';
let dotUsed = false;
let operator = null;
// 현재 폰트 사이즈와 원래 폰트 사이즈 저장
let currentFontSize = parseFloat(window.getComputedStyle(result).fontSize);
const originalFontSize = currentFontSize;
// -------------------------------------------------------- //

operations1.forEach((button) => {
  button.addEventListener('click', () => {
    const buttonText = button.textContent;
    if (result.textContent === '0') {
      // result가 0인 경우, 모든 버튼 클릭 이벤트를 막음
      return;
    } else {
      if (result.textContent === '0' && buttonText !== 'AC') {
        // result가 0인 경우, AC 버튼이 아닌 다른 버튼 클릭 이벤트를 막음
        return;
      } else if (buttonText === 'AC') {
        // 'AC' 버튼을 클릭한 경우
        resetStyle();
        currentNumber = '0';
        expression = [];
        operator = null;
        dotUsed = false;
        result.textContent = '0';
        display.textContent = '';
        // 폰트 크기를 원래대로 복원
        result.style.fontSize = originalFontSize + 'px';
        currentFontSize = originalFontSize;
      } // '&#177' 버튼을 클릭한 경우의 계산 수행
      else if (buttonText === '±') {
        currentNumber = currentNumber * -1;
        display.textContent = currentNumber;
      } else if (buttonText === '%') {
        currentNumber = currentNumber * 0.01;
        display.textContent = currentNumber;
      }
      result.textContent = currentNumber;
      resizeFont();
    }
  });
});
// ----------------- 숫자 버튼 --------------------- //
numbers.forEach((number) => {
  number.addEventListener('click', () => {
    const numberText = number.textContent;
    resetStyle();

    // '.' 중복 막기(처음, 연산자 입력 후)
    // 입력시 dotUsed true 설정하기
    if (numberText === '.') {
      if (dotUsed) {
        return;
      } else if (!dotUsed) {
        dotUsed = true;
        if (currentNumber === '0') {
          display.textContent += currentNumber;
        }
        currentNumber += numberText;
      }
      display.textContent += numberText;
    } // 0 중복 막기(처음, 연산자 입력 후)
    else if (numberText === '0') {
      if (currentNumber === '0') {
        currentNumber = '0';
      } else if (currentNumber !== '0') {
        currentNumber += numberText;
      }
      display.textContent += numberText;
    } // 그외 숫자(1~9)
    else {
      if (currentNumber === '0' && !dotUsed) {
        currentNumber = numberText;
      } else {
        currentNumber += numberText;
      }
      display.textContent += numberText;
    }

    // --할당하기-- //
    // result - 실수일 때 정수일 때 다르게 출력
    result.textContent = dotUsed ? currentNumber : new Intl.NumberFormat().format(currentNumber);

    // 결과창에도 할당
    resizeFont();
  });
});

// ------------------------------------------------------- //

// ----------------------사칙 연산------------------------ //
operations2.forEach((operation) => {
  operation.addEventListener('click', () => {
    const operationText = operation.textContent;
    if (result.textContent === '0' || operationText === '=') {
      // result가 0인 경우, 모든 버튼 클릭 이벤트를 막음
      return;
    } else {
      dotUsed = false; // 소수점 사용 여부 초기화
      if (operator === null) {
        // 현재 연산자가 처음 눌린 경우, expression에 값 추가하기
        if (expression.length === 0) {
          expression.push(currentNumber);
        }
        currentNumber = '0';
        operator = operationText;
        display.textContent += `${operationText}`;
      } else if (operator !== null && expression.length !== 0 && currentNumber !== '0') {
        //currentNumber 가 0이 아닐 때
        // 배열 안에 이미 값이 들어 있을 때
        // 이전 연산자와 함께 계산 수행
        expression.push(currentNumber, operator);
        const calculation = calculate(expression);
        expression = [calculation];
        currentNumber = '0';
        display.textContent = `${calculation}${operationText}`;
        result.textContent = calculation;
        operator = operationText;
      } else {
        // 현재 입력된 연산자를 바로 할당
        operator = operationText;
        display.textContent = display.textContent.slice(0, -1) + `${operationText}`;
      }
      resizeFont();
    }
  });
});

// -----------------------등호(=) 버튼------------------------ //
const equal = document.querySelector('.equal');
equal.addEventListener('click', () => {
  if (operator === null) {
    expression[0] = currentNumber;
    result.textContent = expression[0];
  } else {
    expression.push(currentNumber, operator);
    const calculation = calculate(expression);
    result.textContent = calculation;
    display.textContent = calculation;
  }

  operator = null;

  resizeFont();
});

// ----------------------계산 함수-------------------------- //
function operate(num1, num2, operator) {
  switch (operator) {
    case '+':
      return '+';
    case '-':
      return '-';
    case '×':
      return '*';
    case '÷':
      return '/';
    default:
      return null;
  }
}

function calculate(arr) {
  let operator = arr.pop();
  let b = arr.pop();
  let a = arr.pop();
  const operate = {
    '+': '+',
    '-': '-',
    '×': '*',
    '÷': '/',
  };
  let calculation = new Function(`return ${parseFloat(a)} ${operate[operator]} ${parseFloat(b)}`)();

  return calculation;
}

// -------------------폰트 크기 조절 함수------------------- //

function resizeFont() {
  // 폰트 사이즈 동적 조절 함수
  const boxWidth = box.clientWidth - 60;
  const resultWidth = result.clientWidth;
  if (resultWidth > boxWidth) {
    const fontSize = parseFloat(window.getComputedStyle(result).fontSize);
    result.style.fontSize = (fontSize * boxWidth) / resultWidth + 'px';
  }
}

// --------------------버튼 클릭 스타일 변경 함수----------------------- //
let prevBtn = null;
function resetStyle() {
  operations2.forEach((operation) => {
    operation.classList.remove('btn-style2-clicked');
    operation.classList.add('btn-style2');
  });
}
operations2.forEach((operation) => {
  operation.addEventListener('click', function () {
    if (this.textContent === '=') {
      prevBtn = null;
      resetStyle();
    } else if (prevBtn === null) {
      prevBtn = this;
      this.classList.remove('btn-style2');
      this.classList.add('btn-style2-clicked');
    } else {
      prevBtn.classList.remove('btn-style2-clicked');
      prevBtn.classList.add('btn-style2');
      this.classList.remove('btn-style2');
      this.classList.add('btn-style2-clicked');
      prevBtn = this;
    }
  });
});
// ------------------------------------------------ //
// function changeC() {
//   const allClear = document.querySelector('.all-clear');
//   allClear.textContent = 'C';
// }
// function changeAC() {
//   const allClear = document.querySelector('.all-clear');
//   allClear.textContent = 'AC';
//   currentNumber = '0';
//   result.textContent = '0';
//   display.textContent = display.textContent.slice();
// }
