
angular.module('changePurseApp', [])
  .controller('ChangePurseController', function($scope) {
    const self = this;
    self.holdings = [];

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

    const NAMES_URL = 'https://raw.githubusercontent.com/mpaulweeks/changepurse/master/docs/ticker_names.json';
    fetch(NAMES_URL).then(r => r.json()).then(lookup => {
      let idCounter = 0;
      function newHolding(symbol, quantity, pricePer){
        return {
          id: idCounter++,
          symbol: symbol,
          name: lookup[symbol] || symbol,
          quantity: quantity,
          pricePer: pricePer,
          priceSum: pricePer * quantity,
          serialize: () => {
            return symbol + '=' + [quantity, pricePer].join('|');
          },
        };
      }
      self.holdings.push(newHolding('BTC', 2.1, 15000));
      $scope.$apply();
    });
  });
