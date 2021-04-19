import { fromEvent, interval, of, timer } from "rxjs";
import { concatMap, exhaustMap, map, mergeMap, pairwise, scan, switchMap, take } from "rxjs/operators";
import { ajax } from 'rxjs/ajax';



/*
https://ithelp.ithome.com.tw/articles/10248366
 map 的功能到底是什麼呢？很簡單，就是把 Observable 每次「事件的值」換成「另外一個值」
*/
of(1, 2, 3, 4).pipe(
    map(value => value * 2)
).subscribe(value => console.log(`map 示範 (1): ${value}`));
// map 示範 (1): 2
// map 示範 (1): 4
// map 示範 (1): 6
// map 示範 (1): 8

const studentScore = [
    { name: '小明', score: 100 },
    { name: '小王', score: 49 },
    { name: '小李', score: 30 }
];

of(...studentScore).pipe(
    // 專注處理開根號邏輯
    map(student => ({ ...student, newScore: Math.sqrt(student.score) })),
    // 專注處理乘以十邏輯
    map(student => ({ ...student, newScore: student.newScore * 10 })),
    // 專注處理取整數
    map(student => ({ ...student, newScore: Math.ceil(student.newScore) })),
    // 專注處理判斷是否及格
    map(student => ({ ...student, pass: student.newScore >= 60 }))
).subscribe(student => {
    // 轉著處理如何顯示
    console.log(
        `map 示範 (3): ${student.name} 成績為 ${student.newScore} (${student.pass ? '及格' : '不及格'})`);
});


/*
scan
在 Observable 被訂閱時，會以「初始值」作為起始結果，並傳入累加函數中，
我們可以在這裡面做一些運算，再回傳下次使用的累加值，每次會傳的結果就被「轉換」成新的事件值
*/

const donateAmount = [100, 500, 300, 250];

const accumDonate$ = of(...donateAmount).pipe(
    scan(
        (acc, value) => acc + value, // 累加函數
        0 // 初始值
    )
);

accumDonate$.subscribe(amount => {
    console.log(`目前 donate 金額累計: ${amount}`)
});


/*

pairwise 可以將 Observable 的事件資料「成雙成對」的輸出，
這個 operator 沒有任何參數，因為他只需要 Observable 作為資料來源就足夠了
*/
of(1, 2, 3, 4, 5, 6).pipe(
    pairwise()
).subscribe(data => {
    console.log(`pairwise 示範 (1): ${data}`);
})

/*
由於不知道在沒有前一次事件值時該如何處理，因此第一次事件發生時會自動忽略，
如果有明確的規則(例如沒有上一次事件時就當作 null)，也可以改用剛剛學過的 scan 來處
*/
of(1, 2, 3, 4, 5, 6).pipe(
    scan(
        (accu, value) => ([accu === null ? null : accu[1], value]),
        null
    )
).subscribe(data => {
    console.log(data);
});

const priceHistories = [100, 98, 96, 102, 99, 105, 105];

of(...priceHistories).pipe(
    pairwise(),
    // 將資料整理成物件
    map(([yesterdayPrice, todayPrice], index) => ({
        day: index + 2,
        todayPrice,
        // 計算是否上漲下跌
        priceUp: todayPrice > yesterdayPrice,
        priceDown: todayPrice < yesterdayPrice
    })),
    // 逐步計算股價小於 100 的天數
    scan(
        (accu, value) => ({
            ...value,
            // 股價小於 100，天數 + 1
            priceBelow100Days:
                accu.priceBelow100Days + (value.todayPrice < 100 ? 1 : 0)

        }),
        {
            day: 1,
            todayPrice: 0,
            priceUp: false,
            priceDown: false,
            priceBelow100Days: 0
        }
    )
).subscribe(data => {
    console.log(`第 ${data.day} 天`);
    console.log(`本日股價: ${data.todayPrice}`);
    console.log(`本日股價 ${data.priceUp ? '上漲' : data.priceDown ? '下跌' : '持平'}`);
    console.log(`歷史股價小於 100 的有 ${data.priceBelow100Days} 天`);
});

/*
switchMap 內是一個 project function 傳入的參數為前一個 Observable 的事件值，
同時必須回傳一個 Observable；因此可以幫助我們把來源事件值換成另外一個 Observable，
而 switchMap 收到這個 Observable 後會幫我們進行訂閱的動作，再把訂閱結果當作新的事件值。
*/
// 重新整理資料流
const refresh$ = fromEvent(document.querySelector('#refresh'), 'click');

// 抓 API 的資料流
const request$ = ajax('https://api.github.com/repos/reactivex/rxjs/issues')
    .pipe(map(response => response.response));

// 用 switchMap 換成其他另一個 Observable
refresh$.pipe(

    switchMap(data => request$)

).subscribe(result => {
    updateIssues(result);
});

// 更新畫面資訊
const updateIssues = (issues: any[]) => {
    const issuesElement = document.querySelector('#issues');
    issuesElement.innerHTML = '';
    issues.forEach(issue => {
        const item = document.createElement('li');
        item.innerHTML = issue.title;
        issuesElement.append(item);
    });
}


/*
concatMap 一樣在每次事件發生時都會產生新的 Observable，
不過 concatMap 會等前面的 Observable 結束後，
才會「接續」(concat)新產生的 Observable 資料流。
*/

// interval(3000).pipe(
//     concatMap(
//         () => timer(0, 1000).pipe(take(5))
//     )
// ).subscribe(data => {
//     console.log(data);
// });

/*
mergeMap 會把所有被轉換成的 Observable 「合併」(merge)到同一條資料流內，
因此會有平行處理的概念，也就是每此轉換的 Observable 都會直接訂閱，
不會退訂上一次的 Observable，也不會等待上一次的 Observable 結束，
因此任何目前存在中的 Observable 資料流有新事件，都會被轉換成整體資料流的事件
*/
// const source1$ = timer(0, 3000);
// const getSource2 = (input) => timer(0, 1500)
//     .pipe(map(data => `資料流 ${input}: ${data}`));

// source1$.pipe(
//     mergeMap(data => getSource2(data))
// ).subscribe(result => {
//     console.log(result);
// });

/*
exhaust 有「力竭」的意思，可以把它理解成，來源 Observable 有新事件發生時，
它是沒有力氣產生新的 Observable 的；
也就是說當來源事件發生時，如果上一次轉換的 Observable 尚未結束，就不會產生新的 Observable
*/

const clicks = fromEvent(document, 'click');
const result = clicks.pipe(
    exhaustMap(ev => interval(1000).pipe(take(5)))
);
result.subscribe(x => console.log(x));