let firstNum;
let secondNum;
let operation;
let result;

const wrapper = document.querySelector('.container');
const display = document.getElementById('calc-display');

wrapper.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }

  buttonManager(event.target)

})

const buttonManager = function (target) {
    let targetClasses = target.classList;

    if (targetClasses.contains('number')) {
        if (display.textContent === '0') {
            display.textContent = target.textContent;
        }
        display.textContent += target.textContent; 
    }
    else if (targetClasses.contains('operation')) {
        if (operation != null) {
            calculate(target);
        }
        operation = target.textContent;
    }
    else if (targetClasses.contains('clear')) {
        display.textContent = '';
        operation = null;
        result = null;
    }
    else if (targetClasses.contains('cakculate')) {
        calculate(target);
    }
}

const add = function(num1, num2) {
    return num1 + num2;
}

const subtract = function (num1, num2) {
    return num1 - num2;
}

const multiply = function (num1, num2) {
    return num1 * num2;
}

const divide = function (num1, num2) {
    if (num2 === 0) {
        return 'ERROR';
    }
    return num1 / num2;
}

/* const calculate = function (operatorElement) {
    let operator = operatorElement.textContent;
    let displayNumber = display.textContent;
    switch (operation) {
        case "+":
            result = add(result, parseInt(displayNumber));
            operation = operator
            break;

        case "-":
            res = subtract(num1,num2);            
            break;

        case "*":
            res = multiply(num1, num2);
            break;

        case "/":
            res = divide(num1, num2);
            break; 
        default:
            break;
    }
}

const buttonManager = function (target) {
    const isActive = button.classList.contains("active");
    let targetClasses = target.classList;

    if (targetClasses.contains('number')) {
        if (display.textContent === '0') {
            display.textContent = target.textContent;
        }
        display.textContent += target.textContent; 
    }
    else if (targetClasses.contains('operation')) {
        if (operation != null) {
            calculate(target);
        }
        operation = target.textContent;
    }
    else if (targetClasses.contains('clear')) {
        display.textContent = '';
        operation = null;
        result = null;
    }
    else if (targetClasses.contains('cakculate')) {
        calculate(target);
    }
} */
