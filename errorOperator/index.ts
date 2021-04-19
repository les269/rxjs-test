import { EMPTY, iif, interval, of, throwError, timer } from "rxjs";
import { finalize, map, retry, retryWhen, switchMap, take } from "rxjs/operators";

//https://ithelp.ithome.com.tw/articles/10253241

/*
catchError 可以在來源 Observable 發生錯誤時，
進行額外的處理，一般來說發生錯誤時，都是在訂閱時使用處理
*/
// interval(1000)
//     .pipe(
//         map(data => {
//             if (data % 2 === 0) {
//                 return data;
//             } else {
//                 throw new Error('發生錯誤');
//             }
//         }),
//         catchError(error => {
//             return interval(1000);
//         }),
//         map(data => data * 2)
//     )
//     .subscribe({
//         next: data => {
//             console.log(`catchError 示範 (2): ${data}`);
//         },
//         error: error => {
//             console.log(`catchError 示範 (2): 錯誤 - ${error}`);
//         }
//     });
// catchError 示範 (2): 0
// (這時候來源 Observable 發生錯誤，用另一個 Observable 取代)
// (以下是錯誤處理後新的 Observable)
// catchError 示範 (2): 0
// catchError 示範 (2): 2
// catchError 示範 (2): 4


// interval(1000)
//     .pipe(
//         switchMap(data => iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
//         catchError(error => {
//             if (error === null) {
//                 return interval(1000);
//             }
//             return throwError(error);
//         })
//     )
//     .subscribe({
//         next: data => {
//             console.log(`catchError 示範 (3): ${data}`);
//         },
//         error: error => {
//             console.log(`catchError 示範 (3): 錯誤 - ${error}`);
//         }
//     });
// catchError 示範 (3): 0
// catchError 示範 (3): 錯誤 - Error: 發生錯誤
// (發生錯誤，整個資料流中斷)


/*
當 Observable 發生錯誤時，可以使用 retry 來重試整個 Observable，在 retry 內可以指定重試幾次
*/
// interval(1000)
//     .pipe(
//         switchMap(data =>
//             iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
//         map(data => data + 1),
//         retry(3),
//     )
//     .subscribe({
//         next: data => {
//             console.log(`retry 示範 (1): ${data}`);
//         },
//         error: error => {
//             console.log(`retry 示範 (1): 錯誤 - ${error}`);
//         }
//     });
// retry 示範 (1): 1
// (發生錯誤，重試第 1 次)
// retry 示範 (1): 1
// (發生錯誤，重試第 2 次)
// retry 示範 (1): 1
// (發生錯誤，重試第 3 次)
// retry 示範 (1): 1
// (發生錯誤，已經重試 3 次了，不在重試，直接讓錯誤發生)
// retry 示範 (1): 錯誤 - 發生錯誤

/*
retryWhen 也可以再發生錯誤時進行重試，但 retryWhen 更有彈性，
在 retryWhen 內需要設計一個 notifier callback function，
retryWhen 會將錯誤資訊傳入 notifier function，同時需要回傳一個 Observable，
retryWhen 會訂閱這個 Observable，每當有事件發生時，就進行重試，
直到這個回傳的 Observable 結束，才停止重試。
*/

// interval(1000)
//     .pipe(
//         switchMap(data =>
//             iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
//         map(data => data + 1),
//         retryWhen((error) => interval(3000).pipe(take(3)))
//     )
//     .subscribe({
//         next: data => {
//             console.log(`retryWhen 示範 (1): ${data}`);
//         },
//         error: error => {
//             console.log(`retryWhen 示範 (1): 錯誤 - ${error}`);
//         },
//         complete: () => {
//             console.log('retryWhen 示範 (1): 完成');
//         }
//     });
// retryWhen 示範 (1): 1
// retryWhen 示範 (1): 1
// retryWhen 示範 (1): 1
// (重試的 Observable 完成，因此整個 Observable 也完成)
// retryWhen 示範 (1): 完成

// const retryTimesThenThrowError = (every, times) => interval(every).pipe(
//     switchMap((value, index) =>
//         iif(() => index === times, throwError('重試後發生錯誤'), of(value)))
// );

// interval(1000)
//     .pipe(
//         switchMap(data =>
//             iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
//         map(data => data + 1),
//         retryWhen((error) => retryTimesThenThrowError(3000, 3))
//     )
//     .subscribe({
//         next: data => {
//             console.log(`retryWhen 示範 (2): ${data}`);
//         },
//         error: error => {
//             console.log(`retryWhen 示範 (2): 錯誤 - ${error}`);
//         },
//         complete: () => {
//             console.log('retryWhen 示範 (2): 完成');
//         }
//     });
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 錯誤 - 重試後發生錯誤

/*
finalize 會在整個來源 Observable 結束時，才進入處理，因此永遠會在最後才呼叫到
*/
interval(1000)
    .pipe(
        take(5),
        finalize(() => {
            console.log('finalize 示範 (1): 在 pipe 內的 finalize 被呼叫了')
        }),
        map(data => data + 1),
    ).subscribe({
        next: data => {
            console.log(`finalize 示範 (1): ${data}`);
        },
        complete: () => {
            console.log(`finalize 示範 (1): 完成`);
        }
    });
// finalize 示範 (1): 1
// finalize 示範 (1): 2
// finalize 示範 (1): 3
// finalize 示範 (1): 4
// finalize 示範 (1): 5
// finalize 示範 (1): 完成
// finalize 示範 (1): 在 pipe 內的 finalize 被呼叫了