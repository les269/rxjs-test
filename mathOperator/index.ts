import { EMPTY, of, timer } from "rxjs";
import { count, filter, first, last, max, min, reduce, scan, single, take } from "rxjs/operators";

//https://ithelp.ithome.com.tw/articles/10252416

/*
min 會判斷來源 Observable 資料的最小值，
在來源 Observable 結束後，將最小值事件資料發生在新的 Observable 上。
*/

of(5, 1, 9, 8)
    .pipe(min())
    .subscribe(data => {
        console.log(`min 示範 (1): ${data}`);
    });
// min 示範 (1): 1

of(
    { name: 'Student A', score: 80 },
    { name: 'Student B', score: 90 },
    { name: 'Student C', score: 60 },
    { name: 'Student D', score: 70 },
).pipe(
    min((studentA, studentB) => studentA.score - studentB.score)
).subscribe(student => {
    console.log(`min 示範 (2): ${student.name} - ${student.score}`);
});
// min 示範 (2): Student C - 60

/*
max 會判斷來源 Observable 資料的最大值，
在來源 Observable 結束後，將最大值事件資料發生在新的 Observable 上
*/
of(5, 1, 9, 8)
    .pipe(max())
    .subscribe(data => {
        console.log(`max 示範 (1): ${data}`);
    });
// max 示範 (1): 9

of(
    { name: 'Student A', score: 80 },
    { name: 'Student B', score: 90 },
    { name: 'Student C', score: 60 },
    { name: 'Student D', score: 70 },
).pipe(
    max((studentA, studentB) => studentA.score - studentB.score)
).subscribe(student => {
    console.log(`max 示範 (2): ${student.name} - ${student.score}`);
});
// max 示範 (2): Student B - 90

/*
count 可以用來計算來源 Observable 發生過多少次事件
*/
of(5, 1, 9, 8)
    .pipe(count())
    .subscribe(data => {
        console.log(`count 示範 (1): ${data}`);
    });
// count 示範 (1): 4

of(5, 1, 9, 8)
    .pipe(count(data => data > 5))
    .subscribe(data => {
        console.log(`count 示範 (2): ${data}`);
    });
// count 示範 (2): 2

/*
reduce 用來運算來源 Observable 彙總後的結果，
與之前介紹過的 scan 非常像，
差別在於 scan 在來源 Observable 發生事件後都會進行運算並同時在新的 Observable 上發生，
而 reduce 在來源 Observable 發生事件後，只會進行運算，但不會在新的 Observable 上發生事件，
直到來源 Observable 結束時，才在新的 Observable 上發生運算後的結果作為事件。
*/
const donateAmount = [100, 500, 300, 250];

const accumDonate$ = of(...donateAmount).pipe(
    reduce(
        (acc, value) => acc + value, // 累加函數
        0 // 初始值
    )
);

accumDonate$.subscribe(amount => {
    console.log(`目前 donate 金額累計：${amount}`)
});
// 目前 donate 金額累計：1150