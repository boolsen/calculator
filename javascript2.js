const inputDisplay = document.querySelector('.calc-display');
const resultDisplay = document.querySelector('.res-display');
const container = document.querySelector('.container');
const operationOrder = {1: ['(',')'],2: ['*','/','%'], 3: ['+','-']};

container.addEventListener('click', (event) => {
    // listens for any click on a button
    const isButton = event.target.classList.contains('button');
    if (!isButton) {
      return;
    }  
    buttonManager(event.target)
  }
)

const buttonManager = function (element) {
    // Handles clicks on buttons
    if (element.id === 'clear') {
        clearInput();
        return
    }
    if (element.id !== 'calculate') {
        updateInputDisplay(element);
    }

    let equationString = inputDisplay.value;
    equationArray = divideEquation(equationString);
    let result = calculate(equationArray);
    if (result && !isNaN(result)) {
        updateResultDisplay(result);
    }
    else if (element.id === 'calculate') {
        updateResultDisplay('ERROR');
    }
}

const clearInput = function () {
    // Clear input display
    inputDisplay.value = '';
    resultDisplay.value = '';
}

const updateInputDisplay = function(element) {
    // Updates input display textcontent
    inputDisplay.value += element.textContent;
}

const updateResultDisplay = function (result) {
    // Updates result display text content
    resultDisplay.value = String(result);
}

const divideEquation = function(equationString) {
    // Splits equationstring into an array of calculation elements
    let char;
    let numberStr = '';
    let equationArray = [];
    
    for (let i = 0; i < equationString.length; i++) {
        char = equationString.charAt(i)
        if (!isNaN(char) || char === '.') {
            numberStr += char;
        }else {
            if (numberStr !== '') {
                equationArray.push(numberStr);
            }
            numberStr = '';
            equationArray.push(char);          
        }
    }

    if (numberStr !== '') {
        equationArray.push(numberStr);
    }
    return equationArray;
}

const getAllIndexesOfMatch = function (arr, val) {
    // Find all idices that matches val
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

const calculate = function(equationArray) {
    // Calculates every sub equation until lenght of array = 1, that element will be the result of the equation

    let leftParanthesisIdxs = getAllIndexesOfMatch(equationArray, '(');
    let rightParanthesisIdxs = getAllIndexesOfMatch(equationArray, ')');
    if (leftParanthesisIdxs.length != rightParanthesisIdxs.length) {
        return; // Invalid equation, unequal number of left and right paranthesis
    }

    while (equationArray.length > 1) {
        let status = partialCalculation(equationArray); 
        if (!status) {
            return false;
        }
    }

    if (equationArray.length === 1) {
        return equationArray[0];
    }
    
}

const partialCalculation = function(equationArray) {
    // Following order of operation to determine which part of the equation to calculate
    let firstPercent = equationArray.indexOf('%')
    if (firstPercent > 0 && firstPercent <= equationArray.length) {
        let percentRatio = checkIfSafeToCalculate(percent, parseFloat(equationArray[firstPercent - 1]));
        if (percentRatio === false) {
            return false;
        }
        equationArray.splice(firstPercent - 1, 2, percentRatio);
        return true;
    }

    if (equationArray.indexOf('(') > -1) {
        calculateParenthesis(equationArray);
        return true;
    }

    let firstMultiply = equationArray.indexOf('*')
    if (firstMultiply > 0 && firstMultiply < equationArray.length) {
        let product = checkIfSafeToCalculate(multiply, parseFloat(equationArray[firstMultiply-1]),parseFloat(equationArray[firstMultiply+1]));
        if (product === false) {
            return false;
        }
        equationArray.splice(firstMultiply - 1, 3, product);
        return true;
    }

    let firstDivide = equationArray.indexOf('/')
    if (firstDivide > 0 && firstDivide < equationArray.length) {
        let result = checkIfSafeToCalculate(divide, parseFloat(equationArray[firstDivide-1]),parseFloat(equationArray[firstDivide+1]));
        if (result === false) {
            return false;
        }
        equationArray.splice(firstDivide - 1, 3, result);
        return true;
    }

    let firstAdd = equationArray.indexOf('+')
    if (firstAdd > 0 && firstAdd < equationArray.length) {
        let result = checkIfSafeToCalculate(add, parseFloat(equationArray[firstAdd-1]),parseFloat(equationArray[firstAdd+1]));
        if (result === false) {
            return false;
        }
        equationArray.splice(firstAdd - 1, 3, result);
        return true;
    }

    let firstSubtract = equationArray.indexOf('-')
    if (firstSubtract > 0 && firstSubtract < equationArray.length) {
        let result = checkIfSafeToCalculate(subtract, parseFloat(equationArray[firstSubtract-1]),parseFloat(equationArray[firstSubtract+1]));
        if (result === false) {
            return false;
        }
        equationArray.splice(firstSubtract - 1, 3, result);
        return true;
    }

    return true;
}

const checkIfSafeToCalculate = function (func, num1, num2) {
    
    if (isNaN(parseFloat(num1)) || (num2 !== undefined && isNaN(parseFloat(num2)))) {
        return false;
    }
    if (num2 !== undefined) {
        return func(num1, num2); // If two numbers are provided
    }
    return func(num1);
}

const calculateParenthesis = function (equationArray) {
    // Calculates first paranthesis of equation by calling partialcalculate on the subarray
    let addLeftMultiply = false;
    let addRightMultiply = false;

    let firstLeftParanthesisIdx = equationArray.indexOf('(');
    let firstRightParanthesisIdx = equationArray.indexOf(')'); 

    let numberOfElementsInParanthesis = firstRightParanthesisIdx - firstLeftParanthesisIdx + 1;
    if (numberOfElementsInParanthesis <= 2) {
        return; //Something went wrong   
    }
    
    if (firstLeftParanthesisIdx -1 >= 0 && isNaN(parseFloat(equationArray[firstLeftParanthesisIdx - 1]))) {
        addLeftMultiply = true;
    }
    if (firstRightParanthesisIdx + 1 >= 0 && isNaN(parseFloat(equationArray[firstRightParanthesisIdx + 1]))) {
        addRightMultiply = true;
    }
    let paranthesisArray = equationArray.slice(firstLeftParanthesisIdx + 1, firstRightParanthesisIdx);
    partialCalculation(paranthesisArray);

    let spliceElements = [paranthesisArray] //Put in multiplications if not already in place
    if (addRightMultiply) {
        spliceElements.splice(1,0,'*');       
    }
    if (addLeftMultiply) {
        spliceElements.splice(0,0,'*');
    }
    equationArray.splice(
        firstLeftParanthesisIdx
        , numberOfElementsInParanthesis
        , ...spliceElements)
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
        return false;
    }
    return num1 / num2;
}

const percent = function (num) {
    return (num / 100);
}

const isNumeric = function (element) {
    if (typeof parseFloat(element) === 'number') {
        return true;
    }

    return false;
}
