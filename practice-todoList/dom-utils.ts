export const updateTodoList = (todos: any[]) => {
  const todoListElement = document.querySelector('#todoList');
  todoListElement.innerHTML = '';
  const newContent = todos.map(todoItem => {
    return `
      <li>
        <label>
          <input 
            class="toggleTodoItem form-check-input"
            type="checkbox"
            value="${todoItem.id}"
            ${todoItem.done ? 'checked' : ''} />
          <span
            style="text-decoration: ${todoItem.done ? 'line-through' : 'none'}">
            ${todoItem.name}
          </span>
        </label>
      </li>
      `;
  }).join('');
  todoListElement.innerHTML = newContent;
};

export const updateTotalTodos = (data: number) => {
  document.querySelector('#totalTodos').innerHTML = data.toString();
};

export const updateCompleteTodos = (data: number) => {
  document.querySelector('#completedTodos').innerHTML = data.toString();
}

export const updateLoadingState = (loading: boolean) => {
  document.querySelector('#loadingState').innerHTML = loading ? 'loading...' : '';
}