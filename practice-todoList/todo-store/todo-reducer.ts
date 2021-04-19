import { concat, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TodoActionTypes } from './todo-action-types';

export const todoReducer = (currentState, action) => {
  switch (action.type) {
    case TodoActionTypes.LoadTodoItems: {
      const loadingState = { ...currentState, loading: true };
      const loadingState$ = of(loadingState);

      const newState = { ...currentState };
      newState.todos = [
        ...newState.todos,
        { id: 1, name: 'Todo Item 1', done: false },
        { id: 2, name: 'Todo Item 2', done: true },
        { id: 3, name: 'Todo Item 3', done: false }
      ];
      const newState$ = of(newState).pipe(delay(1000));

      return concat(loadingState$, newState$);
      break;
    }
    case TodoActionTypes.AddTodoItem:
      const loadingState = { ...currentState, loading: true };
      const loadingState$ = of(loadingState);

      const newState = {
        ...currentState,
        todos: [
          ...currentState.todos,
          {
            id: currentState.todos.length + 1,
            name: action.payload,
            done: false
          }
        ],
        loading: false
      };
      const newState$ = of(newState).pipe(delay(500));

      return concat(loadingState$, newState$);
      break;
    case TodoActionTypes.ToggleTodoItem: {
      const loadingState = { ...currentState, loading: true };
      const loadingState$ = of(loadingState);

      const newState = {
        ...currentState,
        todos: currentState.todos.map(todo => ({
          ...todo,
          done: +action.payload === todo.id ? !todo.done : todo.done
        })),
        loading: false
      };
      const newState$ = of(newState).pipe(delay(500));

      return concat(loadingState$, newState$);
      break;
    }
  }

  // 如果沒有可以處理的 action type，直接回傳原來的內容
  return of(currentState);
};
