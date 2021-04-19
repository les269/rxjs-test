
const add = (num) => {
    return (data) => num + data;
}

const plusOne = add(1);
const plusTwo = add(2);

console.log(plusOne(10));

//取出偶數
const even = (inputArray: number[]) => {
    return inputArray.filter(item => item % 2 === 0);
};

const power = (n: number) => {
    return input => {
        return input.map(item => Math.pow(item, n));
    }
}

// 產生計算平方和次方的 function
const square = power(2);
const cube = power(3);

const sum = (inputArray) => {
    return inputArray.reduce((pre, current) => pre + current, 0);
}

console.log(`平方: ${square([1, 2, 3])}`); // 1, 4, 9
console.log(`立方: ${cube([1, 2, 3])}`); // 1, 8, 27

// 計算偶數平方和值
const sumEvenSquare = inputArray => {
    const evenData = even(inputArray);

    const squareData = square(evenData);
    const sumResult = sum(squareData);
    return sumResult;
};
const sumEvenCube = inputArray => {
    const evenData = even(inputArray);
    // 計算立方值
    const cubeData = cube(evenData);
    const sumResult = sum(cubeData);
    return sumResult;
};

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(`偶數平方和: ${sumEvenSquare(data)}`);
console.log(`偶數平方和: ${sumEvenCube(data)}`);

const compose = (...fns) => {
    return data => {
        let result = data;
        // 從最後一個 function 開始執行
        for (let i = fns.length - 1; i >= 0; --i) {
            result = fns[i](result);
        }
        return result;
    };
}
const pipe = (...fns) => {
    return data => {
        let result = data;
        // 原本 compose 的 for 迴圈是從最後一個開始執行
        // pipe 內改為從第一個 function 開始執行
        for (let i = 0; i < fns.length; ++i) {
            result = fns[i](result);
        }
        return result;
    };
};

const sumEvenPower = powerFn => {
    // 呼叫順序為從上往下：even、powerFn、sum
    return pipe(
        even,
        powerFn,
        sum,
    );
};
