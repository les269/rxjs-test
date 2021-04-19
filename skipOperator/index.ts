import { fromEvent, interval, range, timer } from "rxjs";
import { map, skip, skipLast, skipUntil, skipWhile, take, takeUntil, takeWhile } from "rxjs/operators";

//https://ithelp.ithome.com.tw/articles/10250914

/*
skip 可以傳入一個數字，當訂閱開始時，會「忽略」前 N 個事件值，
到第 N + 1 的事件值才會收到資料
*/
// interval(1000).pipe(
//     skip(3)
// ).subscribe(data => {
//     console.log(`skip 示範： ${data}`)
// });

// (訂閱後的 0, 1, 2 會被忽略)
// skip 示範： 3
// skip 示範： 4
// skip 示範： 5
// ...

//skipLast 會忽略整個 Observable 的最後 N 次事件值
// range(5).pipe(
//     skipLast(3)
// ).subscribe(
//     data => console.log(`skipLast 示範 (1): ${data}`)
// );

// skipLast 示範 (1): 0
// skipLast 示範 (1): 1


//skipUntil 會持續忽略資料，直到指定的 Observable 發出新的事件時
// const click$ = fromEvent(document, 'click');
// const source$ = interval(1000);

// source$.pipe(
//     skipUntil(click$)
// ).subscribe(data => console.log(`skipUntil 示範 (1): ${data}`));

// (按下按鈕後才開始顯示最新的事件資料)
// skipUntil 示範: 2
// skipUntil 示範: 3
// skipUntil 示範: 4
// ...

/*
skipWhile 需要傳入一個 callback function，
在這個 function 會決定忽略目前的事件資料的條件，
只要符合這個條件，會持續忽略事件值，直到條件不符合為止：
*/

interval(1000).pipe(
    skipWhile(data => data < 2)
).subscribe(data => console.log(`skipWhile 示範: ${data}`));
// skipWhile 示範: 2
// skipWhile 示範: 3
// skipWhile 示範: 4
// skipWhile 示範: 5
// ...