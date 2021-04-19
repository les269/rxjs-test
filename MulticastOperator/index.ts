import { ConnectableObservable, EMPTY, interval, of, Subject, timer } from "rxjs";
import { count, filter, first, last, map, max, min, multicast, publish, shareReplay, single, take } from "rxjs/operators";

//https://ithelp.ithome.com.tw/articles/10253517

// const source$ = interval(1000).pipe(
//     take(5),
//     multicast(() => new Subject())
// );
// // srouce$ 變成一個 multicast 的 Observable
// // 使用 Subject 作為多播的來源

// source$.subscribe(data => {
//     console.log(`multicast 示範 (1) 第一次訂閱: ${data}`);
// });

// setTimeout(() => {
//     source$.subscribe(data => {
//         console.log(`multicast 示範 (1) 第二次訂閱: ${data}`);
//     });
// }, 5000);

// setTimeout(() => {
//     // pipe 的回傳一律是 Observable 型別
//     // 因此使用 TypeScript 轉型成 ConnectableObservable
//     // 使用 JavaScript 則直接呼叫 connect() 就好
//     (source$ as ConnectableObservable<any>).connect();
// }, 3000);
// multicast 示範 (1) 第一次訂閱: 0
// multicast 示範 (1) 第一次訂閱: 1
// multicast 示範 (1) 第二次訂閱: 1
// multicast 示範 (1) 第一次訂閱: 2
// multicast 示範 (1) 第二次訂閱: 2
// multicast 示範 (1) 第一次訂閱: 3
// multicast 示範 (1) 第二次訂閱: 3
// multicast 示範 (1) 第一次訂閱: 4
// multicast 示範 (1) 第二次訂閱: 4

// const source2$ = interval(1000).pipe(
//     take(5),
//     multicast(
//         () => new Subject(),
//         (subject) => subject.pipe(map((data: any) => data + 1)))
// );

// source2$.subscribe(data => {
//     console.log(`multicast 示範 (2) 第一次訂閱: ${data}`);
// });

// setTimeout(() => {
//     source2$.subscribe(data => {
//         console.log(`multicast 示範 (2) 第二次訂閱: ${data}`);
//     });
// }, 3000);
// multicast 示範 (2) 第一次訂閱: 1 ...0
// multicast 示範 (2) 第一次訂閱: 2 ...1000
// multicast 示範 (2) 第一次訂閱: 3 ...2000
// multicast 示範 (2) 第一次訂閱: 4 ...3000
// multicast 示範 (2) 第二次訂閱: 1 (第二次訂閱，但從頭收到所有事件資料)  ...4000
// multicast 示範 (2) 第一次訂閱: 5 ...4000
// multicast 示範 (2) 第二次訂閱: 2 ...5000
// multicast 示範 (2) 第二次訂閱: 3 ...6000
// multicast 示範 (2) 第二次訂閱: 4 ...7000
// multicast 示範 (2) 第二次訂閱: 5 ...8000

/*
publish 將 multicast 內封裝了 multicast 內建立 Subject 的方法，
直接使用 new Subject()，因此以下兩段程式碼完全一樣
*/

interval(1000).pipe(
    multicast(() => new Subject())
);

interval(1000).pipe(
    publish()
);

/*
當 Observable 是 Connectable Observable 時，
我們必須主動呼叫 connect，才可以讓資料開始流動 (當然也要有訂閱發生)，
如果不需要自行控制 connect 時機，可以使用 refCount 來幫我們呼叫 connect。
*/

// const source1$ = interval(1000).pipe(
//     take(5),
//     publish()
// );

// const source2$ = interval(1000).pipe(
//     take(5),
//     publish(),
//     refCount(),
// );

// source1$.subscribe((data) => {
//     console.log(`refCount 示範 (source1$ 訂閱值): ${data}`);
// });

// source2$.subscribe((data) => {
//     console.log(`refCount 示範 (source2$ 訂閱值): ${data}`);
// });
// refCount 示範 (source2$ 訂閱值): 0
// refCount 示範 (source2$ 訂閱值): 1
// refCount 示範 (source2$ 訂閱值): 2
// refCount 示範 (source2$ 訂閱值): 3
// refCount 示範 (source2$ 訂閱值): 4


/*
shareReplay 可以直接當作 multicast(new ReplaySubject()) 與 refCount() 的組合，
與 share() 不同的地方在於，shareReplay() 還有重播的概念，
也就是每次訂閱時，會重播過去 N 次發生的資料
*/
const source$ = interval(1000).pipe(
    shareReplay(2)
);

source$.subscribe(data => {
    console.log(`shareReplay 示範 第一次訂閱: ${data}`);
});

setTimeout(() => {
    source$.subscribe(data => {
        console.log(`shareReplay 示範 第二次訂閱: ${data}`);
    });
}, 5000);
  // shareReplay 示範 第一次訂閱: 0
  // shareReplay 示範 第一次訂閱: 1
  // shareReplay 示範 第一次訂閱: 2
  // shareReplay 示範 第一次訂閱: 3
  // shareReplay 示範 第一次訂閱: 4
  // (第二次訂閱發生時，先重播過去兩次的資料)
  // shareReplay 示範 第二次訂閱: 3
  // shareReplay 示範 第二次訂閱: 4
  // shareReplay 示範 第一次訂閱: 5
  // shareReplay 示範 第二次訂閱: 5
  // shareReplay 示範 第一次訂閱: 6
  // shareReplay 示範 第二次訂閱: 6