
angular.module('changePurseApp', [])
  .controller('ChangePurseController', function($scope) {
    const self = this;
    self.todos = [
      {text:'learn AngularJS', done:true},
      {text:'build an AngularJS app', done:false}];

    self.calcPriceSum = function() {
      const quantity = parseFloat(self.newQuantity, 10);
      const pricePer = parseFloat(self.newPricePer, 10);
      if (!isNaN(quantity) && !isNaN(pricePer)){
        self.newPriceSum = pricePer * quantity;
      }
    };
    self.calcPricePer = function() {
      const quantity = parseFloat(self.newQuantity, 10);
      const priceSum = parseFloat(self.newPriceSum, 10);
      if (!isNaN(quantity) && !isNaN(priceSum)){
        self.newPricePer = priceSum / quantity;
      }
    };
    self.calcPrice = function(){
      self.calcPricePer();
      self.calcPriceSum();
    }

    self.addTodo = function() {
      self.todos.push({text:self.todoText, done:false});
      self.todoText = '';
    };

    self.remaining = function() {
      let count = 0;
      angular.forEach(self.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    const NAMES_URL = 'https://raw.githubusercontent.com/mpaulweeks/changepurse/master/docs/ticker_names.json';
    fetch(NAMES_URL).then(r => r.json()).then(lookup => {
      self.todos.push({
        text: lookup['ETH'],
        done: false,
      });
      $scope.$apply();
    });
  });
