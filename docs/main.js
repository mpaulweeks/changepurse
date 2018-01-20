
// ?BTC=2|900&ETH=5|200

let SCOPE = null;
let NAME_LOOKUP = null;
let CURRENCY_PROMISE = {};
let idCounter = 0;

function calcGainPercent(priceSum, marketSum){
  return (100 * marketSum / priceSum) - 100;
}
function gainStyle(gain){
  if (gain === null){
    return '';
  }
  const rgb = gain > 0 ? '144, 238, 144' : '250, 128, 114';
  const relativeGain = Math.abs(gain * 4 / 100);
  const rgba = `rgba(${rgb}, ${relativeGain})`;
  return `background-color: ${rgba};`;
}

function forceDec(num, maxPlaces) {
  if (num === null || num === undefined){
    return '';
  } else {
    return num.toFixed(maxPlaces);
  }
};
function atleastDec(num, minPlaces) {
  const forced = forceDec(num, minPlaces);
  const numStr = '' + num;
  if (forced.length > numStr.length){
    return forced;
  } else {
    return numStr.substring(0, 8);
  }
};

function newHolding(controller, symbol, quantity, pricePer){
  quantity = parseFloat(quantity, 10);
  pricePer = parseFloat(pricePer, 10);
  let self = {
    id: idCounter++,
    symbol: symbol,
    name: NAME_LOOKUP[symbol] || symbol,
    quantity: quantity,
    pricePer: pricePer,
    priceSum: pricePer * quantity,
    serialize: () => {
      return symbol + '=' + [quantity, pricePer].join('|');
    },
  };
  const promise = getCurrency(symbol).then(ticker => {
    const data = ticker[0];
    const marketPer = parseFloat(data.price_usd, 10);
    const marketSum = self.quantity * marketPer;
    const gainPercent = calcGainPercent(self.priceSum, marketSum);
    Object.assign(self, {
      marketPer: marketPer,
      marketSum: marketSum,
      gainPercent: gainPercent,
      gainStyle: gainStyle(gainPercent),
    });
    controller.calcTotal();
    SCOPE.$apply();
  });
  return self;
}

function getTimestamp(){
  return Math.floor((new Date()).getTime() / (60 * 1000));
}
function fetchCurrency(symbol){
  const tickerName = NAME_LOOKUP[symbol];
  const safeTickerName = tickerName.replace(' ', '-');
  const url = `https://api.coinmarketcap.com/v1/ticker/${safeTickerName}/?v=${getTimestamp()}`;
  return fetch(url).then(r => r.json());
}
function getCurrency(symbol){
  CURRENCY_PROMISE[symbol] = CURRENCY_PROMISE[symbol] || fetchCurrency(symbol);
  return CURRENCY_PROMISE[symbol];
}

angular.module('changePurseApp', [])
  .controller('ChangePurseController', function($scope) {
    SCOPE = $scope;

    const self = this;
    self.holdings = [];
    self.total = [{}];
    self.forceDec = forceDec;
    self.atleastDec = atleastDec;

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

    self.calcTotal = function(){
      let pending = false;
      let priceSum = 0;
      let marketSum = 0;
      self.holdings.forEach(curr => {
        if (curr.gainPercent === undefined){
          pending = true;
        } else {
          priceSum += curr.priceSum;
          marketSum += curr.marketSum;
        }
      });
      if (!pending){
        const gainPercent = calcGainPercent(priceSum, marketSum);
        const newTotal = {
          priceSum: priceSum,
          marketSum: marketSum,
          gainPercent: gainPercent,
          gainStyle: gainStyle(gainPercent),
        };
        self.total = [newTotal];
      }
    }

    self.addTodo = function() {
      self.holdings.push(newHolding(
        self,
        self.newSymbol,
        self.newQuantity,
        self.newPricePer
      ));
      self.newSymbol = '';
      self.newQuantity = '';
      self.newPricePer = '';
      self.newPriceSum = '';
      self.setQueryParams();
    };

    self.setQueryParams = function(){
      const params = self.holdings.map(curr => {
        return `${curr.symbol}=${curr.quantity}|${curr.pricePer}`;
      });
      window.history.replaceState({}, "", "?" + params.join('&'));
    }

    const NAMES_URL = 'https://raw.githubusercontent.com/mpaulweeks/changepurse/master/ticker_names.json';
    fetch(NAMES_URL).then(r => r.json()).then(lookup => {
      NAME_LOOKUP = lookup;
      window.location.search.split('?')[1].split('&').forEach(seg => {
        const parts = seg.split('=');
        const values = parts[1].split('|');
        const symbol = parts[0];
        const quantity = values[0];
        const pricePer = values[1];
        self.holdings.push(newHolding(self, symbol, quantity, pricePer));
      });
      SCOPE.$apply();
    });
  });
