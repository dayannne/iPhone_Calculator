const display = document.querySelector('.result');
const operations = document.querySelectorAll('.operation');
const numbers = document.querySelectorAll('.number');
let currentNumber = '0'; // 문자열 '0'으로 초기화
let decimalUsed = false;
let currentSign = 1; // 현재 숫자의 부호, 초기값은 양수로 설정

numbers.forEach((number) => {
  number.addEventListener('click', () => {
    const numberText = number.textContent;
    if (numberText === '.' && !decimalUsed) {
      currentNumber += numberText;
      decimalUsed = true;
    } else if (numberText !== '.') {
      currentNumber =
        currentNumber === '0' && !decimalUsed ? numberText : currentNumber + numberText;
      // 현재 입력된 숫자가 0이고 소수점이 아직 입력되지 않은 경우, 0을 대체
    }
    display.textContent = currentNumber; // display.textContent에 할당
  });
});

// AC / = / 연산자 버튼을 클릭한 경우
operations.forEach((button) => {
  button.addEventListener('click', () => {
    const buttonText = button.textContent;
    // 'AC' 버튼을 클릭한 경우의 계산 수행
    if (buttonText === 'AC') {
      currentNumber = '0';
      decimalUsed = false;
      currentSign = 1; // 부호 초기화
    } else if (buttonText === '=') {
      // '=' 버튼을 클릭한 경우의 계산 수행
      const result = eval(display.textContent); // eval() 함수 사용
      display.textContent = result;
      currentNumber = result.toString(); // 문자열로 변환
      currentSign = result < 0 ? -1 : 1; // 결과의 부호 저장
    } else if (buttonText === '±') {
      currentSign = -currentSign;
      currentNumber = parseFloat(currentNumber) * -1;
    } else if (buttonText === '%') {
      const result = parseFloat(currentNumber) / 100;
      display.textContent = result.toString();
      currentNumber = result.toString();
    } else {
    }

    display.textContent = currentNumber; // display.textContent에 할당
  });
});
