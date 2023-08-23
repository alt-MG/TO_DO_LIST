document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.getElementById('addButton');
    var todoInput = document.getElementById('todoInput');
    var todoList = document.getElementById('todoList');
  
    // Load todos from storage
    chrome.storage.sync.get('todos', function (data) {
      var todos = data.todos || [];
  
      // Display existing todos
      todos.forEach(function (todo) {
        addTodoElement(todo);
      });
    });
  
    // Add todo
    addButton.addEventListener('click', function () {
      var todoText = todoInput.value.trim();
  
      if (todoText !== '') {
        var todo = {
          id: Date.now(),
          text: todoText,
          completed: false,
        };
  
        addTodoElement(todo);
  
        // Save todo to storage
        chrome.storage.sync.get('todos', function (data) {
          var todos = data.todos || [];
          todos.push(todo);
  
          chrome.storage.sync.set({ todos: todos });
        });
  
        todoInput.value = '';
      }
    });
  
    // Add todo element to the list
    function addTodoElement(todo) {
      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', function () {
        toggleTodoCompletion(todo.id);
      });
  
      var text = document.createElement('span');
      text.innerHTML = todo.text;
      text.classList.add(todo.completed ? 'completed' : '');
  
      var deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.addEventListener('click', function () {
        deleteTodoElement(todo.id);
      });
  
      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteButton);
      todoList.appendChild(li);
    }
  
    // Toggle todo completion
    function toggleTodoCompletion(id) {
      chrome.storage.sync.get('todos', function (data) {
        var todos = data.todos || [];
  
        var todo = todos.find(function (todo) {
          return todo.id === id;
        });
  
        if (todo) {
          todo.completed = !todo.completed;
  
          chrome.storage.sync.set({ todos: todos }, function () {
            refreshTodoList();
          });
        }
      });
    }
  
    // Delete todo
    function deleteTodoElement(id) {
      chrome.storage.sync.get('todos', function (data) {
        var todos = data.todos || [];
  
        var filteredTodos = todos.filter(function (todo) {
          return todo.id !== id;
        });
  
        chrome.storage.sync.set({ todos: filteredTodos }, function () {
          refreshTodoList();
        });
      });
    }
  
    // Refresh todo list
    function refreshTodoList() {
      todoList.innerHTML = '';
  
      chrome.storage.sync.get('todos', function (data) {
        var todos = data.todos || [];
  
        todos.forEach(function (todo) {
          addTodoElement(todo);
        });
      });
    }
  });
  