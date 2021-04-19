import { EMPTY, from, Subject, timer } from "rxjs";
import { distinct, distinctUntilChanged, distinctUntilKeyChanged, filter, first, last, single, take } from "rxjs/operators";
//https://ithelp.ithome.com.tw/articles/10251309


//distinct 會將 Observable 內重複的值過濾掉
from([1, 2, 3, 3, 2, 1, 4, 5])
    .pipe(distinct())
    .subscribe(data => {
        console.log(`distinct 示範 (1): ${data}`);
    });
// distinct 示範 (1): 1
// distinct 示範 (1): 2
// distinct 示範 (1): 3
// distinct 示範 (1): 4
// distinct 示範 (1): 5


/*
我們在 distinct 內加入一個 function，並回傳每個物件的 id 屬性，
將這個屬性值作為資料是否重複的判斷，
因此第四次事件的 id 在之前事件有發生過了，所以不會發生此事件。
*/
// const students = [
//     { id: 1, score: 70 },
//     { id: 2, score: 80 },
//     { id: 3, score: 90 },
//     { id: 1, score: 100 },
//     { id: 2, score: 100 }
// ];
// from(students)
//     .pipe(distinct(student => student.id))
//     .subscribe(student => {
//         console.log(`distinct 示範 (2): ${student.id} - ${student.score}`);
//     });
// distinct 示範 (2): 1 - 70
// distinct 示範 (2): 2 - 80
// distinct 示範 (2): 3 - 90

/*
distinct 內部會記錄所有發生過的事件值，
我們也可以透過再多傳入一個 Observable 的方式(參數名稱為 flushes)
來幫助我們判斷何時要清空紀錄事件值的內容，
每當這個 Observable 有新事件發生時，就會清空來源 Observable 內用來記錄資料重複的物件
*/
// const source$ = new Subject<{ id: number, score: number }>();
// const sourceFlushes$ = new Subject();
// source$
//     .pipe(distinct(student => student.id, sourceFlushes$))
//     .subscribe(student => {
//         console.log(`distinct 示範 (3): ${student.id} - ${student.score}`);
//     });

// setTimeout(() => source$.next({ id: 1, score: 70 }), 1000);
// setTimeout(() => source$.next({ id: 2, score: 80 }), 2000);
// setTimeout(() => source$.next({ id: 3, score: 90 }), 3000);
// setTimeout(() => source$.next({ id: 1, score: 100 }), 4000);
// // 在這裡清掉 Observable distinct 內記錄資料重複的物件
// setTimeout(() => sourceFlushes$.next(), 4500);
// setTimeout(() => source$.next({ id: 2, score: 100 }), 5000);
// distinct 示範 (3): 1 - 70
// distinct 示範 (3): 2 - 80
// distinct 示範 (3): 3 - 90
// (第四秒發生 {id: 1, score: 100}，因為重複，所以事件不發生)
// (清空紀錄資料重複物件)
// distinct 示範 (3): 2 - 100 (id: 2 有發生過，但紀錄已被清空，因此事件會發生)


/*
distinctUntilChanged 會過濾掉重複的事件值，直到事件資料變更為止。

也就是說，只要目前事件資料值跟上一次事件資料值一樣，
這次就事件就不會發生，若目前事件資料值跟上一次事件資料值不同時，這次事件就會發生；
*/

from([1, 1, 2, 3, 3, 1]).pipe(
    distinctUntilChanged()
).subscribe(data => {
    console.log(`distinctUntilChanged 示範 (1): ${data}`)
});
// distinctUntilChanged 示範 (1): 1
// distinctUntilChanged 示範 (1): 2
// distinctUntilChanged 示範 (1): 3
// distinctUntilChanged 示範 (1): 1

const students = [
    { id: 1, score: 70 },
    { id: 1, score: 80 },
    { id: 2, score: 90 },
    { id: 3, score: 100 }
];
from(students).pipe(
    distinctUntilChanged(
        (studentA, studentB) => studentA.id === studentB.id
    ))
    .subscribe(student => {
        console.log(
            `distinctUntilChanged 示範 (2): ${student.id} - ${student.score}`
        );
    });

// distinctUntilChanged 示範 (2): 1 - 70
// distinctUntilChanged 示範 (2): 2 - 90
// distinctUntilChanged 示範 (2): 3 - 100

/*
除此之外，distinctUntilChanged 還有第二個參數是 keySelector function，
這個 function 跟 distinct 的 keySelector 參數一樣，
是用來決定傳入的物件比較是否重複用的 key
*/
from(students).pipe(
    distinctUntilChanged(
        // compare function
        (idA, idB) => idA === idB,
        // keySelector function
        student => student.id
    )
).subscribe(student => {
    console.log(
        `distinctUntilChanged 示範 (3): ${student.id} - ${student.score}`
    );
});
// distinctUntilChanged 示範 (3): 1 - 70
// distinctUntilChanged 示範 (3): 2 - 90
// distinctUntilChanged 示範 (3): 3 - 100

/*
distinctUntilKeyChanged 跟 distinctUntilChanged 基本上非常相似，
但特別適合用在物件的某一個屬性就是比較用的關鍵值 (key) 的狀況，
以前面 distinctUntilChanged 的例子來說，
我們需要傳入比較的邏輯 (compare function)，
和決定物件 key 的邏輯 (keySelector function)，
但實際上就是比較 id 一個屬性的情況，我們就可以用 distinctUntilKeyChanged 來簡化寫法。
*/

from(students).pipe(
    distinctUntilKeyChanged('id')
).subscribe(student => {
    console.log(
        `distinctUntilKeyChanged 示範 (1): ${student.id} - ${student.score}`
    );
});
// distinctUntilKeyChanged 示範 (1): 1 - 70
// distinctUntilKeyChanged 示範 (1): 2 - 90
// distinctUntilKeyChanged 示範 (1): 3 - 100


//distinctUntilKeyChanged 還可以在再傳入一個 compare function，來決定資料是否重複
from(students).pipe(
    distinctUntilKeyChanged(
        'id',
        (idA, idB) => idA === idB
    )
).subscribe(student => {
    console.log(
        `distinctUntilKeyChanged 示範 (2): ${student.id} - ${student.score}`
    );
});
// distinctUntilKeyChanged 示範 (2): 1 - 70
// distinctUntilKeyChanged 示範 (2): 2 - 90
// distinctUntilKeyChanged 示範 (2): 3 - 100