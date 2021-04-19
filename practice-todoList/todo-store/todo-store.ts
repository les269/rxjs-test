
import { BehaviorSubject } from 'rxjs';

// TODO: 建立基本的 Store
export interface TodoState {
    loading: boolean;
    todos: {
        id: number;
        name: string;
        done: boolean;
    }[]
}

export const store$ = new BehaviorSubject<TodoState>({
    loading: false,
    todos: []
});