import"./assets/modulepreload-polyfill-B5Qt9EMX.js";import{S as c,i as l}from"./assets/vendor-BrddEoy-.js";const m="53378626-1c7fc3c0eb24b69adb1804063",u=document.getElementById("search-form"),o=document.querySelector(".gallery"),h=document.getElementById("loader"),f=new c(".gallery a",{captionsData:"title",captionDelay:250});function n(r,e="error"){l[e]({message:r,position:"topRight",timeout:5e3,backgroundColor:e==="error"?"#EF4040":"#59A100",titleColor:"#FFFFFF",messageColor:"#FFFFFF",iconColor:"#FFFFFF"})}function i(r){h.style.display=r?"block":"none"}function d(r){return r.map(e=>`
        <div class="photo-card">
            <a href="${e.largeImageURL}" title="${e.tags}">
                <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Beğeni</b>${e.likes}</p>
                <p class="info-item"><b>Görüntüleme</b>${e.views}</p>
                <p class="info-item"><b>Yorum</b>${e.comments}</p>
                <p class="info-item"><b>İndirme</b>${e.downloads}</p>
            </div>
        </div>
    `).join("")}async function p(r){const a=`https://pixabay.com/api/?${new URLSearchParams({key:m,q:r,image_type:"photo",orientation:"horizontal",safesearch:"true"})}`,t=await fetch(a);if(!t.ok)throw new Error(`HTTP Hata! Durum: ${t.status}`);return(await t.json()).hits}async function y(r){r.preventDefault();const e=r.currentTarget,a=e.elements.searchQuery.value.trim();if(a===""){o.innerHTML="",n("Lütfen bir arama terimi girin.","warning");return}o.innerHTML="",i(!0),p(a).then(t=>{if(t.length===0)n("Sorry, there are no images matching your search query. Please try again!");else{const s=d(t);o.innerHTML=s,f.refresh()}}).catch(t=>{console.error("API isteği sırasında hata:",t),n("Görsel arama sırasında beklenmeyen bir hata oluştu.","error")}).finally(()=>{i(!1),e.reset()})}u.addEventListener("submit",y);
//# sourceMappingURL=pix.js.map
