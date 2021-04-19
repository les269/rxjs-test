import { EMPTY, interval, Subject } from "rxjs";
import { defaultIfEmpty, every, find, findIndex, isEmpty, map, take } from 'rxjs/operators';

//https://ithelp.ithome.com.tw/articles/10252102

/*
isEmpty 會判斷來源 Observable 是否沒有「發生過任何事件值」，
如果到結束時完全沒有任何事件發生過，則會發生 true 事件在新的 Observable 上，
反之則新的 Observable 會發生 false 事件。
*/

EMPTY
    .pipe(isEmpty())
    .subscribe(data => {
        console.log(`isEmpty 示範 (1): ${data}`)
    });
// isEmpty 示範 (1): true

// const emptySource$ = new Subject();
// emptySource$
//   .pipe(isEmpty())
//   .subscribe(data => {
//     console.log(`isEmpty 示範 (2): ${data}`)
//   });
// setTimeout(() => emptySource$.complete(), 2000);
// isEmpty 示範 (2): true

/*
defaultIfEmpty 會在 Observable 沒有任何事件發生就結束時，給予一個預設值
*/

const emptySource$ = new Subject();
const a: any = 'a';
emptySource$
    .pipe(defaultIfEmpty(a))
    .subscribe(data => {
        console.log(`defaultIfEmpty 示範 (1): ${data}`)
    });
setTimeout(() => emptySource$.complete(), 2000);
// defaultIfEmpty 示範 (1): a

interval(1000)
    .pipe(
        take(3),
        defaultIfEmpty(-1) // 因為來源 Observable 有事件值，因此不做任何事情
    )
    .subscribe(data => {
        console.log(`defaultIfEmpty 示範 (2): ${data}`);
    });
// defaultIfEmpty 示範 (2): 0
// defaultIfEmpty 示範 (2): 1
// defaultIfEmpty 示範 (2): 2

/*
find 內需要傳入一個 predicate callback function，
find 會將事件資訊傳入此 function，並回傳是否符合指定的條件，
如果符合，就會將目前的事件資料發生在新的 Observable 上，同時完成 Observable。
*/

interval(1000)
    .pipe(find(data => data === 3))
    .subscribe(data => {
        console.log(`find 示範: ${data}`);
    });
// find 示範: 3

/*
findIndex 與 find 一樣需要一個 predicate callback function，
差別在於 findIndex 的條件符合時，新的 Observable 事件資料是「符合條件事件的索引值」，
也就是這個事件是來源 Observable 的第幾次事件
*/
interval(1000)
    .pipe(
        map(data => data * 2),
        findIndex(data => data === 6)
    )
    .subscribe(data => {
        console.log(`findIndex 示範: ${data}`);
    });
// findIndex 示範: 3

/*
every 也是傳入一個 predicate callback function，
every 會將事件資訊傳入此 function，
並判斷來源 Observable 是否「全部符合指定條件」，
如果符合，在來源 Observable 結束時會得到 true 事件；
如果不符合，則會在事件資料不符合指定條件同時得到 false 事件並結束。
*/
const source$ = interval(1000)
    .pipe(
        map(data => data * 2),
        take(3)
    );

source$
    .pipe(
        every(data => data % 2 === 0)
    )
    .subscribe(data => {
        console.log(`every 示範 (1): ${data}`);
    });
// every 示範 (1): true