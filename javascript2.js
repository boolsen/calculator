const inputDisplay = document.querySelector('.res-display');
const resultDisplay = document.querySelector('.calc-display');
const container = document.querySelector('.container');
const operationOrder = {1: ['(',')'],2: ['*','/','%'], 3: ['+','-']};

container.addEventListener('click', (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
      return;
    }
  
    buttonManager(event.target)
  
  })
/* 356+23*(32-34) */
const calculate = function(equationArray) {
    let res = 0;
    let leftParanthesisIdxs = getAllIndexesOfMatch(equationArray, '(');
    let rightParanthesisIdxs = getAllIndexesOfMatch(equationArray, ')');

    if (leftParanthesisIdxs.length != rightParanthesisIdxs) {
        return; /* Invalid equation */
    }

    //split up into sub calculations, assess priority of operations and start there
    // e.g. find multiplication symbol, do calculation for i-1 and i+1, replace elemnts in array
    // repeat until array.length = 1
    while (equationArray.length > 1) {
        partialCalculation(equationArray); 
        // repeat until length = 1, recursion for paranthesis
    }
    for (let i = 0; i < equationArray.length; i++) {
        castNumber = parseFloat(equationArray[i],10);
        if (typeof castNumber === 'number') {
            res = add(res, castNumber);
        }
        else if (equationArray[i] === '*') {
            i++;
            res = add(res, parseFloat(equationArray[i]));
        }
    }
}

const getAllIndexesOfMatch = function (arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

const partialCalculation = function(equationArray) {
    let firstPercent = equationArray.indexOf('%')
    if (firstPercent > 0 && firstPercent <= equationArray.length) {
        let percentRatio = percent(parseFloat(equationArray[firstPercent - 1]));
        equationArray.splice(firstPercent - 1, 2, percentRatio);
        return;
    }

    if (equationArray.indexOf('(') > -1) {
        calculateParenthesis(equationArray);
        return;
    }

    let firstMultiply = equationArray.indexOf('*')
    if (firstMultiply > 0 && firstMultiply < equationArray.length) {
        let product = multiply(parseFloat(equationArray[firstMultiply-1]),parseFloat(equationArray[firstMultiply+1]));
        equationArray.splice(firstMultiply - 1, 3, product);
        return;
    }

    let firstDivide = equationArray.indexOf('/')
    if (firstDivide > 0 && firstDivide < equationArray.length) {
        let result = divide(parseFloat(equationArray[firstDivide-1]),parseFloat(equationArray[firstDivide+1]));
        equationArray.splice(firstDivide - 1, 3, result);
        return;
    }

    let firstAdd = equationArray.indexOf('+')
    if (firstAdd > 0 && firstAdd < equationArray.length) {
        let result = add(parseFloat(equationArray[firstAdd-1]),parseFloat(equationArray[firstAdd+1]));
        equationArray.splice(firstAdd - 1, 3, result);
        return;
    }

    let firstSubtract = equationArray.indexOf('-')
    if (firstSubtract > 0 && firstSubtract < equationArray.length) {
        let result = add(parseFloat(equationArray[firstSubtract-1]),parseFloat(equationArray[firstSubtract+1]));
        equationArray.splice(firstSubtract - 1, 3, result);
        return;
    }

}

const calculateParenthesis = function (array) {
    let addLeftMultiply = false;
    let addRightMultiply = false;
    let firstLeftParanthesisIdx = equationArray.indexOf('(');
    let firstRightParanthesisIdx = equationArray.indexOf(')'); 
    let numberOfElementsInParanthesis = firstRightParanthesisIdx - firstLeftParanthesisIdx + 1;
    if (numberOfElementsInParanthesis <= 2) {
        return; //Something went wrong
    }
    if (firstLeftParanthesisIdx -1 >= 0 && parseFloat(equationArray[firstLeftParanthesisIdx - 1]) === 'number') {
        addLeftMultiply = true;
    }
    if (firstRightParanthesisIdx + 1 >= 0 && parseFloat(equationArray[firstRightParanthesisIdx + 1]) === 'number') {
        addRightMultiply = true;
    }
    let paranthesisArray = equationArray.slice(firstLeftParanthesisIdx + 1, firstRightParanthesisIdx - 1);
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


const divideEquation = function() {
    let equation = inputDisplay.textContent;
    let char;
    let numberStr = '';
    let numberList = [];
    let calcArray =  [];
    let castFloat = false;

    
    for (let i = 0; i < equation.length; i++) {
        char = equation.charAt(i)
        if (typeof parseInt(char, 10) === 'number' || char === '.') {
            numberStr += char;
        }else {
            numberList.push(numberStr);
            numberStr = '';
            numberList.push(char);          
        }

    }
}

/* const buttonManager = function(target) {
    let input = target.textContent;
    let targetClasses = target.classList;

    if (targetClasses.contains('number')) {
        break;

    } else {
        
    }
} */


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

const percent = function (num) {
    return (num / 100);
}

const isNumeric = function (element) {
    if (typeof parseFloat(element) === 'number') {
        return true;
    }

    return false;
}

const updateDisplay = function (updatedString) {
    inputDisplay.textContent = updatedString;
}

console.log(add(2,3));