import { combineAll, concatAll, mergeAll, pairwise, startWith, switchMap } from 'rxjs/operators';

//https://ithelp.ithome.com.tw/articles/10249369

/*
switchMap 可以將來源 Observable 事件的「資料」轉換成 Observable，
switchAll 則非常相似，是將來源事件的「Observable」轉換成另一個 Observble。
*/

import { interval, Subject, timer } from "rxjs";
import { map, switchAll, take } from "rxjs/operators";

// const generateStream = round =>
//     timer(0, 1000).pipe(
//         map(data => `資料流 ${round}: ${data + 1}`),
//         take(5)
//     );

// const source$ = new Subject();

// const stream$ = source$.pipe(map(round => generateStream(round)));

// stream$.pipe(switchAll())
//     .subscribe(result => console.log(result));

// // 第一次事件
// source$.next(1);

// // 第二次事件
// setTimeout(() => {
//     source$.next(2);
// }, 4000);

// // 第三次事件
// setTimeout(() => {
//     source$.next(3);
// }, 5000);

/*
concatMap 和 concatAll 都會等待前一個 Observable 完成，
在開始繼續新的 Observable 資料流訂閱，因此可以確保每個資料流都執行至完成
*/
// const generateStream = round =>
//     timer(0, 1000).pipe(
//         map(data => `資料流 ${round}: ${data + 1}`),
//         take(3)
//     );

// const source$ = new Subject();

// const stream$ = source$.pipe(map(round => generateStream(round)));

// stream$.pipe(concatAll())
//     .subscribe(result => console.log(result));

// source$.next(1);

// setTimeout(() => {
//     source$.next(2);
// }, 4000);

// setTimeout(() => {
//     source$.next(3);
// }, 5000);

/*
mergeMap 和 mergeAll 在得到新的資料流後會直接訂閱，
且不退訂之前的資料流，因此所有資料流會依照各自發生的時間直接的發生在 mergeAll 建立的資料流上
*/

// const generateStream = round =>
//     timer(0, 1000).pipe(
//         map(data => `資料流 ${round}: ${data + 1}`),
//         take(3)
//     );

// const source$ = new Subject();

// const stream$ = source$.pipe(map(round => generateStream(round)));

// stream$.pipe(mergeAll())
//     .subscribe(result => console.log(result));

// source$.next(1);

// setTimeout(() => {
//     source$.next(2);
// }, 2000);

// setTimeout(() => {
//     source$.next(3);
// }, 3000);

/*
combineAll 和 combineLateset 非常類似，
都是把資料流的資料組合在一起，規則是每當有資料流發生新事件值時，
將這個事件值和其他資料流最後一次的事件值組合起來。

combineLatest 需要明確指定要組合哪些 Observable，
而 combineAll 則適用在來源不明確的 Observable of Observable 的情境；
另外因為來源並不明確，因此必須等到整個 Observable 結束，
明確知道所有要組合的 Observable 後，才會進行相關動作。
*/

// const generateStream = round =>
//     timer(0, 1000).pipe(
//         map(data => `資料流 ${round}: ${data + 1}`),
//         take(3)
//     );

// const source$ = new Subject();

// const stream$ = source$.pipe(map(round => generateStream(round)));

// stream$.pipe(combineAll())
//     .subscribe(result => console.log(result));

// source$.next(1);

// setTimeout(() => {
//     source$.next(2);
//     // 結束資料流，不然 combineAll 會持續等待到結束
//     source$.complete();
// }, 3000);
// (等候 3 秒，到 source$ 結束)
// ["資料流 1: 1", "資料流 2: 1"]
// ["資料流 1: 2", "資料流 2: 1"]
// ["資料流 1: 2", "資料流 2: 2"]
// ["資料流 1: 3", "資料流 2: 2"]
// ["資料流 1: 3", "資料流 2: 3"]

/*
startWith 會在一個 Observable 內加上一個起始值，
也就是訂閱產生時會立刻最先收到的一個值，例如在前兩天練習 pairwise 時，
會因為第一個事件值沒有「上一個事件值」被忽略，因此改用 scan 來解決，
但也可以使用 startWith，會更加簡單
*/

interval(1000).pipe(
    map(data => data + 1),
    startWith(0), // 給予初始事件值
    pairwise(), // 再搭配 pairwise 時，就能讓原始 Observable 的第一個事件有搭配資料可用
    take(6),
).subscribe(result => {
    console.log(result);
});