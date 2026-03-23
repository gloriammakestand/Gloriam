const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5wyzEXxKbCeS8SQWZQ7oz5lmPwszeLtW-TuQ5uzCV6GWcXP5IqOzjTqhIRg5yyLuRd86yLtXGMnoL/pub?output=csv'; 

let products = [];
let cart = { prod: null, size: '', color: '' };

async function initApp() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1); 
        
        products = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (cols.length < 10) return null;

            return {
                id: parseInt(cols[0]),
                name: cols[1].replace(/"/g, "").trim(),
                price: parseInt(cols[2]),
                // Kolom DP (Asumsi kolom ke-11 atau sesuaikan urutan di Sheets)
                dp: cols[10] ? parseInt(cols[10]) : 0, 
                badge: cols[3].trim(),
                status: cols[4].replace(/"/g, "").trim(),
                colors: cols[5].replace(/"/g, "").split('/').map(i => i.trim()),
                stock: cols[6].replace(/"/g, "").split('/').map(i => i.trim()),
                thumbnail: cols[7].trim(),
                details: [cols[8].trim(), cols[9].trim()]
            };
        }).filter(p => p !== null);

        renderHome();
        setTimeout(() => document.getElementById('loader').classList.add('hide'), 1000);
    } catch (err) {
        triggerError("KONEKSI GAGAL!");
    }
}

function renderHome() {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    products.forEach(p => {
        const isSold = p.badge === 'sold';
        // Hanya tampilkan teks DP jika p.dp lebih dari 0
        const dpLabel = (p.dp > 0) ? `<span style="color:#ffeb3b; font-size:12px;"> (DP ${p.dp/1000}K)</span>` : '';
        
        container.innerHTML += `
            <div class="card">
                <div class="badge ${p.badge}">${p.status}</div>
                <img src="${p.thumbnail}">
                <div style="padding:25px">
                    <h3 style="margin:0; font-size:20px;">${p.name}</h3>
                    <p style="opacity:0.5; margin:10px 0 20px;">
                        ${isSold ? 'OUT OF STOCK' : 'Rp' + p.price.toLocaleString('id-ID') + dpLabel}
                    </p>
                    <button ${isSold ? 'disabled' : ''} onclick="goDetail(${p.id})">${isSold ? 'HABIS' : 'SELECT'}</button>
                </div>
            </div>`;
    });
}

function goDetail(id) {
    const p = products.find(x => x.id === id);
    cart = { prod: p, size: '', color: p.colors.length === 1 ? p.colors[0] : '' };
    
    // Tampilan DP di halaman detail
    const dpDetail = (p.dp > 0) ? `<br><small style="color:#ffeb3b; font-size:14px;">Minimal DP: Rp${p.dp.toLocaleString('id-ID')}</small>` : '';
    
    document.getElementById('detName').innerText = p.name;
    document.getElementById('detPrice').innerHTML = `Rp${p.price.toLocaleString('id-ID')}${dpDetail}`;
    document.getElementById('detImgs').innerHTML = p.details.map(img => `<img src="${img}">`).join('');
    
    // ... (render warna & size tetap sama)
    showPage('detail');
}

function sendWA() {
    const n = document.getElementById('inName').value;
    const p = document.getElementById('inPhone').value;
    const a = document.getElementById('inAddress').value;
    
    // Pesan WA otomatis menyesuaikan ada DP atau tidak
    const textDP = (cart.prod.dp > 0) ? `\n*Wajib DP: Rp${cart.
