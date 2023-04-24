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

    if (result.textContent === '0' && buttonText !== 'AC') {
      // result가 0인 경우, AC 버튼이 아닌 다른 버튼 클릭 이벤트를 막음
      return;
    } else if (buttonText === 'AC') {
      // 'AC' 버튼을 클릭한 경우의 계산 수행
      currentNumber = '0';
      dotUsed = false;
      operator = null;
      result.textContent = '0';
      display.textContent = '0';
      // 폰트 크기를 원래대로 복원
      result.style.fontSize = originalFontSize + 'px';
      currentFontSize = originalFontSize;
    } // '&#177' 버튼을 클릭한 경우의 계산 수행
    else if (buttonText === '±') {
      currentNumber = currentNumber.startsWith('-')
        ? currentNumber.substring(1)
        : `-${currentNumber}`;
      display.textContent = currentNumber;
    } else if (buttonText === '%') {
      currentNumber = (parseFloat(currentNumber) / 100).toString();
      display.textContent = currentNumber;
    }
    result.textContent = currentNumber;
    resizeFont();
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
    if (currentNumber.length > 8) {
      return;
    }

    display.textContent += numberText;
    result.textContent = currentNumber; // 결과창에도 할당
    resizeFont();
  });
});
// -------------------------------------------------- //

// ----------------------사칙연산 버튼------------------------ //

operations2.forEach((button) => {
  button.addEventListener('click', () => {
    if (result.textContent === '0') {
      // result가 0인 경우, 모든 버튼 클릭 이벤트를 막음
      return;
    } else if (button.textContent == '=') {
      // display에 있는 수식을 가져옴
      let expression = display.textContent;
      // "x"를 "*"로 변환
      expression = expression.replace('×', '*');
      // "÷"를 "/"로 변환
      expression = expression.replace(/÷/g, '/');
      // 수식을 분리하여 계산
      let calcResult = eval(expression);

      // 출력
      result.textContent = calcResult;
      display.textContent = calcResult;
      currentNumber = '';
      return;
    }
    if (!['+', '-', '×', '÷'].includes(display.textContent.slice(-1))) {
      // display에 있는 수식을 가져옴
      let expression = display.textContent;
      // "x"를 "*"로 변환
      expression = expression.replace('×', '*');
      // "÷"를 "/"로 변환
      expression = expression.replace(/÷/g, '/');
      // 수식을 분리하여 계산
      let calcResult = eval(expression);

      // 출력
      result.textContent = calcResult;
      display.textContent = calcResult + button.textContent;
      currentNumber = '';
      return;
    } else {
      display.textContent += button.textContent;
    }
  });
});

// ----------------------------------------------------------- //

function resizeFont() {
  // 폰트 사이즈 동적 조절 함수
  const boxWidth = box.clientWidth - 60;
  const resultWidth = result.clientWidth;
  if (resultWidth > boxWidth) {
    const fontSize = parseFloat(window.getComputedStyle(result).fontSize);
    result.style.fontSize = (fontSize * boxWidth) / resultWidth + 'px';
  }
}
