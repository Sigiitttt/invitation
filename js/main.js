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
            // Delay sedikit agar aset benar-benar siap
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transition = 'opacity 0.5s ease-out';
                
                // Hapus elemen setelah transisi selesai
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger animasi AOS ulang setelah loading selesai
                    if (typeof AOS !== 'undefined') AOS.refresh();
                }, 500); // Waktu sama dengan durasi transition CSS
            }, 800);
        });
    }
}


// === 3. AUDIO PLAYER & COVER LOGIC ===
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-control');
const opening = document.getElementById('opening');
let isPlaying = false;

// Fungsi Buka Undangan
function openInvitation() {
    // 1. Geser Cover ke Atas
    if (opening) {
        opening.style.transform = 'translateY(-100%)';
        opening.style.transition = 'transform 1s ease-in-out';
    }

    // 2. Enable Scroll pada Body
    document.body.style.overflow = 'auto';

    // 3. Mainkan Musik
    playMusic();

    // 4. Tampilkan Tombol Musik
    if (musicBtn) {
        musicBtn.classList.remove('hidden');
        musicBtn.classList.add('flex');
        // Fade in tombol musik
        setTimeout(() => {
            musicBtn.style.opacity = '1';
        }, 100);
    }
}

// Fungsi Internal Play Musik
function playMusic() {
    if (audio) {
        audio.play().then(() => {
            isPlaying = true;
            updateMusicIcon();
        }).catch(err => {
            console.warn("Autoplay ditahan browser. Menunggu interaksi user.");
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

// Update Icon Tombol Musik
function updateMusicIcon() {
    if (!musicBtn) return;

    if (isPlaying) {
        // Icon Disc Berputar
        musicBtn.innerHTML = '<i data-lucide="disc-3" class="text-primary w-5 h-5 md:w-6 md:h-6"></i>';
        musicBtn.classList.add('animate-spin-slow');
        musicBtn.style.opacity = '1';
    } else {
        // Icon Pause
        musicBtn.innerHTML = '<i data-lucide="pause" class="text-gray-400 w-5 h-5 md:w-6 md:h-6"></i>';
        musicBtn.classList.remove('animate-spin-slow');
        musicBtn.style.opacity = '0.7';
    }
    // Re-render icon lucide
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Event Listener Tombol Musik
if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        isPlaying ? pauseMusic() : playMusic();
    });
}


// === 4. NAMA TAMU DARI URL ===
function handleGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const tamuRaw = urlParams.get('to');
    
    if (tamuRaw) {
        // Decode URI & Sanitasi Dasar
        // textContent lebih aman dari XSS dibanding innerText/innerHTML
        const tamu = decodeURIComponent(tamuRaw);

        // Ganti nama di Cover
        const guestElement = document.getElementById('namaTamu');
        if (guestElement) {
            guestElement.textContent = tamu;
        }

        // Isi otomatis di Form RSVP
        const formInput = document.getElementById('guestName');
        if (formInput) {
            formInput.value = tamu;
        }
    }
}


// === 5. COUNTDOWN TIMER (OPTIMIZED) ===
function initCountdown() {
    const targetDate = new Date("Dec 20, 2026 08:00:00").getTime();
    
    // Cache elemen DOM agar tidak dicari ulang setiap detik (Performance Boost)
    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMinutes = document.getElementById("minutes");
    const elSeconds = document.getElementById("seconds");

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            elDays.innerText = "00";
            elHours.innerText = "00";
            elMinutes.innerText = "00";
            elSeconds.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update Text
        elDays.innerText = days < 10 ? "0" + days : days;
        elHours.innerText = hours < 10 ? "0" + hours : hours;
        elMinutes.innerText = minutes < 10 ? "0" + minutes : minutes;
        elSeconds.innerText = seconds < 10 ? "0" + seconds : seconds;

    }, 1000);
}


// === 6. SWIPER GALLERY (INFINITE LOOP MULUS) ===
if (document.querySelector(".mySwiper")) {
    var swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        
        // Loop Setting
        loop: true,
        
        // KITA TURUNKAN SEDIKIT AGAR AMAN JIKA SLIDE DIKIT
        // Jika total slide HTML ada 6, loopedSlides sebaiknya sekitar 3 atau 4.
        loopedSlides: 4, 
        
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
        },

        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false, 
        },

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
    // Timeout kecil agar transisi opacity berjalan
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
    }, 300); 
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}


// === 8. FITUR COPY TEXT ===
function copyText(elementId, textToCopy) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Berhasil disalin: " + textToCopy);
        }).catch(() => {
            fallbackCopyText(textToCopy);
        });
    } else {
        fallbackCopyText(textToCopy);
    }
}

function fallbackCopyText(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        alert("Berhasil disalin: " + text);
    } catch (err) {
        alert("Gagal menyalin. Silakan salin manual.");
    }
    document.body.removeChild(textArea);
}


// === 9. LOGIKA RSVP WHATSAPP ===
function submitRSVP(event) {
    event.preventDefault();

    const name = document.getElementById('guestName').value;
    const count = document.getElementById('guestCount').value;
    const statusRadio = document.querySelector('input[name="status"]:checked');
    const status = statusRadio ? statusRadio.value : "Belum Memilih";
    const message = document.getElementById('guestMessage').value;

    if (!name) {
        alert("Mohon isi nama Anda.");
        return;
    }

    if (status === "Belum Memilih") {
        alert("Mohon pilih status kehadiran.");
        return;
    }

    const waMessage = `Halo Romeo & Juliet, %0A` +
        `Saya *${name}* ingin konfirmasi kehadiran undangan pernikahan kalian. %0A%0A` +
        `• Jumlah: ${count} Orang %0A` +
        `• Status: ${status} %0A` +
        `• Pesan: ${message} %0A%0A` +
        `Terima kasih!`;

    const phoneNumber = "6281234567890"; 
    const waURL = `https://wa.me/${phoneNumber}?text=${waMessage}`;
    
    window.open(waURL, '_blank');
}


// === 10. PRIVACY (DISABLE RIGHT CLICK) ===
// document.addEventListener('contextmenu', event => event.preventDefault());

// document.onkeydown = function(e) {
//     if(e.keyCode == 123) return false; // F12
//     if(e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false;
//     if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
// }