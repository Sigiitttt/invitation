/* THE WEDDING OF ROMEO & JULIET
   Main JavaScript Logic
   Optimized for Performance & UX
*/

// === 1. INISIALISASI LIBRARY (AOS & LUCIDE) ===
document.addEventListener('DOMContentLoaded', () => {
    // Render Icon Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Init AOS (Animasi Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,     // Animasi hanya jalan sekali agar tidak berat
            duration: 1000, // Durasi smooth
            offset: 50,     // Trigger sedikit lebih awal
        });
    }

    // Jalankan fitur lainnya
    handlePreloader();
    handleGuestName();
    initCountdown();
});


// === 2. PRELOADER (LAYAR LOADING) ===
function handlePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger animasi AOS ulang setelah loading selesai
                    if (typeof AOS !== 'undefined') AOS.refresh();
                }, 1000);
            }, 1000);
        });
    }
}


// === 3. AUDIO PLAYER & COVER LOGIC ===
const audio = document.getElementById('bg-music'); // ID audio tag
const musicBtn = document.getElementById('music-control'); // ID tombol bulat
const opening = document.getElementById('opening'); // ID section cover
let isPlaying = false;

// Fungsi Buka Undangan
function openInvitation() {
    // 1. Geser Cover ke Atas
    if (opening) {
        opening.style.transform = 'translateY(-100%)';
    }

    // 2. Enable Scroll pada Body
    document.body.style.overflow = 'auto'; // Cara lebih simpel daripada classList

    // 3. Mainkan Musik
    playMusic();

    // 4. Tampilkan Tombol Musik
    if (musicBtn) {
        musicBtn.classList.remove('hidden');
        musicBtn.classList.add('flex'); // Pastikan display flex agar center
    }
}

// Fungsi Internal Play Musik
function playMusic() {
    if (audio) {
        audio.play().then(() => {
            isPlaying = true;
            updateMusicIcon();
        }).catch(err => {
            console.log("Autoplay ditahan browser. Menunggu interaksi user.");
            isPlaying = false;
            updateMusicIcon();
        });
    }
}

// Fungsi Internal Pause Musik
function pauseMusic() {
    if (audio) {
        audio.pause();
        isPlaying = false;
        updateMusicIcon();
    }
}

// Update Icon Tombol Musik (Berputar/Diam)
function updateMusicIcon() {
    if (!musicBtn) return;

    if (isPlaying) {
        // Icon Disc Berputar
        musicBtn.innerHTML = '<i data-lucide="disc-3" class="text-primary w-5 h-5 md:w-6 md:h-6"></i>';
        musicBtn.classList.add('animate-spin-slow');
        musicBtn.style.opacity = '1';
    } else {
        // Icon Pause / Stop
        musicBtn.innerHTML = '<i data-lucide="pause" class="text-gray-400 w-5 h-5 md:w-6 md:h-6"></i>';
        musicBtn.classList.remove('animate-spin-slow');
        musicBtn.style.opacity = '0.7';
    }
    // Re-render icon lucide karena innerHTML berubah
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Event Listener Tombol Musik
if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
}


// === 4. NAMA TAMU DARI URL ===
function handleGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const tamuRaw = urlParams.get('to');
    
    if (tamuRaw) {
        // Decode agar spasi (%20) terbaca normal
        // Gunakan DOMPurify jika ingin lebih aman dari XSS, tapi escape sederhana cukup untuk nama
        const tamu = decodeURIComponent(tamuRaw).replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Ganti nama di Cover
        const guestElement = document.getElementById('namaTamu');
        if (guestElement) {
            guestElement.innerText = tamu;
        }

        // Isi otomatis di Form RSVP
        const formInput = document.getElementById('guestName');
        if (formInput) {
            formInput.value = tamu;
        }
    }
}


// === 5. COUNTDOWN TIMER ===
function initCountdown() {
    // Set Tanggal Acara (Format: Bulan Tanggal, Tahun Jam:Menit:Detik)
    const weddingDate = new Date("Dec 20, 2026 08:00:00").getTime();
    
    // Cek apakah elemen ada sebelum dijalankan
    if (!document.getElementById("days")) return;

    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

        // Jika waktu habis
        if (distance < 0) {
            clearInterval(countdownInterval);
            ["days", "hours", "minutes", "seconds"].forEach(id => {
                document.getElementById(id).innerText = "00";
            });
        }
    }, 1000);
}


