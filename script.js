const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5wyzEXxKbCeS8SQWZQ7oz5lmPwszeLtW-TuQ5uzCV6GWcXP5IqOzjTqhIRg5yyLuRd86yLtXGMnoL/pub?output=csv'; 

let products = [];
let cart = { prod: null, size: '', color: '' };

async function initApp() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        
        const header = rows[0].split(',').map(h => h.trim().toLowerCase());
        const getIdx = (name) => header.indexOf(name);

        products = rows.slice(1).map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (cols.length < 5) return null;

            const priceVal = cols[getIdx('price')] ? cols[getIdx('price')].replace(/[^\d]/g, "") : "0";
            const dpVal = (getIdx('dp') !== -1 && cols[getIdx('dp')]) ? cols[getIdx('dp')].replace(/[^\d]/g, "") : "0";

            return {
                id: parseInt(cols[getIdx('id')]),
                name: cols[getIdx('name')].replace(/"/g, "").trim(),
                price: parseInt(priceVal),
                dp: parseInt(dpVal) || 0,
                badge: cols[getIdx('badge')].trim(),
                status: cols[getIdx('status')].replace(/"/g, "").trim(),
                colors: cols[getIdx('colors')].replace(/"/g, "").split('/').map(i => i.trim()),
                stock: cols[getIdx('stock')].replace(/"/g, "").split('/').map(i => i.trim()),
                thumbnail: cols[getIdx('thumbnail')].trim(),
                details: [cols[getIdx('details1')].trim(), cols[getIdx('details2')].trim()]
            };
        }).filter(p => p !== null);

        renderHome();
        setTimeout(() => document.getElementById('loader').classList.add('hide'), 1000);
    } catch (err) {
        console.error(err);
        triggerError("DATABASE ERROR!");
    }
}

function renderHome() {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    products.forEach(p => {
        const isSold = p.badge === 'sold';
        const dpLabel = (p.dp > 0) ? `<span style="color:#ffeb3b; font-size:12px;"> (DP ${p.dp/1000}K)</span>` : '';
        
        container.innerHTML += `
            <div class="card" onclick="${isSold ? '' : `goDetail(${p.id})`}">
                <div class="badge ${p.badge}">${p.status}</div>
                <img src="${p.thumbnail}">
                <div style="padding:20px">
                    <h3 style="margin:0; font-size:18px;">${p.name}</h3>
                    <p style="opacity:0.6; margin:8px 0;">Rp ${p.price.toLocaleString('id-ID')}${dpLabel}</p>
                </div>
            </div>`;
    });
}

function goDetail(id) {
    const p = products.find(x => x.id === id);
    cart = { prod: p, size: '', color: p.colors.length === 1 ? p.colors[0] : '' };
    
    const dpInfo = (p.dp > 0) ? `<br><span style="color:#fbc02d; font-size:14px; font-weight:normal;">Minimal DP: Rp ${p.dp.toLocaleString('id-ID')}</span>` : '';
    
    document.getElementById('detName').innerText = p.name;
    document.getElementById('detPrice').innerHTML = `Rp ${p.price.toLocaleString('id-ID')}${dpInfo}`;
    document.getElementById('detImgs').innerHTML = p.details.map(img => `<img src="${img}">`).join('');
    
    let cHTML = `<div class="section-label">PILIH WARNA</div><div class="option-box">`;
    p.colors.forEach(c => cHTML += `<div class="${cart.color === c ? 'active' : ''}" onclick="selOpt('color','${c}',this)">${c}</div>`);
    document.getElementById('colorArea').innerHTML = cHTML + `</div>`;

    let sHTML = `<div class="section-label">PILIH UKURAN</div><div class="option-box">`;
    ["S", "M", "L", "XL", "XXL", "XXXL"].forEach(s => {
        const isAvail = p.stock.includes(s);
        sHTML += `<div class="${isAvail ? '' : 'disabled'} ${cart.size === s ? 'active' : ''}" onclick="${isAvail ? `selOpt('size','${s}',this)` : ''}">${s}</div>`;
    });
    document.getElementById('sizeArea').innerHTML = sHTML + `</div>`;
    showPage('detail');
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

function selOpt(type, val, el) {
    cart[type] = val;
    el.parentElement.querySelectorAll('div').forEach(d => d.classList.remove('active'));
    el.classList.add('active');
}

function triggerError(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.classList.add('show');
    if (navigator.vibrate) navigator.vibrate(200);
    setTimeout(() => t.classList.remove('show'), 2000);
}

function validateDetail() {
    if(!cart.color || !cart.size) return triggerError("PILIH WARNA & UKURAN!");
    showPage('form');
}

function validateForm() {
    const n = document.getElementById('inName').value;
    const p = document.getElementById('inPhone').value;
    const a = document.getElementById('inAddress').value;
    if(!n || !p || !a) return triggerError("LENGKAPI DATA!");
    
    document.getElementById('sumProd').innerText = cart.prod.name;
    document.getElementById('sumVar').innerText = `VARIAN: ${cart.color} / SIZE: ${cart.size}`;
    
    const tagihan = (cart.prod.dp > 0) ? `Wajib DP: Rp ${cart.prod.dp.toLocaleString('id-ID')}` : `Total: Rp ${cart.prod.price.toLocaleString('id-ID')}`;
    document.getElementById('sumPrice').innerText = tagihan;
    document.getElementById('sumCust').innerHTML = `<strong>${n}</strong><br>${p}<br>${a}`;
    showPage('summary');
}

function sendWA() {
    const n = document.getElementById('inName').value;
    const p = document.getElementById('inPhone').value;
    const a = document.getElementById('inAddress').value;
    const dpPesan = (cart.prod.dp > 0) ? `\n*DP: Rp ${cart.prod.dp.toLocaleString('id-ID')}*` : `\n*Status: Lunas*`;
    
    const text = `*ORDER GLORIAM*\n\nProduk: ${cart.prod.name}\nVarian: ${cart.color}\nSize: ${cart.size}\nHarga Total: Rp ${cart.prod.price.toLocaleString('id-ID')}${dpPesan}\n\n*Pengiriman*\nNama: ${n}\nWA: ${p}\nAlamat: ${a}`;
    window.open(`https://wa.me/6283898588562?text=${encodeURIComponent(text)}`);
}

window.onload = initApp;
