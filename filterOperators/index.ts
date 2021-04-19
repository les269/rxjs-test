import { EMPTY, timer } from "rxjs";
import { filter, first, last, single, take } from "rxjs/operators";


/*
filter 是最常用的「過濾類型」的 operator，用法也非常簡單，
跟陣列的 filter 是一樣的，傳入一個 callback function，
在裡面寫入指定的條件，每當來源資料流事件的資料符合 callback function 內的條件時
*/
// const source$ = timer(0, 1000).pipe(take(10));
// source$.pipe(
//     filter(data => data > 3)
// ).subscribe(data => {
//     console.log(`filter 範例 (1): ${data}`);
// });

/*
first 顧名思義，就是取得第一筆資料，
因此當 Observable 訂閱後，資料流的第一次事件發生時，會得到這個事件資料，然後結束。
*/
// const source$ = timer(0, 1000).pipe(take(10));

// source$.pipe(
//     first()
// ).subscribe(data => {
//     console.log(`filter 範例 (1): ${data}`);
// });

/*
last 跟 first 相反，last 是取整個來源資料流「最後一次發生的事件」，
因此原來的資料流一定要有「結束」(complete) 發生
*/

// const source$ = timer(0, 1000).pipe(take(10));

// source$.pipe(
//   last()
// )
// .subscribe(data => {
//   console.log(`last 範例 (1): ${data}`);
// });

// const source$ = timer(0, 1000).pipe(take(10));

// source$.pipe(
//   last(data => data < 3)
// )
// .subscribe(data => {
//   console.log(`last 範例 (2): ${data}`);
// });

/*
single 比較特殊，它可以幫助我們「限制」整個資料流只會有一次事件發生，
當發生第二次事件時，就會發生錯誤
*/
timer(0, 1000).pipe(
    take(10),
    single()
).subscribe({
    next: data => {
        console.log(`single 範例 (1): ${data}`);
    },
    error: (err) => {
        console.log(`single 發生錯誤範例 (1): ${err}`)
    }
});
// single 發生錯誤範例 (1): Sequence contains more than one element

//要確認是否只有一次事件，當然要等資料流結束才會確認是否會發生錯誤喔！
//如果整個資料流沒有事件就結束呢？也算是不符合「發生一次事件」的條件，因此一樣會發生錯誤
EMPTY.pipe(
    single()
).subscribe({
    next: data => {
        console.log(`single 範例 (3): ${data}`);
    },
    error: (err) => {
        console.log(`single 發生錯誤範例 (3): ${err}`)
    }
});
// single 發生錯誤範例 (3): EmptyError: no elements in sequence

/*
single 也一樣可以傳入 callback function，此時條件會變成「在條件符合時，
如果整個資料流只發生過一次事件，發生該事件的值，否則發生 undefined，然後結束」
*/
timer(1000).pipe(
    take(5),
    single(data => data === 0)
).subscribe({
    next: data => {
        console.log(`single 範例 (4): ${data}`);
    },
    error: (err) => {
        console.log(`single 發生錯誤範例 (4): ${err}`)
    },
    complete: () => {
        console.log('single 範例結束 (4)');
    }
});
// single 範例 (4): 0
// single 範例結束 (4)

//如果在符合條件前就發生超過兩次事件；或符合條件時已經是第二次事件，就會得到 undefined
timer(1000).pipe(
    take(5),
    single(data => data === 1)
).subscribe({
    next: data => {
        console.log(`single 範例 (5): ${data}`);
    },
    error: (err) => {
        console.log(`single 發生錯誤範例 (5): ${err}`)
    },
    complete: () => {
        console.log('single 範例結束 (5)');
    }
});
// single 範例 (5): undefined
// single 範例結束 (5)