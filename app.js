// -------------------------DOM---------------------------- //
const box = document.querySelector('.calc');
const result = document.querySelector('.result');
const display = document.querySelector('.display-calc');
const operations1 = document.querySelectorAll('.operation1');
const operations2 = document.querySelectorAll('.operation2');
const numbers = document.querySelectorAll('.number');
// -----------------------기본 세팅------------------------ //
let currentNumber = '0';
let dotUsed = false;
let operator = null;
let prevNumber = null;
// 이전에 계산된 결과를 저장해 둘 변수
let previousResult = null;
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
        // 'AC' 버튼을 클릭한 경우의 계산 수행
        currentNumber = '0';
        dotUsed = false;
        previousResult = null;
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
// ----------------------숫자 버튼------------------------- //
numbers.forEach((number) => {
  number.addEventListener('click', () => {
    const numberText = number.textContent;
    // 숫자버튼을 다시 누를 때 result에 숫자 갱신

    // '.' 중복 방지하기
    if (numberText === '.' && !dotUsed) {
      currentNumber += numberText;

      dotUsed = true;
    } else if (numberText !== '.') {
      // 현재 연산자가 없을 때는 입력된 숫자를 결과창에 출력
      // 현재 입력된 숫자가 0이고 소수점이 아직 입력되지 않은 경우, 0을 대체
      currentNumber = currentNumber === '0' && !dotUsed ? numberText : currentNumber + numberText;
    } else if (numberText === '.' && dotUsed) {
      return;
    }
    if (currentNumber.length > 9) {
      return;
    }

    display.textContent += numberText;
    result.textContent = currentNumber; // 결과창에도 할당
    resizeFont();
  });
});
// -------------------------------------------------- //

// ----------------------사칙 연산------------------------ //
operations2.forEach((operation) => {
  operation.addEventListener('click', () => {
    const operationText = operation.textContent;
    if (result.textContent === '0' || operationText === '=') {
      // result가 0인 경우, 모든 버튼 클릭 이벤트를 막음
      return;
    } else {
      dotUsed = false; // 소수점 사용 여부 초기화
      if (prevNumber === null) {
        // 현재 연산자가 처음 눌린 경우, 이전에 입력된 숫자는 현재 숫자
        prevNumber = currentNumber;
        operator = operationText;
        currentNumber = '';

        display.textContent += `${operationText}`;
      } else if (currentNumber !== '') {
        // 이전 연산자와 함께 계산 수행
        const calculation = operate(parseFloat(prevNumber), parseFloat(currentNumber), operator);
        prevNumber = calculation.toString();
        operator = operationText;
        currentNumber = '';
        display.textContent = `${calculation}${operationText}`;
        result.textContent = prevNumber;
        resizeFont();
      } else {
        // 현재 입력된 연산자를 바로 할당
        operator = operationText;
        display.textContent = display.textContent.slice(0, -1) + `${operationText}`;
      }
    }
  });
});

// -----------------------등호 버튼------------------------ //
const equal = document.querySelector('.equal');
equal.addEventListener('click', () => {
  if (prevNumber !== null && currentNumber !== '' && operator !== null) {
    const calculation = operate(parseFloat(prevNumber), parseFloat(currentNumber), operator);
    previousResult = calculation.toString();
    result.textContent = calculation;
    display.textContent = calculation;
    currentNumber = calculation;
    prevNumber = null;
    operator = null;

    resizeFont();
  }
});

// ----------------------계산 함수-------------------------- //
function operate(num1, num2, operator) {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '×':
      return num1 * num2;
    case '÷':
      return num1 / num2;
    default:
      return null;
  }
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

// ---------------------------------------------------------- //
operations2.forEach((operation) => {
  operation.addEventListener('click', function () {
    if (this !== this) {
      this.style.backgroundColor = '#f69906';
      this.style.color = 'white';
      this.style.transition = 'all 0.3s';
    } else {
      this.style.backgroundColor = 'white';
      this.style.color = '#f69906';
      this.style.transition = 'all 0.3s';
    }
  });
});

// 마우스가 버튼 위로 이동할 때의 스타일 변경 코드를 각 버튼의 마우스 이벤트 리스너에서 실행합니다.
operations2.forEach((btn) => {
  btn.addEventListener('mouseover', function () {
    if (this.textContent !== '=') {
      this.style.backgroundColor = '#fcc78d';
      this.style.transition = 'all 0.3s';
    }
  });

  btn.addEventListener('mouseout', function () {
    if (this.textContent !== '=') {
      this.style.backgroundColor = '#f69906';
      this.style.color = 'white';
      this.style.transition = 'all 0.3s';
    }
  });
});
