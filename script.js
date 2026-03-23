const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5wyzEXxKbCeS8SQWZQ7oz5lmPwszeLtW-TuQ5uzCV6GWcXP5IqOzjTqhIRg5yyLuRd86yLtXGMnoL/pub?output=csv'; 

let products = [];
let cart = { prod: null, size: '', color: '' };

// 1. AMBIL DATA DARI SHEETS
async function initApp() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n').map(r => r.trim()).filter(r => r !== '');
        
        const header = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ""));
        const getIdx = (name) => header.indexOf(name);

        products = rows.slice(1).map((row, index) => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ""));
            if (cols.length < 5) return null;

            return {
                id: parseInt(cols[getIdx('id')]) || (index + 1),
                name: cols[getIdx('name')] || "Produk",
                price: parseInt((cols[getIdx('price')] || "0").replace(/[^\d]/g, "")),
                dp: parseInt((cols[getIdx('dp')] || "0").replace(/[^\d]/g, "")) || 0,
                badge: (cols[getIdx('badge')] || "ready").toLowerCase(),
                status: cols[getIdx('status')] || "",
                colors: (cols[getIdx('colors')] || "").split('/').map(i => i.trim()),
                stock: (cols[getIdx('stock')] || "").split('/').map(i => i.trim()),
                thumbnail: cols[getIdx('thumbnail')] || "",
                details: [cols[getIdx('details1')] || "", cols[getIdx('details2')] || ""]
            };
        }).filter(p => p !== null);

        renderHome();
        setTimeout(() => document.getElementById('loader').classList.add('hide'), 800);
    } catch (err) {
        console.error(err);
    }
}

// 2. FUNGSI GETAR & PESAN ERROR (Haptic + Visual)
function triggerError(msg) {
    // A. GETAR HP (Haptic Feedback)
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]); // Pola: Getar, Diam, Getar
    }

    // B. GETAR LAYAR (Visual Shake)
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        activePage.classList.add('vibrate-screen');
        // Hapus class getar setelah 0.3 detik supaya bisa diulang
        setTimeout(() => activePage.classList.remove('vibrate-screen'), 300);
    }

    // C. MUNCULKAN TOAST/PESAN
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// 3. RENDER KATALOG
function renderHome() {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    products.forEach(p => {
        const isSold = p.badge === 'sold';
        const dpLabel = (p.dp > 0) ? `<span style="color:#ffeb3b; font-size:12px;"> (DP ${p.dp/1000}K)</span>` : '';
        
        container.innerHTML += `
            <div class="card" onclick="${isSold ? 'triggerError(\'STOK HABIS!\')' : `goDetail(${p.id})`}">
                <div class="badge ${p.badge}">${p.status}</div>
                <img src="${p.thumbnail}">
                <div style="padding:20px">
                    <h3 style="margin:0; font-size:18px;">${p.name}</h3>
                    <p style="color:#00c853; font-weight:700; margin:8px 0;">Rp ${p.price.toLocaleString('id-ID')}${dpLabel}</p>
                </div>
            </div>`;
    });
}

// 4. DETAIL PRODUK
function goDetail(id) {
    const p = products.find(x => x.id === id);
    cart = { prod: p, size: '', color: p.colors.length === 1 ? p.colors[0] : '' };
    
    document.getElementById('detName').innerText = p.name;
    document.getElementById('detPrice').innerHTML = `Rp ${p.price.toLocaleString('id-ID')} ${(p.dp > 0 ? `<br><small style="color:#fbc02d; font-weight:normal;">DP: Rp ${p.dp.toLocaleString('id-ID')}</small>` : '')}`;
    document.getElementById('detImgs').innerHTML = p.details.filter(i=>i!=="").map(i => `<img src="${i}">`).join('');
    
    let cHTML = `<div class="section-label">PILIH WARNA</div><div class="option-box">`;
    p.colors.forEach(c => cHTML += `<div onclick="selOpt('color','${c}',this)">${c}</div>`);
    document.getElementById('colorArea').innerHTML = cHTML + `</div>`;

    let sHTML = `<div class="section-label">PILIH UKURAN</div><div class="option-box">`;
    ["S", "M", "L", "XL", "XXL", "XXXL"].forEach(s => {
        const isAvail = p.stock.includes(s);
        sHTML += `<div class="${isAvail ? '' : 'disabled'}" onclick="${isAvail ? `selOpt('size','${s}',this)` : 'triggerError(\'UKURAN HABIS\')'}">${s}</div>`;
    });
    document.getElementById('sizeArea').innerHTML = sHTML + `</div>`;
    showPage('detail');
}

function selOpt(type, val, el) {
    if (navigator.vibrate) navigator.vibrate(40); // Getar halus saat pilih
    cart[type] = val;
    el.parentElement.querySelectorAll('div').forEach(d => d.classList.remove('active'));
    el.classList.add('active');
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// 5. VALIDASI SEBELUM LANJUT (DISINI FITUR GETARNYA)
function validateDetail() {
    // Jika warna atau ukuran belum dipilih, layar & hp getar
    if(!cart.color || !cart.size) {
        return triggerError("PILIH WARNA & UKURAN DULU!");
    }
    showPage('form');
}

function validateForm() {
    const n = document.getElementById('inName').value;
    const p = document.getElementById('inPhone').value;
    const a = document.getElementById('inAddress').value;

    // Jika nama, nomor, atau alamat kosong, layar & hp getar
    if(!n || !p || !a) {
        return triggerError("LENGKAPI DATA PENGIRIMAN!");
    }
    
    document.getElementById('sumProd').innerText = cart.prod.name;
    document.getElementById('sumVar').innerText = `${cart.color} / SIZE ${cart.size}`;
    document.getElementById('sumPrice').innerText = (cart.prod.dp > 0) ? `Wajib DP: Rp ${cart.prod.dp.toLocaleString('id-ID')}` : `Total: Rp ${cart.prod.price.toLocaleString('id-ID')}`;
    document.getElementById('sumCust').innerHTML = `<strong>${n}</strong><br>${p}<br>${a}`;
    showPage('summary');
}

function sendWA() {
    const n = document.getElementById('inName').value;
    const p = document.getElementById('inPhone').value;
    const a = document.getElementById('inAddress').value;
    const dpPesan = (cart.prod.dp > 0) ? `\n*DP: Rp ${cart.prod.dp.toLocaleString('id-ID')}*` : `\n*Status: Lunas*`;
    const text = `*ORDER GLORIAM*\n\nProduk: ${cart.prod.name}\nWarna: ${cart.color}\nSize: ${cart.size}\nTotal: Rp ${cart.prod.price.toLocaleString('id-ID')}${dpPesan}\n\n*Data Pengiriman*\nNama: ${n}\nWA: ${p}\nAlamat: ${a}`;
    window.open(`https://wa.me/6283898588562?text=${encodeURIComponent(text)}`);
}

window.onload = initApp;
