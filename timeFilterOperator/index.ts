import { fromEvent, interval, Subject, timer } from "rxjs";
import { audit, auditTime, debounce, debounceTime, map, sample, sampleTime, take, takeUntil, takeWhile } from "rxjs/operators";

//https://ithelp.ithome.com.tw/articles/10251680


/*
sampleTime 有「定期取樣」的意思，可以指定一個週期時間，
當 Observable 被訂閱時，就會依據指定的週期時間，
每經過這段時間就從來源 Observable 內取得這段時間最近一次的事件資料，
*/
// const source$ = new Subject();

// source$.pipe(
//     sampleTime(1500)
// ).subscribe(data => {
//     console.log(`sampleTime 示範: ${data}`);
// });

// setTimeout(() => source$.next(1), 0);
// setTimeout(() => source$.next(2), 500);
// setTimeout(() => source$.next(3), 1000);
// setTimeout(() => source$.next(4), 4000);
// setTimeout(() => source$.next(5), 5000);
// setTimeout(() => source$.complete(), 5500);

// sampleTime 示範: 3
// sampleTime 示範: 4


/*
sample 是單純「取樣」的意思，我們可以傳入一個 notifer 的 Observable，每 notifier 有新事件發生時，
sample 就會在來源 Observable 上取一筆最近發生過的事件值，因此透過 sample 我們可以自行決定取樣的時機點。
*/
const notifier$ = new Subject();
const source2$ = interval(1000);
source2$.pipe(
    sample(notifier$)
).subscribe(data => {
    console.log(`sample 示範: ${data}`);
});

setTimeout(() => notifier$.next(), 1500);
// sample 示範: 0
setTimeout(() => notifier$.next(), 1600);
// (沒事)
setTimeout(() => notifier$.next(), 5000);
// sample 示範: 4
/*
source$ 是每 1000 毫秒發生一次事件的 Observable
1500 毫秒時，notifier$ 發出事件，取樣一次，此時 0~1500 毫秒內來源 Observable 最後一次事件值為 0，發生在新的 Observable 上
1600 毫秒時，notifier$ 發生事件，取樣一次，此時 1501~1600 毫秒內來源 Observable 沒有任何事件發生過，因此新的 Observable 上也沒有事件發生
5000 毫秒時，notifier$ 發生事件，取樣一次，此時 1601~5000 毫秒內來源 Observable 最後一次事件值為 4，發生在新的 Observable 上
*/

/*
auditTime 運作方式跟 sampleTime 非常像，
差別在 auditTime 是依照「新事件發生後的指定時間內」來處理，
而 sampleTime 則是單純的「時間週期循環」，我們可以在 auditTime 內指定一個時間間隔，
每當來源 Observable 有新事件發生時，就會等待一段時間，當指定時間間隔到了之後，
才讓新的 Observable 發生來源 Observable 在這段時間內發生過的最後一次事件資料。
*/

interval(1000).pipe(
    auditTime(1500)
).subscribe(data => {
    console.log(`auditTime 示範: ${data}`);
});
// auditTime 示範: 1
// auditTime 示範: 3
// auditTime 示範: 5
// auditTime 示範: 7

/*
audit 和 auditTime 非常類似，
都是在一個指定的時間發生時讓來源 Observable 最近一次的事件發生在新的 Observable 上，
差別在 auditTime 是直接指定時間，
而 audit 則是傳入一個 durationSelector callback function，
audit 會將來源 Observable 事件值傳入 callback function，
同時回傳一個 Observable 或 Promise，
audit 會依此資訊來決定下次事件發生的時機

1.每當來源 Observable 發生新的事件時，就會訂閱 durationSelector 回傳的資料流
2.在durationSelector 回傳的資料流有新的事件前，來源 Observable 的事件都不會發生在新的 Observable 上
3.直到從 durationSelector 回傳的資料流發生第一次事件後，再將來源 Observable 這段時間內發生事件的「最後一筆事件值」發生在新的 Observable 上，同時退訂 duratorSelector 的資料流
4.之後等待來源資料流下一次事件發生，並重複步驟 1.
*/
// const source$ = interval(1000);
// const durationSelector = (value) => interval(value * 1200);

