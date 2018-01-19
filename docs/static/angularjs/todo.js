
angular.module('todoApp', [])
  .controller('TodoListController', function($scope) {
    var todoList = this;
    todoList.todos = [
      {text:'learn AngularJS', done:true},
      {text:'build an AngularJS app', done:false}];

    todoList.addTodo = function() {
      todoList.todos.push({text:todoList.todoText, done:false});
      todoList.todoText = '';
    };

    todoList.remaining = function() {
      var count = 0;
      angular.forEach(todoList.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    todoList.archive = function() {
      var oldTodos = todoList.todos;
      todoList.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.todos.push(todo);
      });
    };

    const NAMES_URL = 'https://raw.githubusercontent.com/mpaulweeks/changepurse/master/docs/static/ticker_names.json';
    fetch(NAMES_URL).then(r => r.json()).then(lookup => {
      todoList.todos.push({
        text: lookup['ETH'],
        done: false,
      });
      $scope.$apply();
    });
  });
