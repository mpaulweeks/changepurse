
// ?BTC=2|900&ETH=5|200&XRP=1000|2

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
  if (forced === ''){
    return forced;
  }
  const numStr = '' + num;
  if (forced.length > numStr.length){
    return forced;
  } else {
    return numStr.substring(0, 8);
  }
};

function getTimestamp(){
  return Math.floor((new Date()).getTime() / (60 * 1000));
}

angular.module('changePurseApp', ['ngSanitize', 'ui.select', 'chart.js'])
  .controller('ChangePurseController', function($scope) {
    const self = this;
    self.holdings = [];
    self.total = [{}];
    self.forceDec = forceDec;
    self.atleastDec = atleastDec;

    // ui.select
    self.currencies = [];
    self.newSelected = null;

    // chart.js
    self.charts = {
      labels: [],
      invest: [],
      market: [],
      options: {
        legend: {
          display: true,
        },
      },
    };

    const promises = {};
    let marketplace = null;
    let idCounter = 0;

    function refreshView(){
      updateCharts();
      $scope.$apply();
    }

    function fetchCurrency(symbol){
      const tickerName = marketplace[symbol];
      const safeTickerName = tickerName.replace(' ', '-');
      const url = `https://api.coinmarketcap.com/v1/ticker/${safeTickerName}/?v=${getTimestamp()}`;
      return fetch(url).then(r => r.json());
    }
    function getCurrency(symbol){
      promises[symbol] = promises[symbol] || fetchCurrency(symbol);
      return promises[symbol];
    }

    function newHolding(symbol, quantity, pricePer){
      quantity = parseFloat(quantity, 10);
      pricePer = parseFloat(pricePer, 10);
      const id = idCounter++;
      const hold = {
        id: id,
        symbol: symbol,
        name: marketplace[symbol] || symbol,
        quantity: quantity,
        pricePer: pricePer,
        priceSum: pricePer * quantity,
        serialize: () => {
          return symbol + '=' + [quantity, pricePer].join('|');
        },
        remove: () => removeHolding(id),
      };
      const promise = getCurrency(symbol).then(ticker => {
        const data = ticker[0];
        const marketPer = parseFloat(data.price_usd, 10);
        const marketSum = hold.quantity * marketPer;
        const gainPercent = calcGainPercent(hold.priceSum, marketSum);
        Object.assign(hold, {
          marketPer: marketPer,
          marketSum: marketSum,
          gainPercent: gainPercent,
          gainStyle: gainStyle(gainPercent),
        });
        calcTotal();
      });
      self.holdings.push(hold);
    }

    function calcTotal(){
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
      refreshView();
    }

    function removeHolding(id){
      const newHoldings = [];
      self.holdings.forEach(curr => {
        if (curr.id !== id){
          newHoldings.push(curr);
        }
      });
      self.holdings = newHoldings;
      setQueryParams();
      calcTotal();
    }

    function setQueryParams(){
      const params = self.holdings.map(curr => curr.serialize());
      window.history.replaceState({}, "", "?" + params.join('&'));
    }

    function updateCharts(){
      const newCharts = {
        labels: [],
        invest: [],
        market: [],
      };
      self.holdings.forEach(curr => {
        newCharts.labels.push(curr.symbol);
        newCharts.invest.push(curr.priceSum);
        newCharts.market.push(curr.marketSum);
      });
      Object.assign(self.charts, newCharts);
    }

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

    self.addCurrency = function() {
      if (!(self.newSelected && self.newQuantity && self.newPricePer)){
        return;
      }
      newHolding(
        self.newSelected.symbol,
        self.newQuantity,
        self.newPricePer
      );
      self.newSelected = null;
      self.newQuantity = '';
      self.newPricePer = '';
      self.newPriceSum = '';
      setQueryParams();
    };

    const NAMES_URL = 'coinmarketcap.json';
    fetch(NAMES_URL).then(r => r.json()).then(data => {
      marketplace = data.coins;
      self.currencies = [];
      for (symbol in marketplace){
        self.currencies.push({
          label: `${marketplace[symbol]} (${symbol})`,
          symbol: symbol,
        });
      }
      self.currencies.sort((a, b) => {
        if(a.label < b.label) return -1;
        if(a.label > b.label) return 1;
        return 0;
      });
      window.location.search.split('?')[1].split('&').forEach(seg => {
        const parts = seg.split('=');
        const values = parts[1].split('|');
        const symbol = parts[0];
        const quantity = values[0];
        const pricePer = values[1];
        newHolding(symbol, quantity, pricePer);
      });
      refreshView();
    });
  });
