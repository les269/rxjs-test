import { EMPTY, from, interval, of, timer } from "rxjs";
import { delay, delayWhen, filter, map, take, tap, toArray } from "rxjs/operators";

//https://ithelp.ithome.com.tw/articles/10252850

/*
tap 主要就是用來處理 side effect 的，
在使用各種 operators 時，
我們應該盡量讓程式內不要發生 side effect，
但真的有需要處理 side effect 時，
可以使用 tap 把「side effect」和「非 side effect」隔離，
未來會更加容易找到問題發生的地方。
*/
// interval(1000).pipe(
//     map(data => data * 2),
//     // 使用 tap 來隔離 side effect
//     tap(data => console.log('目前資料', data)),
//     map(data => data + 1),
//     tap(data => console.log('目前資料', data)),
//     take(10)
// ).subscribe((data) => {
//     console.log(`tap 示範 (1): ${data}`);
// });




/*
toArray 在來源 Observable 發生事件時，
不會立即發生在新的 Observable 上，而是將資料暫存起來，
當來源 Observable 結束時，將這些資料組合成一個陣列發生在新的 Observable 上。
*/
interval(1000)
    .pipe(
        take(3),
        toArray()
    )
    .subscribe(data => {
        console.log(`toArray 示範: ${data}`);
    });
// toArray 示範: 0,1,2

from([1, 2, 3, 4, 5, 6, 7, 8, 9]).pipe(
    map(value => value * value),
    filter(value => value % 3 === 0),
    toArray()
).subscribe(result => console.log(result));


/*
delay 會讓來源 Observable 延遲一個指定時間(毫秒)再開始。
*/

of(1, 2, 3).pipe(
    delay(1000)
).subscribe(data => {
    console.log(`delay 示範: ${data}`);
});
// (等候 1 秒鐘)
// delay 示範: 1
// delay 示範: 2
// delay 示範: 3


/*
delayWhen 可以自行決定來源 Observable 每次事件延遲發生的時機點，
在 delayWhen 內需要傳入一個 delayDurationSelector callback function，
delayWhen 會將事件資訊傳入，而 delayDurationSelector 需要回傳一個 Observable，
當此 Observable 發生新事件時，才會將來源事件值發生在新的 Observable 上
*/
const delayFn = (value) => {
    return of(value).pipe(delay(value % 2 * 2000));
}
interval(1000).pipe(
    take(3),
    delayWhen(value => delayFn(value))
).subscribe(data => {
    console.log(`delayWhen 示範 (1): ${data}`);
});
  // delayWhen 示範 (1): 0
  // (原本應該發生事件 1，但被延遲了)
  // delayWhen 示範 (1): 2
  // delayWhen 示範 (1): 1

