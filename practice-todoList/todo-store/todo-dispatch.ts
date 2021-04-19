import { from, of } from 'rxjs';
import { todoReducer } from './todo-reducer';
import { store$ } from './todo-store';

// TODO: 完成 dispatcher 邏輯
// dispatcher 會把目前資料以及 action 傳入 reducer
// 之後使用 store$.next() 將 reducer 回傳的內容變成一個 Observable 的事件
export const todoDispatcher = action => {
    from(todoReducer(store$.value, action)).subscribe({
        next: (data: any) => store$.next(data),
        error: data => store$.error(data)
    });
};