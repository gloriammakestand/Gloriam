* { box-sizing: border-box; }
html, body {
    margin: 0; font-family: 'Montserrat', sans-serif;
    background: #000; color: #fff; overflow-x: hidden;
}

/* LOADER */
.loader {
    position: fixed; 
    inset: 0; 
    background: #000; /* Background hitam pekat */
    display: flex;
    justify-content: center; 
    align-items: center; 
    z-index: 10000;
    transition: 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}

.loader img {
    width: 350px; /* Ukuran logo sudah dibesarkan dari 120px ke 350px */
    height: auto;
    /* Efek animasi berdenyut pelan */
    animation: pulse 1.8s ease-in-out infinite;
}

/* Animasi denyut halus (Pulse) */
@keyframes pulse {
    0% { transform: scale(0.96); opacity: 0.7; }
    50% { transform: scale(1.04); opacity: 1; }
    100% { transform: scale(0.96); opacity: 0.7; }
}

.loader.hide { 
    opacity: 0; 
    pointer-events: none; 
    transform: scale(1.1); /* Efek zoom out halus saat loading selesai */
}



/* TOAST & SHAKE */
.toast {
    position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
    background: #ff3b3b; color: #fff; padding: 14px 28px; border-radius: 50px;
    transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 9999; 
    font-weight: 700; font-size: 11px; text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(255,59,59,0.3);
}
.toast.show { top: 30px; }
.shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shake {
    10%, 90% { transform: translate3d(-50%, 0, 0) translateX(-2px); }
    20%, 80% { transform: translate3d(-50%, 0, 0) translateX(4px); }
    30%, 50%, 70% { transform: translate3d(-50%, 0, 0) translateX(-8px); }
    40%, 60% { transform: translate3d(-50%, 0, 0) translateX(8px); }
}

/* HEADER */
header { 
    padding: 80px 20px 40px; /* Diubah dari height: 50vh agar lebih fleksibel */
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    text-align: center;
}
header h1 { letter-spacing: 12px; font-size: 32px; margin: 0; }

/* Slogan Utama */
header .slogan { 
    font-size: 10px; 
    font-weight: 700;
    opacity: 0.8; 
    margin-top: 10px; 
    letter-spacing: 2px; 
    text-transform: uppercase;
}

/* Deskripsi Baru */
header .description {
    max-width: 300px;
    margin-top: 20px;
    font-size: 11px;
    line-height: 1.8;
    opacity: 0.4;
    letter-spacing: 0.5px;
}

/* PRODUCTS */
.products { display: flex; flex-direction: column; align-items: center; gap: 40px; padding: 0 20px 80px; }
.card { width: 100%; max-width: 450px; background: #0a0a0a; border-radius: 20px; border: 1px solid #1a1a1a; overflow: hidden; position: relative; transition: 0.3s; }
.card.sold-out { opacity: 0.4; filter: grayscale(1); pointer-events: none; }
.card img { width: 100%; display: block; }
.badge { position: absolute; top: 15px; left: 15px; padding: 6px 14px; font-size: 10px; font-weight: 700; border-radius: 8px; z-index: 2; }
.pre { background: #00c853; }
.ready { background: #000; color: #fff; }
.sold { background: #ff3b3b; }

/* FOOTER */
footer { background: #0a0a0a; border-top: 1px solid #1a1a1a; padding: 60px 20px; text-align: center; margin-top: 40px; }
.footer-logo { letter-spacing: 10px; font-size: 22px; font-weight: 700; margin-bottom: 5px; }
.footer-slogan { font-size: 9px; opacity: 0.3; letter-spacing: 2px; margin-bottom: 35px; text-transform: uppercase; }
.footer-socials { display: flex; justify-content: center; gap: 25px; margin-bottom: 35px; }
.footer-socials a { color: #fff; font-size: 20px; opacity: 0.6; text-decoration: none; }
.footer-contact-title { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 10px; }
.footer-contact-info { font-size: 11px; opacity: 0.5; line-height: 1.8; margin-bottom: 40px; }
.footer-contact-info a { color: inherit; text-decoration: none; }
.copyright { font-size: 9px; opacity: 0.2; letter-spacing: 1px; margin-top: 20px; }

/* PAGE SYSTEM */
.page { position: fixed; inset: 0; overflow-y: auto; background: #000; opacity: 0; transform: translateY(20px); transition: 0.4s ease-out; pointer-events: none; z-index: 1; }
.page.active { opacity: 1; transform: translateY(0); pointer-events: auto; z-index: 10; }

/* DETAIL & GRID */
.detail-container { max-width: 500px; margin: auto; padding: 20px 24px 160px; }
.img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 60px; }
.img-grid img { width: 100%; border-radius: 15px; aspect-ratio: 4/5; object-fit: cover; border: 1px solid #1a1a1a; }
.section-label { margin-top: 30px; font-size: 11px; font-weight: 700; color: #555; letter-spacing: 1.5px; text-transform: uppercase; }
.option-box { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
.option-box div { padding: 16px; border: 1.5px solid #1a1a1a; text-align: center; border-radius: 12px; cursor: pointer; background: #050505; font-size: 14px; font-weight: 600; }
.option-box div.active { background: #fff; color: #000; border-color: #fff; }
.option-box div.disabled { opacity: 0.1; cursor: not-allowed; border: 1px dashed #333; text-decoration: line-through; }

/* INPUTS */
.input-group { margin-bottom: 25px; }
.input-group label { display: block; font-size: 11px; font-weight: 700; color: #888; margin-bottom: 10px; }
input, textarea { width: 100%; padding: 18px; background: #0a0a0a; border: 1.5px solid #1a1a1a; color: #fff; border-radius: 15px; font-family: inherit; font-size: 15px; }

/* BUTTONS */
button { background: #fff; color: #000; border: none; padding: 20px; width: 100%; font-weight: 700; border-radius: 15px; cursor: pointer; transition: 0.2s; }
.btn-container { margin-top: 40px; }
.back-btn { position: fixed; top: 25px; left: 20px; z-index: 150; font-weight: 700; font-size: 12px; cursor: pointer; opacity: 0.6; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 10px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: none; justify-content: center; align-items: center; z-index: 2000; padding: 20px; }

.modal-overlay { 
    position: fixed; 
    inset: 0; 
    background: rgba(0,0,0,0.95); 
    display: none; 
    justify-content: center; 
    align-items: center; 
    z-index: 10000; 
    padding: 20px;
}

.specs-box {
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    padding: 30px;
    border-radius: 20px;
    width: 90%;
    max-width: 400px;
    text-align: left;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}