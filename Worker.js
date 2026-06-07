export default {
  async fetch(request) {
    return new Response(getHTML(), {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-cache',
      },
    });
  },
};

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BaseLens — Base Chain Explorer</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --navy:    #05050f;
      --surface: #16163a;
      --border:  #2a2a6a;
      --blue:    #3b6ef8;
      --blue-l:  #6b9dff;
      --violet:  #7c3aed;
      --violet-l:#a78bfa;
      --pink:    #c026d3;
      --glow-b:  rgba(59,110,248,0.35);
      --glow-v:  rgba(124,58,237,0.35);
      --text:    #e8e8ff;
      --muted:   #8888bb;
      --accent:  #a78bfa;
      --mid:     #11112e;
    }

    body {
      font-family: 'Syne', sans-serif;
      background: var(--navy);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(59,110,248,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(124,58,237,0.20) 0%, transparent 55%),
        radial-gradient(ellipse 40% 40% at 55% 45%, rgba(192,38,211,0.10) 0%, transparent 50%);
      pointer-events: none; z-index: 0;
      animation: meshPulse 8s ease-in-out infinite alternate;
    }
    @keyframes meshPulse { 0%{opacity:0.7;} 100%{opacity:1;} }

    body::after {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(59,110,248,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,110,248,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none; z-index: 0;
    }

    .wrapper {
      position: relative; z-index: 1;
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ── Header ── */
    header {
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(20px);
      background: rgba(5,5,15,0.75);
      border-bottom: 1px solid var(--border);
    }
    .header-inner {
      display: flex; align-items: center; gap: 10px;
      padding: 16px 24px; max-width: 900px; margin: 0 auto;
    }
    .logo-icon {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, var(--blue), var(--violet));
      border-radius: 9px; display: grid; place-items: center; font-size: 17px;
    }
    .logo-text { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.5px; }
    .logo-text span { color: var(--blue-l); }

    /* ── Hero ── */
    .hero {
      padding: 64px 0 44px;
      text-align: center;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 5px 14px; border: 1px solid var(--border); border-radius: 999px;
      font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--accent);
      background: rgba(124,58,237,0.08); margin-bottom: 24px; letter-spacing: 1px;
    }
    .hero-badge::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: var(--accent); animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.75);} }

    .hero h1 {
      font-size: clamp(1.9rem, 4.5vw, 3.2rem);
      font-weight: 800; line-height: 1.12; letter-spacing: -1.5px; margin-bottom: 14px;
    }
    .grad {
      background: linear-gradient(90deg, var(--blue-l), var(--violet-l), #f472b6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .hero p {
      font-size: 1rem; color: var(--muted);
      max-width: 480px; margin: 0 auto; line-height: 1.7;
    }

    /* ── Search box ── */
    .search-wrap {
      margin: 40px 0 56px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      position: relative;
      overflow: hidden;
    }
    .search-wrap::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--blue), var(--violet), var(--pink));
    }
    .search-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.7rem; letter-spacing: 2px;
      color: var(--muted); text-transform: uppercase; margin-bottom: 14px;
    }
    .input-row { display: flex; gap: 12px; flex-wrap: wrap; }

    #addrInput {
      flex: 1; min-width: 200px;
      background: rgba(5,5,15,0.6);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 18px;
      color: var(--text);
      font-family: 'DM Mono', monospace;
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #addrInput::placeholder { color: var(--muted); }
    #addrInput:focus {
      border-color: var(--violet);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
    }

    #searchBtn {
      padding: 14px 28px;
      border: none; border-radius: 12px;
      background: linear-gradient(135deg, var(--blue), var(--violet));
      color: #fff; font-family: 'Syne', sans-serif;
      font-size: 0.9rem; font-weight: 700;
      cursor: pointer; white-space: nowrap;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      box-shadow: 0 0 20px var(--glow-b);
      display: flex; align-items: center; gap: 8px;
    }
    #searchBtn:hover { transform: translateY(-2px); box-shadow: 0 0 28px var(--glow-v); }
    #searchBtn:active { transform: translateY(0); }
    #searchBtn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .search-hint {
      margin-top: 12px;
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem; color: var(--muted);
    }
    .search-hint.error { color: #f87171; }
    .search-hint.success { color: #4ade80; }

    /* spinner */
    .spin {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: none;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Results ── */
    #results { display: none; animation: fadeUp 0.5s ease; }
    #results.show { display: block; }

    .result-header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
      margin-bottom: 20px;
    }
    .result-addr {
      font-family: 'DM Mono', monospace;
      font-size: 0.8rem; color: var(--accent);
      background: rgba(124,58,237,0.1);
      border: 1px solid rgba(124,58,237,0.3);
      padding: 6px 14px; border-radius: 999px;
    }
    .basescan-link {
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem; color: var(--blue-l);
      text-decoration: none;
      display: flex; align-items: center; gap: 5px;
      padding: 6px 14px; border-radius: 999px;
      border: 1px solid rgba(59,110,248,0.3);
      background: rgba(59,110,248,0.08);
      transition: background 0.2s;
    }
    .basescan-link:hover { background: rgba(59,110,248,0.18); }

    .section-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.7rem; letter-spacing: 2px;
      color: var(--muted); text-transform: uppercase;
      margin-bottom: 16px;
      display: flex; align-items: center; gap: 12px;
    }
    .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

    /* ── Stats grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 14px; margin-bottom: 40px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 24px 20px;
      position: relative; overflow: hidden;
      transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
      animation: fadeUp 0.5s ease both;
    }
    .stat-card:nth-child(1){animation-delay:0.05s;} .stat-card:nth-child(2){animation-delay:0.10s;}
    .stat-card:nth-child(3){animation-delay:0.15s;} .stat-card:nth-child(4){animation-delay:0.20s;}
    .stat-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--blue), var(--violet));
      opacity: 0; transition: opacity 0.3s;
    }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(124,58,237,0.5); box-shadow: 0 8px 32px var(--glow-v); }
    .stat-card:hover::before { opacity: 1; }
    .glow-blob {
      position: absolute; width: 100px; height: 100px; border-radius: 50%;
      filter: blur(35px); pointer-events: none; top: -15px; right: -15px; opacity: 0.22;
    }
    .stat-icon { font-size: 24px; margin-bottom: 16px; }
    .stat-label { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .stat-value {
      font-size: 2rem; font-weight: 800; letter-spacing: -1px; line-height: 1; margin-bottom: 5px;
      background: linear-gradient(135deg, #fff 40%, var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .stat-sub { font-size: 0.72rem; color: var(--muted); font-family: 'DM Mono', monospace; line-height: 1.5; }

    .skeleton {
      display: inline-block; width: 90px; height: 32px; border-radius: 6px;
      background: linear-gradient(90deg, var(--mid) 25%, var(--border) 50%, var(--mid) 75%);
      background-size: 200% 100%; animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

    /* ── TX table ── */
    .tx-section { margin-bottom: 60px; }
    .tx-list { display: flex; flex-direction: column; gap: 7px; }
    .tx-row {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr auto;
      align-items: center; gap: 12px;
      padding: 13px 18px;
      background: var(--surface); border: 1px solid var(--border); border-radius: 11px;
      font-family: 'DM Mono', monospace; font-size: 0.74rem; color: var(--muted);
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }
    .tx-row:hover { border-color: var(--violet); background: rgba(124,58,237,0.06); }
    .tx-hash { color: var(--blue-l); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tx-from { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tx-amount { color: var(--text); font-weight: 500; }
    .tx-badge { padding: 3px 9px; border-radius: 999px; font-size: 0.65rem; font-weight: 700; white-space: nowrap; }
    .tx-badge.in  { background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .tx-badge.out { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
    .tx-header {
      display: grid; grid-template-columns: 1.4fr 1fr 1fr auto;
      gap: 12px; padding: 8px 18px;
      font-family: 'DM Mono', monospace; font-size: 0.65rem;
      color: var(--muted); letter-spacing: 1px; text-transform: uppercase;
    }

    footer {
      text-align: center; padding: 28px 24px;
      border-top: 1px solid var(--border);
      font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--muted);
      position: relative; z-index: 1;
    }
    footer a { color: var(--accent); text-decoration: none; }

    @keyframes fadeUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

    @media(max-width:560px){
      .tx-row, .tx-header { grid-template-columns: 1fr auto; }
      .tx-from, .tx-amount { display: none; }
      .search-wrap { padding: 22px 18px; }
    }
  </style>
</head>
<body>

<header>
  <div class="header-inner">
    <div class="logo-icon">⬡</div>
    <div class="logo-text">Base<span>Lens</span></div>
  </div>
</header>

<div class="wrapper">

  <section class="hero">
    <div class="hero-badge">🔵 BASE MAINNET · CHAIN ID 8453</div>
    <h1>Track Your Activity on<br/><span class="grad">Base Blockchain</span></h1>
    <p>Paste any EVM wallet address to instantly explore transactions, NFTs, assets, and trading volume on Base.</p>
  </section>

  <!-- Search -->
  <div class="search-wrap">
    <div class="search-label">Wallet Address</div>
    <div class="input-row">
      <input
        id="addrInput"
        type="text"
        placeholder="0x... paste your EVM wallet address here"
        autocomplete="off"
        spellcheck="false"
      />
      <button id="searchBtn" onclick="doSearch()">
        <span id="btnLabel">Search</span>
        <div class="spin" id="btnSpin"></div>
      </button>
    </div>
    <div class="search-hint" id="searchHint">Enter a valid 0x address on Base network</div>
  </div>

  <!-- Results -->
  <div id="results">

    <div class="result-header">
      <div class="result-addr" id="resultAddr"></div>
      <a class="basescan-link" id="basescanLink" href="#" target="_blank">
        ↗ View on BaseScan
      </a>
    </div>

    <div class="section-label">On-Chain Overview</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="glow-blob" style="background:var(--blue);"></div>
        <div class="stat-icon">📊</div>
        <div class="stat-label">Transactions</div>
        <div class="stat-value" id="txCount"><span class="skeleton"></span></div>
        <div class="stat-sub" id="txSub"> </div>
      </div>
      <div class="stat-card">
        <div class="glow-blob" style="background:var(--violet);"></div>
        <div class="stat-icon">🖼️</div>
        <div class="stat-label">NFTs Held</div>
        <div class="stat-value" id="nftCount"><span class="skeleton"></span></div>
        <div class="stat-sub" id="nftSub"> </div>
      </div>
      <div class="stat-card">
        <div class="glow-blob" style="background:var(--pink);"></div>
        <div class="stat-icon">💎</div>
        <div class="stat-label">ETH Balance</div>
        <div class="stat-value" id="assetValue"><span class="skeleton"></span></div>
        <div class="stat-sub" id="assetSub"> </div>
      </div>
      <div class="stat-card">
        <div class="glow-blob" style="background:var(--blue);"></div>
        <div class="stat-icon">📈</div>
        <div class="stat-label">Trade Volume</div>
        <div class="stat-value" id="tradeVol"><span class="skeleton"></span></div>
        <div class="stat-sub" id="volSub"> </div>
      </div>
    </div>

    <div class="section-label">Recent Transactions</div>
    <div class="tx-section">
      <div class="tx-header">
        <span>Hash</span><span>From</span><span>Value</span><span>Type</span>
      </div>
      <div class="tx-list" id="txList"></div>
    </div>

  </div>
</div>

<footer>
  Powered by <a href="https://base.org" target="_blank">Base</a> &nbsp;·&nbsp;
  Data via <a href="https://basescan.org" target="_blank">BaseScan API v2</a> &nbsp;·&nbsp;
  BaseLens &copy; 2025
</footer>

<script>
  const API    = 'https://api.basescan.org/v2/api';
  const CHAIN  = '8453';
  const APIKEY = 'YourBaseScanAPIKey'; // <-- کلیدت رو اینجا بذار

  function q(params) {
    return API + '?chainid=' + CHAIN + '&apikey=' + APIKEY + '&' +
      Object.entries(params).map(([k,v]) => k + '=' + encodeURIComponent(v)).join('&');
  }

  function isValidAddress(addr) {
    return /^0x[0-9a-fA-F]{40}$/.test(addr.trim());
  }

  function setHint(msg, type='') {
    const el = document.getElementById('searchHint');
    el.textContent = msg;
    el.className = 'search-hint' + (type ? ' ' + type : '');
  }

  function setLoading(on) {
    document.getElementById('searchBtn').disabled = on;
    document.getElementById('btnLabel').style.display = on ? 'none' : '';
    document.getElementById('btnSpin').style.display  = on ? 'block' : 'none';
  }

  function skelAll() {
    ['txCount','nftCount','assetValue','tradeVol'].forEach(id => {
      document.getElementById(id).innerHTML = '<span class="skeleton"></span>';
    });
    ['txSub','nftSub','assetSub','volSub'].forEach(id => {
      document.getElementById(id).textContent = ' ';
    });
    document.getElementById('txList').innerHTML = '';
  }

  async function doSearch() {
    const raw = document.getElementById('addrInput').value.trim();
    if (!isValidAddress(raw)) {
      setHint('⚠ Please enter a valid 0x EVM address.', 'error');
      return;
    }
    const address = raw.toLowerCase();
    setLoading(true);
    setHint('Fetching data from Base…');
    skelAll();

    // Show results panel immediately (with skeletons)
    document.getElementById('results').classList.add('show');
    document.getElementById('resultAddr').textContent = address.slice(0,6) + '…' + address.slice(-4);
    document.getElementById('basescanLink').href = 'https://basescan.org/address/' + address;

    await Promise.all([
      fetchTxAndVolume(address),
      fetchNFTs(address),
      fetchBalance(address),
    ]);

    setLoading(false);
    setHint('✓ Data loaded from BaseScan API v2', 'success');
  }

  // Enter key support
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addrInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') doSearch();
    });
  });

  async function fetchTxAndVolume(address) {
    try {
      const url = q({ module:'account', action:'txlist', address, startblock:0, endblock:99999999, sort:'desc' });
      const data = await fetch(url).then(r => r.json());

      if (data.status === '1' && Array.isArray(data.result)) {
        const txs = data.result;
        const recv = txs.filter(t => t.to.toLowerCase() === address).length;
        const sent = txs.filter(t => t.from.toLowerCase() === address).length;
        document.getElementById('txCount').textContent = txs.length.toLocaleString();
        document.getElementById('txSub').textContent = recv + ' received · ' + sent + ' sent';

        let vol = 0;
        txs.forEach(t => { vol += parseFloat(t.value || 0) / 1e18; });
        document.getElementById('tradeVol').textContent = vol.toFixed(4) + ' ETH';
        document.getElementById('volSub').textContent = 'Total ETH moved on Base';

        renderTxTable(txs.slice(0, 12), address);
      } else {
        document.getElementById('txCount').textContent = '0';
        document.getElementById('txSub').textContent = 'No transactions found';
        document.getElementById('tradeVol').textContent = '0 ETH';
        document.getElementById('volSub').textContent = 'No volume yet';
        renderTxTable([], address);
      }
    } catch(e) {
      document.getElementById('txCount').textContent = '—';
      document.getElementById('txSub').textContent = 'Fetch error';
      document.getElementById('tradeVol').textContent = '—';
      document.getElementById('volSub').textContent = 'Fetch error';
    }
  }

  async function fetchNFTs(address) {
    try {
      const url = q({ module:'account', action:'tokennfttx', address, startblock:0, endblock:99999999, sort:'desc' });
      const data = await fetch(url).then(r => r.json());
      if (data.status === '1' && Array.isArray(data.result)) {
        const held = new Map();
        data.result.forEach(tx => {
          const key = tx.contractAddress + ':' + tx.tokenID;
          const delta = tx.to.toLowerCase() === address ? 1 : -1;
          held.set(key, (held.get(key) || 0) + delta);
        });
        const count = [...held.values()].filter(v => v > 0).length;
        document.getElementById('nftCount').textContent = count.toLocaleString();
        document.getElementById('nftSub').textContent = data.result.length + ' total NFT transfers';
      } else {
        document.getElementById('nftCount').textContent = '0';
        document.getElementById('nftSub').textContent = 'No NFT activity';
      }
    } catch(e) {
      document.getElementById('nftCount').textContent = '—';
      document.getElementById('nftSub').textContent = 'Fetch error';
    }
  }

  async function fetchBalance(address) {
    try {
      // ETH balance
      const balUrl = q({ module:'account', action:'balance', address, tag:'latest' });
      const balData = await fetch(balUrl).then(r => r.json());
      const eth = balData.status === '1' ? (parseFloat(balData.result) / 1e18) : 0;

      // ERC-20 token count
      const tokUrl = q({ module:'account', action:'tokentx', address, startblock:0, endblock:99999999, sort:'desc' });
      const tokData = await fetch(tokUrl).then(r => r.json());
      const tokens = new Set();
      if (tokData.status === '1') tokData.result.forEach(t => tokens.add(t.contractAddress));

      document.getElementById('assetValue').textContent = eth.toFixed(5) + ' ETH';
      document.getElementById('assetSub').textContent = '+ ' + tokens.size + ' ERC-20 token' + (tokens.size !== 1 ? 's' : '');
    } catch(e) {
      document.getElementById('assetValue').textContent = '—';
      document.getElementById('assetSub').textContent = 'Fetch error';
    }
  }

  function renderTxTable(txs, address) {
    const container = document.getElementById('txList');
    if (!txs.length) {
      container.innerHTML = '<div style="text-align:center;color:var(--muted);padding:28px;font-family:\'DM Mono\',monospace;font-size:0.78rem;">No transactions found</div>';
      return;
    }
    container.innerHTML = txs.map(tx => {
      const isIn = tx.to.toLowerCase() === address;
      const eth  = (parseFloat(tx.value || 0) / 1e18).toFixed(5);
      const hash = tx.hash.slice(0,8) + '…' + tx.hash.slice(-5);
      const from = tx.from.slice(0,6) + '…' + tx.from.slice(-4);
      return '<div class="tx-row" onclick="window.open(\'https://basescan.org/tx/' + tx.hash + '\',\'_blank\')">'
        + '<span class="tx-hash">' + hash + '</span>'
        + '<span class="tx-from">' + from + '</span>'
        + '<span class="tx-amount">' + eth + ' ETH</span>'
        + '<span class="tx-badge ' + (isIn ? 'in' : 'out') + '">' + (isIn ? '▲ IN' : '▼ OUT') + '</span>'
        + '</div>';
    }).join('');
  }
</script>
</body>
</html>`;
}