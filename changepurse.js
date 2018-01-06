
function DisplayBalances(balances){
  const TICKER_URL = 'https://api.coinmarketcap.com/v1/ticker/?limit=150'

  const elmTable = document.createElement('table');
  document.body.appendChild(elmTable);
  const elmLog = document.createElement('div');
  document.body.appendChild(elmLog);
  const elmData = document.createElement('pre');
  document.body.appendChild(elmData);

  function gainStyle(gain){
    const rgb = gain > 0 ? '144, 238, 144' : '250, 128, 114';
    const relativeGain = Math.abs(gain * 2 / 100);
    const rgba = `rgba(${rgb}, ${relativeGain})`;
    return `style="background-color: ${rgba};"`;
  }

  function rowHTML(c){
    if (c.holding === 0){
      return '';
    }
    return `
      <tr>
        <td>${c.symbol}</td>
        <td>${c.name}</td>
        <td>${c.gambled.toFixed(2)}</td>
        <td>${c.current.toFixed(2)}</td>
        <td ${gainStyle(c.gain)}>${c.gain.toFixed(0)}</td>
        <td>${c.holding.toFixed(2)}</td>
        <td>${c.market.toFixed(2)}</td>
      </tr>
    `;
  }

  function processTicker(ticker){
    console.log(ticker);
    var currencies = [];
    ticker.forEach(t => {
      var balance = balances[t.symbol];
      if (balance !== undefined){
        const market_price = parseFloat(t.price_usd, 10);
        const current = balance.holding * market_price;
        currencies.push({
          name: t.name,
          market: market_price,
          symbol: t.symbol,
          gambled: balance.gambled,
          holding: balance.holding,
          current: current,
          gain: (100 * current / balance.gambled) - 100,
        });
      }
    });
    elmLog.innerHTML = '';

    const totalGambled = currencies.reduce((sum, c) => sum + c.gambled, 0).toFixed(2);
    const totalCurrent = currencies.reduce((sum, c) => sum + c.current, 0).toFixed(2);
    const totalGain = ((100 * totalCurrent / totalGambled) - 100).toFixed(0);
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
          <td></td>
          <td>~ TOTAL ~</td>
          <td>${totalGambled}</td>
          <td>${totalCurrent}</td>
          <td ${gainStyle(totalGain)}>${totalGain}</td>
          <td></td>
          <td></td>
        </tr>
      </table>
    `;
  }

  // run

  elmData.innerHTML = JSON.stringify(balances, null, 2);
  elmLog.innerHTML = 'fetching market prices...';
  const url = TICKER_URL + '&v=' + (new Date()).toISOString();
  fetch(url).then(r => r.json()).then(processTicker);
}
