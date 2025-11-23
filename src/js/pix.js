import '../css/pix.css';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"; 

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css"; 

const PIXABAY_API_KEY = "53378626-1c7fc3c0eb24b69adb1804063"; 

// Arayüz Elementleri
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loader = document.getElementById('loader');

// SimpleLightbox'ı başlatma ve ayarları
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'title', 
    captionDelay: 250,
});

// ==========================================================
// 2. YARDIMCI FONKSİYONLAR
// ==========================================================

function showToast(message, type = 'error') {
    // iziToast kullanımı
    iziToast[type]({
        message: message,
        position: 'topRight',
        timeout: 5000,
        backgroundColor: type === 'error' ? '#EF4040' : '#59A100',
        titleColor: '#FFFFFF',
        messageColor: '#FFFFFF',
        iconColor: '#FFFFFF',
    });
}

function toggleLoader(show) {
    // Yükleyiciyi gösterme/gizleme
    // loader elementinin CSS stillerinde başlangıçta 'display: none;' olduğundan emin olun.
    loader.style.display = show ? 'block' : 'none';
}

function createGalleryMarkup(images) {
    return images.map(image => `
        <div class="photo-card">
            <a href="${image.largeImageURL}" title="${image.tags}">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Beğeni</b>${image.likes}</p>
                <p class="info-item"><b>Görüntüleme</b>${image.views}</p>
                <p class="info-item"><b>Yorum</b>${image.comments}</p>
                <p class="info-item"><b>İndirme</b>${image.downloads}</p>
            </div>
        </div>
    `).join('');
}

async function fetchImages(query) {
    const searchParams = new URLSearchParams({
        key: PIXABAY_API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
    });

    const url = `https://pixabay.com/api/?${searchParams}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP Hata! Durum: ${response.status}`);
    }
    const data = await response.json();
    return data.hits; 
}


// ==========================================================
// 3. ANA İŞLEV (Arama ve Güncelleme)
// ==========================================================

async function onSearch(event) {
    event.preventDefault(); 
    
    const form = event.currentTarget;
    const query = form.elements.searchQuery.value.trim();

    if (query === "") {
        gallery.innerHTML = ''; 
        showToast('Lütfen bir arama terimi girin.', 'warning');
        return;
    }

    // 1. Galeri içeriğini temizle
    gallery.innerHTML = ''; 
    // 2. Yükleyiciyi göster (HTTP isteği başlamadan hemen önce)
    toggleLoader(true);

    // Promise zinciri then() ve catch() yöntemleriyle hataları işler
    fetchImages(query)
        .then(images => {
            if (images.length === 0) {
                // Sonuç yoksa iziToast ile mesaj göster
                showToast('Sorry, there are no images matching your search query. Please try again!');
            } else {
                // Görselleri tek işlemle DOM'a ekle
                const markup = createGalleryMarkup(images);
                gallery.innerHTML = markup;
                
                // SimpleLightbox'ı yenile
                lightbox.refresh();
            }
        })
        .catch(error => {
            // Hata durumunda konsola logla ve iziToast göster
            console.error('API isteği sırasında hata:', error);
            showToast('Görsel arama sırasında beklenmeyen bir hata oluştu.', 'error');
        })
        .finally(() => {
            // Yükleyiciyi gizle (İstek tamamlandıktan sonra kaybolmalıdır)
            toggleLoader(false);
            form.reset(); 
        });
}

searchForm.addEventListener('submit', onSearch);