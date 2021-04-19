import { defer, EMPTY, from, fromEvent, fromEventPattern, iif, interval, of, range, throwError, timer } from "rxjs";
//https://ithelp.ithome.com.tw/articles/10246196


/*
    EMPTY 就是一個空的 Observable，沒有任何事件，就直接結束了，直接看程式：
*/
EMPTY.subscribe({
    next: data => console.log(`empty 範例: ${data}`),
    complete: () => console.log('empty 結束')
});

/*
of
of 基本上非常簡單，就是將傳進去的值當作一條 Observable，當值都發送完後結束，直接上程式：
*/
of(1, 2, 3, 4).subscribe({
    next: data => console.log(`of 範例: ${data}`),
    complete: () => console.log('of 結束')
});


/**
 range 顧名思義就是依照一個範圍內的數列資料建立 Observable，包含兩個參數：
start: 從哪個數值開始
count: 建立多少個數值的數列
 * **/

range(3, 4).subscribe(data => console.log(`range 範例: ${data}`));

/*
iif
iif 會透過條件來決定產生怎麼樣的 Observable，有三個參數：

condition: 傳入一個 function，這個 function 會回傳布林值。
trueResult: 當呼叫 condition 參數的 function 回傳 true 時，使用 trueResult 的 Observable
falseResult: 當呼叫 condition 參數的 function 回傳 false 時，使用 falseResult 的 Observable
*/

const emitHelloIfEven = (data) => {
    return iif(() => data % 2 === 0, of('Hello'), EMPTY);
};

emitHelloIfEven(1).subscribe(data => console.log(`iif 範例 (1): ${data}`));
// (不會印出任何東西)
emitHelloIfEven(2).subscribe(data => console.log(`iif 範例 (2): ${data}`));
// iif 範例 (2): Hello


/*
 throwError 通常不會被單獨使用，而是在使用 pipe 設計整條 Observable 時，用來處理錯誤的。
*/
const source$ = throwError('發生錯誤了');
source$.subscribe({
    next: (data) => console.log(`throwError 範例 (next): ${data}`),
    error: (error) => console.log(`throwError 範例 (error): ${error}`),
    complete: () => console.log('throwError 範例 (complete)'),
});


/*
from 算是使用機會不低的 operator，它可以接受的參數類型包含陣列、
可疊代的物件 (iterable)、Promise 和「其他 Observable 實作」 等等，
from 會根據傳遞進來的參數決定要如何建立一個新的 Observable。
*/
from([1, 2, 3, 4]).subscribe(data => {
    console.log(`from 示範 (1): ${data}`);
});

function* range2(start, end) {
    for (let i = start; i <= end; ++i) {
        yield i;
    }
}

from(range2(1, 4)).subscribe(data => {
    console.log(`from 示範 (2): ${data}`);
});

// 傳入 Promise 當參數
from(Promise.resolve(1)).subscribe(data => {
    console.log(`from 示範 (3): ${data}`);
});
// from 示範 (3): 1

fromEvent(document, 'click').subscribe(data => {
    console.log('fromEvent 示範: 滑鼠事件觸發了');
});

/*
fromEventPattern 可以根據自訂的邏輯決定事件發生，只要我們將邏輯寫好就好；
fromEventPattern 需要傳入兩個參數：

addHandler：當 subscribe 時，呼叫此方法決定如何處理事件邏輯
removeHandler：當 unsubscribe 時，呼叫次方法將原來的事件邏輯取消
addHandler 和 removeHandler 都是一個 function，串入一個 handler 物件，
這個物件其實就是一個被用來呼叫的方法，直接看例子：
*/

// const addClickHandler = (handler) => {
//     console.log('fromEventPattern 示範: 自定義註冊滑鼠事件')
//     document.addEventListener('click', event => handler(event));
// }

// const removeClickHandler = (handler) => {
//     console.log('fromEventPattern 示範: 自定義取消滑鼠事件')
//     document.removeEventListener('click', handler);
// };

// const source5$ = fromEventPattern(
//     addClickHandler,
//     removeClickHandler
// );

// const subscription = source5$
//     .subscribe(event => console.log('fromEventPattern 示範: 滑鼠事件發生了', event));

// setTimeout(() => {
//     subscription.unsubscribe();
// }, 3000);

/*
interval 會依照的參數設定的時間 (毫秒) 來建議 Observable，
當被訂閱時，就會每隔一段指定的時間發生一次資料流，
資料流的值就是為事件是第幾次發生的 (從 0 開始)，以下程式建立一個每一秒發生一次的資料流：
*/
// const subscription2 = interval(1000)
//     .subscribe(data => console.log(`interval 示範: ${data}`));

// setTimeout(() => {
//     subscription2.unsubscribe();
// }, 5500);

/*
timer 跟 interval 有點類似，但它多一個參數，
用來設定經過多久時間後開始依照指定的間隔時間計時。
*/

// const subscription3 = timer(3000, 2000).subscribe(data => {
//     console.log(`timer 示範 (2): ${data}`);
// });
// setTimeout(() => {
//     subscription3.unsubscribe();
// }, 10000);

/*
defer 會將建立 Observable 的邏輯包裝起來，
提供更一致的使用感覺，使用 defer 時需要傳入一個 factroy function 當作參數，
這個 function 裡面需要回傳一個 Observable (或 Promise 也行)，
當 defer 建立的 Observable 被訂閱時，
會呼叫這個 factroy function，並以裡面回傳的 Observer 當作資料流
*/

const factory = () => of(1, 2, 3);
const source6$ = defer(factory);
source6$.subscribe(data => console.log(`defer 示範: ${data}`));


// 將 Promise 包成起來
// 因此在此 function 被呼叫前，都不會執行 Promise 內的程式
const promiseFactory = () => new Promise((resolve) => {
    console.log('Promise 內被執行了');
    setTimeout(() => {
        resolve(100);
    }, 1000);
});
const deferSource$ = defer(promiseFactory);
// 此時 Promise 內程式依然不會被呼叫
console.log('示範用 defer 解決 Promise 的問題:');
// 直到被訂閱了，才會呼叫裡面的 Promise 內的程式
deferSource$.subscribe(result => {
    console.log(`Promise 結果: ${result}`)
});