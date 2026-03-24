const SHEET_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5wyzEXxKbCeS8SQWZQ7oz5lmPwszeLtW-TuQ5uzCV6GWcXP5IqOzjTqhIRg5yyLuRd86yLtXGMnoL/pub?output=csv';
let products = [];
let cart = { prod: null, size: '', color: '' };

function vibrate(ms) { if (navigator.vibrate) navigator.vibrate(ms); }

window.onload = async () => {
    await fetchProducts();
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 1000);
};

async function fetchProducts() {
    try {
        const response = await fetch(SHEET_CSV);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        products = rows.map(row => {
            const col = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ""));
            return {
                id: parseInt(col[0]), name: col[1], price: col[2],
                badge: col[3].toLowerCase(), status: col[4],
                colors: col[5].split('/').map(c => c.trim()),
                stock: col[6].split('/').map(s => s.trim()),
                imgs: [col[7], col[8], col[9]].filter(i => i !== ""),
                specs: col[10] // <--- Tambahkan koma di baris atasnya, lalu tambah baris ini
            };
        });
        renderHome();
    } catch (err) { console.error(err); }
}

function renderHome() {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    products.forEach(p => {
        const isSold = p.badge === 'sold';
        container.innerHTML += `
            <div class="card ${isSold ? 'sold-out' : ''}">
                <div class="badge ${p.badge}">${p.status}</div>
                <img src="${p.imgs[0]}">
                <div style="padding:25px">
                    <h3>${p.name}</h3>
                    <p style="opacity:0.5; font-weight:600;">${isSold ? 'OUT OF STOCK' : 'Rp' + p.price}</p>
                    <button onclick="vibrate(40); goDetail(${p.id})" ${isSold ? 'disabled' : ''}>${isSold ? 'HABIS' : 'SELECT'}</button>
                </div>
            </div>
        `;
    });
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById(id).scrollTop = 0;
}

function goDetail(id) {
    const p = products.find(x => x.id === id);
    cart = { prod: p, size: '', color: p.colors.length === 1 ? p.colors[0] : '' };
    document.getElementById('detName').innerText = p.name;
    document.getElementById('detPrice').innerText = 'Rp' + p.price;
    document.getElementById('detImgs').innerHTML = p.imgs.slice(1).map(i => `<img src="${i}">`).join('');

    let cHTML = `<div class="section-label">PILIH WARNA</div><div class="option-box">`;
    p.colors.forEach(c => cHTML += `<div class="${cart.color === c ? 'active' : ''}" onclick="selOpt('color','${c}',this)">${c}</div>`);
    document.getElementById('colorArea').innerHTML = cHTML + `</div>`;

    let sHTML = `<div class="section-label">PILIH UKURAN</div><div class="option-box">`;
    ["S", "M", "L", "XL", "XXL", "XXXL"].forEach(s => {
        const isAvail = p.stock.includes(s);
        sHTML += `<div class="${isAvail ? '' : 'disabled'}" onclick="${isAvail ? `selOpt('size','${s}',this)` : ''}">${s}</div>`;
    });
    document.getElementById('sizeArea').innerHTML = sHTML + `</div>`;
    showPage('detail');
}

function selOpt(type, val, el) { vibrate(20); cart[type] = val; el.parentElement.querySelectorAll('div').forEach(d => d.classList.remove('active')); el.classList.add('active'); }

function triggerAlert(msg) {
    vibrate([50, 50, 50]);
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show', 'shake');
    setTimeout(() => toast.classList.remove('shake'), 400);
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function validateDetail() {
    if (!cart.color && !cart.size) return triggerAlert("PILIH WARNA & UKURAN!");
    if (!cart.color) return triggerAlert("PILIH WARNA!");
    if (!cart.size) return triggerAlert("PILIH UKURAN!");
    vibrate(40);
    showPage('form');
}

function validateForm() {
    const n = document.getElementById('inName').value, p = document.getElementById('inPhone').value, a = document.getElementById('inAddress').value;
    if(!n || !p || !a) return triggerAlert("LENGKAPI DATA!");
    vibrate(40);
    document.getElementById('sumProd').innerText = cart.prod.name;
    document.getElementById('sumVar').innerText = `WARNA: ${cart.color} | SIZE: ${cart.size}`;
    document.getElementById('sumPrice').innerText = 'Rp' + cart.prod.price;
    document.getElementById('sumCust').innerHTML = `<strong>${n}</strong><br>${p}<br>${a}`;
    showPage('summary');
}

function sendWA() {
    const n = document.getElementById('inName').value, p = document.getElementById('inPhone').value, a = document.getElementById('inAddress').value;
    const text = `*GLORIAM ORDER*\n\n${cart.prod.name}\nWarna: ${cart.color}\nSize: ${cart.size}\nTotal: Rp${cart.prod.price}\n\n*Data Pengiriman*\nNama: ${n}\nWhatsApp: ${p}\nAlamat: ${a}`;
    window.open(`https://wa.me/6283898588562?text=${encodeURIComponent(text)}`);
}

function openSize() { vibrate(30); document.getElementById('sizeModal').style.display='flex'; }
function closeSize() { document.getElementById('sizeModal').style.display='none'; }

// Fungsi untuk membuka modal spesifikasi
function openSpecs() { 
    vibrate(30); 
    // Ambil data specs dari produk yang sedang aktif di cart
    const text = cart.prod.specs ? cart.prod.specs.replace(/\\n/g, '<br>') : "Spesifikasi belum tersedia.";
    document.getElementById('specContent').innerHTML = text;
    document.getElementById('specsModal').style.display = 'flex'; 
}

// Fungsi untuk menutup modal spesifikasi
function closeSpecs() { 
    document.getElementById('specsModal').style.display = 'none'; 
}