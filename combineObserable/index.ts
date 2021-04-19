import { combineLatest, concat, forkJoin, interval, merge, of, partition, race, zip, } from "rxjs";
import { map, take } from 'rxjs/operators'

/*
concat 可以將數個 Observables 組合成一個新的 Observable，
並且在每個 Observable 結束後才接續執行下一個 Observable
*/

// const sourceA$ = of(1, 2);
// const sourceB$ = of(3, 4);
// const sourceC$ = of(5, 6);

// concat(sourceA$, sourceB$, sourceC$)
//     .subscribe(data => {
//         console.log(data);
//     });

/*
merge 跟 concat 類似，但會同時啟動參數內所有的 Observable，因此會有「平行處理」的感覺
*/

// const sourceA$ = interval(1000).pipe(
//     map(data => `A${data}`)
// );

// const sourceB$ = interval(3000).pipe(
//     map(data => `B${data}`)
// );

// const sourceC$ = interval(5000).pipe(
//     map(data => `C${data}`)
// );

// const subscription = merge(sourceA$, sourceB$, sourceC$)
//     .subscribe(data => {
//         console.log(`merge 範例： ${data}`)
//     });

/*
zip 是拉鍊的意思，拉鍊是把兩個鏈條合併在一起，且資料是「一組一組合併在一起的」，
實際上在使用時，zip 會將傳入的 Observables 依次組合在一起成為一個陣列，已經被組合過的就不會再次被組合
*/
// const sourceA$ = interval(1000).pipe(
//     map(data => `A${data + 1}`)
// );
// const sourceB$ = interval(2000).pipe(
//     map(data => `B${data + 1}`)
// );
// const sourceC$ = interval(3000).pipe(
//     map(data => `C${data + 1}`)
// );

// zip(sourceA$, sourceB$, sourceC$).subscribe(data => {
//     console.log(`zip 範例: ${data}`)
// });


/*

前面介紹的都是將多個 Observable 組合成一條新的 Observable，
只是順序和處理資料的方式不同，而 partition 則是將 Observable 
依照規則拆成兩條 Observable。partition 需要兩個參數：

source: 來源 Observable
predicate: 用來拆分的條件，是一個 function，
每次事件發生都會將資料傳入此 function，並會傳是否符合條件 (true/false)，
符合條件的(true)會被歸到一條 Observable，不符合條件的則被歸到另外一條 Observable。
*/
// const source$ = of(1, 2, 3, 4, 5, 6);

// const [sourceEven$, sourceOdd$] = partition(
//     source$,
//     (data) => data % 2 === 0
// );

// sourceEven$
//   .subscribe(data => console.log(`partition 範例 (偶數): ${data}`));
// sourceOdd$
//   .subscribe(data => console.log(`partition 範例 (奇數): ${data}`));


/*
https://ithelp.ithome.com.tw/articles/10247915
combineLatest 跟昨天介紹過的 zip 非常像，差別在於 zip 會依序組合，
而 combineLatest 會在資料流有事件發生時，直接跟目前其他資料流的「最後一個事件」組合在一起，
也因此這個 operator 是 latest 結尾，另一個不同的地方是，
combineLatest 內的參數是一個 Observable 陣列，訂閱後會把陣列內的這些 Observables 組合起來
*/
// const sourceA$ = interval(1000).pipe(
//     map(data => `A${data + 1}`)
// );
// const sourceB$ = interval(2000).pipe(
//     map(data => `B${data + 1}`)
// );
// const sourceC$ = interval(3000).pipe(
//     map(data => `C${data + 1}`)
// );

// const subscription = combineLatest([sourceA$, sourceB$, sourceC$])
//     .subscribe(data => console.log(`combineLatest 範例: ${data}`));
// combineLatest 範例: A3,B1,C1
// combineLatest 範例: A4,B1,C1
// combineLatest 範例: A4,B2,C1
// combineLatest 範例: A5,B2,C1
// combineLatest 範例: A6,B2,C1
// combineLatest 範例: A6,B3,C1
// combineLatest 範例: A6,B3,C2
// combineLatest 範例: A7,B3,C2
// combineLatest 範例: A8,B3,C2
// combineLatest 範例: A8,B4,C2
// combineLatest 範例: A9,B4,C2
// combineLatest 範例: A9,B4,C3
/*
https://ithelp.ithome.com.tw/articles/10247915
forkJoin 會同時訂閱傳入的 Observables，
直到每個 Observable 都「結束」後，將每個 Observable 的「最後一筆值」組合起來
*/

// const sourceA$ = interval(1000).pipe(
//     map(data => `A${data + 1}`),
//     take(5)
// );
// const sourceB$ = interval(2000).pipe(
//     map(data => `B${data + 1}`),
//     take(4)
// );
// const sourceC$ = interval(3000).pipe(
//     map(data => `C${data + 1}`),
//     take(3)
// );

// forkJoin([sourceA$, sourceB$, sourceC$]).subscribe({
//     next: data => console.log(`forkJoin 範例: ${data}`),
//     complete: () => console.log('forkJoin 結束')
// });

/*
https://ithelp.ithome.com.tw/articles/10247915
race 本身就有「競速」的意思，因此這個 operator 接受的參數一樣是數個 Observables，
當訂閱發生時，這些 Observables 會同時開跑，當其中一個 Observable 率先發生事件後，
就會以這個 Observable 為主，並退訂其他的 Observables，也就是先到先贏，其他都是輸家
*/

const sourceA$ = interval(1000).pipe(
    map(data => `A${data + 1}`)
);
const sourceB$ = interval(2000).pipe(
    map(data => `B${data + 1}`)
);
const sourceC$ = interval(3000).pipe(
    map(data => `C${data + 1}`)
);

const subscription = race([sourceA$, sourceB$, sourceC$])
    .subscribe(data => console.log(`race 範例: ${data}`));
// A1
// A2
// A3
// ... (因為 sourceA$ 已經先到了，其他 Observables 就退訂不處理)