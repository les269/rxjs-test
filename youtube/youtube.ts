import { Subject } from 'rxjs';

//Subject使用next,error,complete通知當前所有訂閱者
//訂閱者決定資料處理的動作
let youtuber$ = new Subject();

youtuber$.next(1);

const observerASubscription = youtuber$.subscribe(id => console.log(`我是觀察者 A，我收到影片 ${id} 上架通知了`));

youtuber$.next(2);

const observerBSubscription = youtuber$.subscribe(id => console.log(`我是觀察者 B，我收到影片 ${id} 上架通知了`));

youtuber$.next(4);

//B訂閱者 執行退訂
observerBSubscription.unsubscribe();

youtuber$.next(4);