// source$.pipe(
//     audit(durationSelector)
// ).subscribe(data => {
//     console.log(`audit 示範: ${data}`);
// });
// audit 示範: 0
// audit 示範: 2
// audit 示範: 6
// ...
/*
1.source$ 發生事件 0，同時 audit() 內訂閱 interval(0)，因此直接讓 0 在新的 Observable 上發生，並退訂 interval(0)。
2.source$ 發生事件 1，此時 audit() 內訂閱 interval(1200)，因此在 1200 毫秒後，將來源 Observable 最後一次事件值，也就是事件資料 2，發生在新的 Observable 上。
3.source$ 發生事件 3，此時 audit() 內訂閱 interval(3600)，因此在 3600 毫秒後，將來源 Observable 最後一次事件值，也就是事件資料 6，發生在新的 Observable 上。
*/

/*
debounceTime 可以指定一個時間間隔，
當來源 Observable 有新事件資料發生時，會等待這段時間，
如果這段時間內沒有新的事件發生，將這個資料值發生在新的 Observable 上；
如果在這段等待時間有新的事件發生，則原來事件不會發生在新的資料流上，並持續等待。
*/
// const source$ = new Subject();

// source$.pipe(
//     debounceTime(500)
// ).subscribe(data => {
//     console.log(`debounceTime 示範: ${data}`);
// });

// setTimeout(() => source$.next(1), 0);
// setTimeout(() => source$.next(2), 100);
// setTimeout(() => source$.next(3), 200);
// setTimeout(() => source$.next(4), 800);
// setTimeout(() => source$.next(5), 1200);
// setTimeout(() => source$.next(6), 1800);
// setTimeout(() => source$.complete(), 2000);

// debounceTime 示範: 3
// debounceTime 示範: 5
// debounceTime 示範: 6
/*
1.source$ 發生事件 1，此時新的 Observable 不會發生新事件，而是繼續等待 500 毫秒
2.在 500 毫秒內 source$ 就發生了事件 2，因此事件 1 不會發生在新的 Observable 上，且繼續等待 500 毫秒
3.在 500 毫秒內 source$ 就發生了事件 3，因此事件 2 不會發生在新的 Observable 上，且繼續等待 500 毫秒
4.500 毫秒後沒有新的事件，因此讓新的 Observable 發生事件 3
5.source$ 接著發生事件 4，一樣等待 500 毫秒內是否有新事件
6.在 500 毫秒內 source$ 就發生了事件 5，因此事件 4 不會發生在新的 Observable 上，且繼續等待 500 毫秒
7.500 毫秒後沒有新的事件，因此讓新的 Observable 發生事件 5
8.source$ 的事件 6 發生後 200 毫秒時結束了 Observable，因此確定 500 毫秒內不會發生新事件，因此新的 Observable 發生事件 6，同時也結束新的 Observable
*/

/*
debounce 和 debounceTime 都是在一個指定時間內沒有新事件才會讓此事件值發生，
差別在於 debounce 可以傳入 durationSelector 的 callback function，
debounce 會將來源 Observable 事件值傳入 durationSelector，
並回傳一個用來控制時機的 Observable 或 Promise，
debounce 會依照此資訊來決定下次事件發生的時機點。
這和之前介紹的 audit 很像，只是處理時機點不同
*/
const source$ = interval(3000);
const durationSelector = (value) => interval(value * 1000);

source$.pipe(
    debounce(durationSelector)
).subscribe(data => {
    console.log(`debounce 示範: ${data}`);
});
// debounce 示範: 0
// debounce 示範: 1
// debounce 示範: 2

/*
1.source$ 發生事件 0，訂閱 interval(0)，此時不會有任何新事件，因此新的 Observable 會發生事件 0
2.source$ 發生事件 1 ，訂閱 interval(1000)，下一個事件在 1000 毫秒內沒有發生，因此新的 Observable 會發生事件 1
3.source$ 發生事件 2 ，訂閱 interval(2000)，下一個事件在 2000 毫秒內沒有發生，因此新的 Observable 會發生事件 2
4.source$ 發生事件 3 ，訂閱 interval(3000)，而下個事件會在 3000 毫秒內發生，因此事件 3 不會在新的 Observable 上發生
5.由於接下來都需要超過 3000 毫秒沒新事件才可以在新的 Observable 上發生，但來源 Observable 每 3000 毫秒都會發新的事件值，因此新的 Observable 不再有機會發生新的事件
*/