// === 6. SWIPER GALLERY (INFINITE LOOP) ===
if (document.querySelector(".mySwiper")) {
    var swiper = new Swiper(".mySwiper", {
        // Efek 3D Card
        effect: "coverflow",
        grabCursor: true,       // Cursor berubah jadi tangan saat drag
        centeredSlides: true,   // Slide aktif selalu di tengah
        slidesPerView: "auto",  // Ukuran slide mengikuti CSS (w-60 / w-80)
        
        // --- SETTING LOOPING ---
        loop: true,             // INI KUNCINYA: Agar bisa geser tanpa henti
        loopedSlides: 3,        // Jumlah slide bayangan agar loop mulus (minimal 2-3)
        
        // --- AUTOPLAY ---
        autoplay: {
            delay: 2500,        // Geser otomatis tiap 2.5 detik
            disableOnInteraction: false, // Tetap autoplay walau user sudah geser
        },

        // --- PENGATURAN EFEK 3D ---
        coverflowEffect: {
            rotate: 0,          // Rotasi slide samping (0 biar tegak)
            stretch: 0,         // Jarak antar slide
            depth: 100,         // Kedalaman (zoom out slide samping)
            modifier: 2,        // Kekuatan efek
            slideShadows: false, // Matikan shadow bawaan swiper (kita pakai shadow CSS)
        },

        // --- TITIK NAVIGASI ---
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}


// === 7. MODAL FOTO (LIGHTBOX) ===
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("imgModalSrc");

function openModal(src) {
    if (!modal || !modalImg) return;
    
    modal.classList.remove("hidden");
    // Gunakan requestAnimationFrame atau timeout kecil untuk transisi CSS
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modalImg.classList.remove("scale-90");
        modalImg.classList.add("scale-100");
    }, 10);
    
    modalImg.src = src;
}

function closeModal() {
    if (!modal || !modalImg) return;

    modal.classList.add("opacity-0");
    modalImg.classList.remove("scale-100");
    modalImg.classList.add("scale-90");

    setTimeout(() => {
        modal.classList.add("hidden");
        modalImg.src = "";
    }, 300); // Sesuaikan dengan durasi transition-all di CSS (300ms)
}

// Tutup modal jika klik di area gelap (luar foto)
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}


// === 8. FITUR COPY TEXT (GIFT) ===
function copyText(elementId, textToCopy) {
    // Fallback untuk browser lama atau koneksi non-secure (http)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Berhasil disalin: " + textToCopy);
        }).catch(err => {
            alert("Gagal menyalin. Silakan salin manual.");
        });
    } else {
        // Metode lama (Fallback)
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Berhasil disalin: " + textToCopy);
        } catch (err) {
            alert("Gagal menyalin. Silakan salin manual.");
        }
        document.body.removeChild(textArea);
    }
}


// === 9. LOGIKA RSVP WHATSAPP ===
function submitRSVP(event) {
    event.preventDefault();

    const name = document.getElementById('guestName').value;
    const count = document.getElementById('guestCount').value;
    // Handle radio button selection safely
    const statusRadio = document.querySelector('input[name="status"]:checked');
    const status = statusRadio ? statusRadio.value : "Belum Memilih";
    const message = document.getElementById('guestMessage').value;

    if (!name) {
        alert("Mohon isi nama Anda.");
        return;
    }

    const waMessage = `Halo Romeo & Juliet, %0A` +
        `Saya *${name}* ingin konfirmasi kehadiran undangan pernikahan kalian. %0A%0A` +
        `• Jumlah: ${count} Orang %0A` +
        `• Status: ${status} %0A` +
        `• Pesan: ${message} %0A%0A` +
        `Terima kasih!`;

    const phoneNumber = "6281234567890"; // Ganti No WA
    const waURL = `https://wa.me/${phoneNumber}?text=${waMessage}`;
    
    window.open(waURL, '_blank');
    
    // Opsional: document.getElementById('rsvpForm').reset();
}


// === 10. PRIVACY & SECURITY (DISABLE RIGHT CLICK) ===
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if(event.keyCode == 123) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
}