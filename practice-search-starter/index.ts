import { BehaviorSubject, combineLatest, iif, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, mapTo, scan, share, shareReplay, startWith, switchMap, take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import * as domUtils from './dom-utils';
import * as dataUtils from './data-utils';

//https://ithelp.ithome.com.tw/articles/10253675
const keyword$ = fromEvent(document.querySelector('#keyword'), 'input').pipe(
    map(event => (event.target as HTMLInputElement).value),
    startWith(''),
    shareReplay(1)
);

keyword$.pipe(
    debounceTime(700),
    // 避免重複的查詢
    distinctUntilChanged(),
    filter(keyword => keyword.length >= 3),
    switchMap(keyword => dataUtils.getSuggestions(keyword))
).subscribe(suggestions => {
    domUtils.fillAutoSuggestions(suggestions);
})

const search$ = fromEvent(document.querySelector('#search'), 'click');

// search$.pipe(
//     switchMap(() => dataUtils.getSearchResult(
//         (document.querySelector('#keyword') as HTMLInputElement).value
//     ))
// ).subscribe(result => {
//     domUtils.fillSearchResult(result);
// });

// 使用搭配 take(1) 確保只會取得一次
const keywordForSearch$ = keyword$.pipe(take(1));

const searchByKeyword$ = search$.pipe(
    switchMap(() => keywordForSearch$),
    filter(keyword => !!keyword)
);

// 依照關鍵字搜尋的基本使用方式
// searchByKeyword$.pipe(
//     switchMap(keyword => dataUtils.getSearchResult(keyword))
// ).subscribe(result => {
//     domUtils.fillSearchResult(result);
// });

//實作排序與分頁功能
// 建立 BehaviorSubject，預設使用 stars 進行降冪排序
const sortBy$ = new BehaviorSubject({ sort: 'stars', order: 'desc' });
const changeSort = (sortField: string) => {
    if (sortField === sortBy$.value.sort) {
        sortBy$.next({
            sort: sortField,
            order: sortBy$.value.order === 'asc' ? 'desc' : 'asc'
        });
    } else {
        sortBy$.next({
            sort: sortField,
            order: 'desc'
        });
    }
}

fromEvent(document.querySelector('#sort-stars'), 'click').subscribe(() => {
    changeSort('stars');
});
fromEvent(document.querySelector('#sort-forks'), 'click').subscribe(() => {
    changeSort('forks');
});

//取得每頁幾筆的事件
const perPage$ = fromEvent(document.querySelector('#per-page'), 'change').pipe(
    map(event => +(event.target as HTMLSelectElement).value)
);

//取得切換頁碼事件
const previousPage$ = fromEvent(
    document.querySelector('#previous-page'),
    'click'
).pipe(
    mapTo(-1)
);

const nextPage$ = fromEvent(
    document.querySelector('#next-page'),
    'click'
).pipe(
    mapTo(1)
);

const page$ = merge(previousPage$, nextPage$).pipe(
    scan((currentPageIndex, value) => {
        const nextPage = currentPageIndex + value;
        return nextPage < 1 ? 1 : nextPage;
    }, 1)
)



// 組合搜尋條件
const startSearch$ = combineLatest([
    searchByKeyword$,
    sortBy$,
    page$.pipe(startWith(1)),
    perPage$.pipe(startWith(10))
]);

const searchResult$ = startSearch$.pipe(
    switchMap(([keyword, sort, page, perPage]) =>
        getSearchResult(keyword, sort.sort, sort.order, page, perPage)
    ),
    share()
)

const getSearchResult = (
    keyword: string,
    sort: string,
    order: string,
    page: number,
    perPage: number
) => dataUtils.getSearchResult(keyword, sort, order, page, perPage).pipe(
    // 正常收到資料時，將資料包裝起來且 success 設成 true
    map(result => ({ success: true, message: null, data: result })),
    catchError((error) => {
        // 發生錯誤時，將資料包裝起來且 success 設成 false
        // 同時傳遞錯誤資訊，讓後續訂閱可以處理提示
        return of({
            success: false,
            message: error.response.message,
            data: []
        })
    }));
//處理畫面顯示
searchResult$.subscribe(result => {
    domUtils.fillSearchResult(result.data);
    domUtils.loaded();
});
// 處理錯誤提示
searchResult$
    .pipe(
        filter(result => !result.success)
    ).subscribe(result => {
        alert(result.message);
    });
// 顯示頁碼
page$.subscribe(page => {
    domUtils.updatePageNumber(page);
})
// 顯示 stars 排序資訊
sortBy$.pipe(filter(sort => sort.sort === 'stars')).subscribe(sort => {
    domUtils.updateStarsSort(sort);
});
// 顯示 forks 排序資訊
sortBy$.pipe(filter(sort => sort.sort === 'forks')).subscribe(sort => {
    domUtils.updateForksSort(sort);
});

// 搜尋條件一變更，就執行 domUtils.loading() 遮罩畫面
startSearch$.subscribe(() => {
    domUtils.loading();
});
