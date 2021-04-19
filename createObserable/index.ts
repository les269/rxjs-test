import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { share } from 'rxjs/operators';

//Observable先決定資料流
//每個訂閱執行動作
const source$ = new Observable(subscriber => {
    console.log('stream 開始');
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.next(4);
    console.log('stream 結束');
    subscriber.complete();
});

source$.subscribe({
    next: data => console.log(`Observable 第一次訂閱: ${data}`),
    complete: () => console.log('第一次訂閱完成')
});
source$.subscribe({
    next: data => console.log(`Observable 第一次訂閱: ${data}`),
    complete: () => console.log('第一次訂閱完成')
});

//如果訂閱一開始沒資料則為預設
const source2$ = new BehaviorSubject(0);
//取代0
// source2$.next(123);
source2$.subscribe(data => console.log(`BehaviorSubject 第一次訂閱: ${data}`));
source2$.next(123);
// BehaviorSubject 第一次訂閱: 0

const source3$ = new ReplaySubject(2);

source3$.subscribe(data => console.log(`ReplaySubject 第一次訂閱: ${data}`));


source3$.next(1);
source3$.next(2);

source3$.subscribe(data => console.log(`ReplaySubject 第二次訂閱: ${data}`));

source3$.next(3);
source3$.next(4);

source3$.subscribe(data => console.log(`ReplaySubject 第三次訂閱: ${data}`));

const source4$ = new AsyncSubject();

source4$.subscribe(data => console.log(`AsyncSubject 第一次訂閱: ${data}`));

source4$.next(1);
source4$.next(2);

source4$.subscribe(data => console.log(`AsyncSubject 第二次訂閱: ${data}`));

source4$.next(3);
source4$.next(4);

source4$.subscribe(data => console.log(`AsyncSubject 第三次訂閱: ${data}`));

source4$.complete();


/*
所有的 Subject 系列都有一個共用且常用的 API，稱為 asObservable，
它的用途是將 Subject 當作 Observable 回傳，這樣有什麼好處呢？
由於 Observable 並沒有 next()、complete() 和 error() 這樣的 API，
因此可以讓得到這個 Observable 物件的程式專注在資料流訂閱相關的處理就好，
而不被允許發送新的事件，就可以將發送新事件等行為封裝起來不被外界看到啦！
*/

// 使用情境asObservable 
class Student {
    private _score$ = new Subject();

    get score$() {
        return this._score$.asObservable();
    }
    // 大於 60 分才允許推送成績事件
    updateScore(score) {
        if (score > 60) {
            this._score$.next(score);
        }
    }
}

const mike = new Student();
mike.score$.subscribe(score => {
    console.log(`目前成績：${score}`);
});

mike.updateScore(70); // 目前成績: 70
mike.updateScore(50); // (沒有任何反應)
mike.updateScore(80); // 目前成績: 80
// mike._score$.next(50); // (錯誤：next is not a function)

const source5$ = new Observable(subscriber => {
    console.log('stream 開始');
    setTimeout(() => subscriber.next(1), 100);
    setTimeout(() => subscriber.next(2), 200);
    setTimeout(() => subscriber.next(3), 300);
    setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
        console.log('steam 結束');
    }, 400);
});

const hotSource$ = source$.pipe(
    share()
);
setTimeout(() => {
    hotSource$.subscribe(data => console.log(`Observable 第一次訂閱: ${data}`));

    setTimeout(() => {
        hotSource$.subscribe(data => console.log(`Observable 第二次訂閱: ${data}`));
    }, 200);
}, 1000);