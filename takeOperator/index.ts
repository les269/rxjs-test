import { fromEvent, interval, timer } from "rxjs";
import { map, take, takeUntil, takeWhile } from "rxjs/operators";

//https://ithelp.ithome.com.tw/articles/10250382
/*
take 代表要從來源 Observable 中觸發 N 次事件的值；
當訂閱開始後，如果發生過的事件數量已經達到我們設定的數量後，
就會結束；在前面我們也稍微介紹過，並不困難
*/


// timer(0, 1000).pipe(
//     take(6)
// ).subscribe({
//     next: data => console.log(`take 示範: ${data}`),
//     complete: () => console.log(`take 結束`),
// });

/*
takeUntil 會持續觸發來源 Observable 的事件值，
直到 (until) 指定的另外一個 Observable 發生新事件時，
才會結束，算是蠻常用的一個 operator。
*/

// const click$ = fromEvent(document, 'click');
// const source$ = interval(1000).pipe(map(data => data + 1))

// source$.pipe(
//     takeUntil(click$)
// ).subscribe({
//     next: data => console.log(`takeUntil 示範: ${data}`),
//     complete: () => console.log('takeUntil 結束')
// });
// takeUntil 示範: 1
// takeUntil 示範: 2
// takeUntil 示範: 3
// takeUntil 示範: 4
// takeUntil 示範: 5
// (click$ 發出新事件)
// takeUntil 結束

/*
takeWhile 內需要傳入一個 callback function，
這個 callback function 決定 takeWhile 發生事件的時機，
只要事件值持續符合 callback function 內的條件，就會持續產生事件，直到不符合條件後結束。
*/

// const source$ = interval(1000).pipe(map(data => data + 1))

// source$.pipe(
//     takeWhile(data => data < 5)
// ).subscribe({
//     next: data => console.log(`takeWhile 示範 (1): ${data}`),
//     complete: () => console.log('takeWhile 結束 (1)')
// });

// takeWhile 示範 (1): 1
// takeWhile 示範 (1): 2
// takeWhile 示範 (1): 3
// takeWhile 示範 (1): 4
// takeWhile 結束 (1)

/*
takeWhile 的 callback 可以傳入事件值 (value) 及索引值 (index)；
除了 callback function 之外，還有一個 inclusive 參數，
代表是否要包含判斷不符合條件的那個值，
預設為 false，當設為 true 時，發生結束條件的那次事件值也會被包含在要發生的事件內。
*/
const source$ = interval(1000).pipe(map(data => data + 1))
source$.pipe(
    takeWhile(data => data < 5, true)
).subscribe({
    next: data => console.log(`takeWhile 示範 (2): ${data}`),
    complete: () => console.log('takeWhile 結束 (2)')
});
// takeWhile 示範 (2): 1
// takeWhile 示範 (2): 2
// takeWhile 示範 (2): 3
// takeWhile 示範 (2): 4
// takeWhile 示範 (2): 5
// takeWhile 結束 (2)