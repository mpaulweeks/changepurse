
function DisplayBalances(balances){
  const TICKER_URL = 'https://api.coinmarketcap.com/v1/ticker/?limit=150'

  const elmTable = document.createElement('table');
  document.body.appendChild(elmTable);

  const holdings = balances.reduce((a, cv) => {
    if (cv.holding !== 0){
      return a.concat(cv);
    }
    return a;
  }, []);
  const market = {};

  function gainStyle(gain){
    if (gain === null){
      return '';
    }
    const rgb = gain > 0 ? '144, 238, 144' : '250, 128, 114';
    const relativeGain = Math.abs(gain * 4 / 100);
    const rgba = `rgba(${rgb}, ${relativeGain})`;
    return `style="background-color: ${rgba};"`;
  }

  function FixDec(num, places){
    if (num === null || num === undefined){
      return '';
    } else {
      return num.toFixed(places);
    }
  }

  function getTimestamp(){
    return Math.floor((new Date()).getTime() / (60 * 1000));
  }

  function rowHTML(c){
    return `
      <tr>
        <td>${c.symbol || ''}</td>
        <td>${c.name || ''}</td>
        <td>${FixDec(c.gambled, 2)}</td>
        <td>${FixDec(c.current, 2)}</td>
        <td ${gainStyle(c.gain)}>${FixDec(c.gain, 0)}</td>
        <td>${FixDec(c.holding, 2)}</td>
        <td>${FixDec(c.market, 2)}</td>
      </tr>
    `;
  }

  function displayBalances(){
    let loading = false;
    const currencies = holdings.map(currency => {
      const ticker = market[currency.symbol];
      if (ticker){
        const market_price = parseFloat(ticker.price_usd, 10);
        const current = currency.holding * market_price;
        return Object.assign(currency, {
          name: ticker.name,
          market: market_price,
          current: current,
          gain: (100 * current / currency.gambled) - 100,
        });
      } else {
        loading = true;
        return currency;
      }
    });
    const totalGambled = currencies.reduce((sum, c) => sum + c.gambled, 0);
    const totalCurrent = loading ? null : currencies.reduce((sum, c) => sum + c.current, 0);
    const totalGain = loading ? null : ((100 * totalCurrent / totalGambled) - 100);
    elmTable.innerHTML = `
      <table>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Gambled</th>
          <th>Current Value</th>
          <th>Gain %</th>
          <th>Shares</th>
          <th>Market Price</th>
        </tr>
        ${currencies.map(rowHTML).join('')}
        <tr class="total">
          <td class="hide"></td>
          <td>~ TOTAL ~</td>
          <td>${FixDec(totalGambled, 2)}</td>
          <td>${FixDec(totalCurrent, 2)}</td>
          <td ${gainStyle(totalGain)}>${FixDec(totalGain, 0)}</td>
          <td class="hide"></td>
          <td class="hide"></td>
        </tr>
      </table>
    `;
  }

  function processTicker(ticker){
    ticker.forEach(t => {
      market[t.symbol] = t;
    });
    displayBalances();
  }

  // run

  displayBalances();

  const NAMES_URL = 'https://raw.githubusercontent.com/mpaulweeks/changepurse/master/docs/static/ticker_names.json';
  fetch(NAMES_URL).then(r => r.json()).then(lookup => {
    holdings.forEach(currency => {
      const tickerName = lookup[currency.symbol];
      if (tickerName){
        const safeTickerName = tickerName.replace(' ', '-');
        const url = `https://api.coinmarketcap.com/v1/ticker/${safeTickerName}/?v=${getTimestamp()}`;
        fetch(url).then(r => r.json()).then(processTicker);
      }
    })
  });
}
