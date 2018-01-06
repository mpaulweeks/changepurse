
function DisplayBalances(balances){
  const TICKER_URL = 'https://api.coinmarketcap.com/v1/ticker/?limit=150'

  const elmTable = document.createElement('table');
  document.body.appendChild(elmTable);
  const elmData = document.createElement('pre');
  document.body.appendChild(elmData);

  const market = {};

  function gainStyle(gain){
    if (gain === null){
      return '';
    }
    const rgb = gain > 0 ? '144, 238, 144' : '250, 128, 114';
    const relativeGain = Math.abs(gain * 2 / 100);
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

  function rowHTML(c){
    if (c.holding === 0){
      return '';
    }
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
    const currencies = Object.keys(balances).map(bkey => {
      const balance = balances[bkey];
      const ticker = market[bkey];
      const currency = {
        symbol: bkey,
        gambled: balance.gambled,
        holding: balance.holding,
      };
      if (ticker){
        const market_price = parseFloat(ticker.price_usd, 10);
        const current = balance.holding * market_price;
        return {
          ...currency,
          name: ticker.name,
          market: market_price,
          current: current,
          gain: (100 * current / balance.gambled) - 100,
        };
      } else {
        loading = true;
        return currency;
      }
    });
    const totalGambled = currencies.reduce((sum, c) => sum + c.gambled, 0);
    const totalCurrent = loading ? null : (currencies.reduce((sum, c) => sum + c.current, 0), 2);
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
        <tr>
          <td class="empty"></td>
          <td>~ TOTAL ~</td>
          <td>${FixDec(totalGambled, 2)}</td>
          <td>${FixDec(totalCurrent, 2)}</td>
          <td ${gainStyle(totalGain)}>${FixDec(totalGain, 0)}</td>
          <td class="empty"></td>
          <td class="empty"></td>
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

  elmData.innerHTML = JSON.stringify(balances, null, 2);
  displayBalances();

  const NAMES_URL = 'https://raw.githubusercontent.com/mpaulweeks/changepurse/master/ticker_names.json';
  fetch(NAMES_URL).then(r => r.json()).then(lookup => {
    Object.keys(balances).forEach(bkey => {
      const tickerName = lookup[bkey];
      if (tickerName){
        const url = `https://api.coinmarketcap.com/v1/ticker/${tickerName}/?v=${(new Date()).toISOString()}`;
        fetch(url).then(r => r.json()).then(processTicker);
      }
    })
  });
}
