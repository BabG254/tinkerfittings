const photos = [
 {id:1,title:'Inside the wardrobe',category:'wardrobes',type:'Wardrobe interior',description:'Open shelves, hanging space and overhead storage.'},
 {id:2,title:'Room for everything',category:'wardrobes',type:'Fitted wardrobe',description:'A wider view of the fitted wardrobe and its open compartments.'},
 {id:3,title:'A simpler space',category:'wardrobes',type:'Wardrobe compartment',description:'A single fitted wardrobe compartment with hanging rails and overhead storage.'},
 {id:4,title:'A richer shade',category:'kitchens',type:'Kitchen cabinetry',description:'Wood-toned wall cupboards and fitted base cabinets around a corner kitchen worktop.'},
 {id:5,title:'At the heart of home',category:'kitchens',type:'Fitted kitchen',description:'A kitchen installation with warm cabinetry and corner storage.'},
 {id:6,title:'Warmth, imagined',category:'inspiration',type:'Design inspiration · render',description:'Supplied kitchen concept image. Shown as design inspiration, rather than as a photographed installation.'},
 {id:7,title:'A different perspective',category:'inspiration',type:'Design inspiration · render',description:'Supplied kitchen concept image. Shown as design inspiration, rather than as a photographed installation.'},
 {id:8,title:'A place for everything',category:'wardrobes',type:'Fitted wardrobe',description:'A full-height wardrobe with overhead cupboards, drawers and a dressing niche.'},
 {id:9,title:'It’s in the grain',category:'details',type:'Cabinet detail',description:'A close-up of timber-toned drawer fronts and dark cabinet handles during fitting.'},
 {id:10,title:'Behind a small door',category:'details',type:'Wall cupboard detail',description:'An open wall cupboard with internal shelving.'},
 {id:11,title:'Clean lines, full height',category:'wardrobes',type:'Fitted storage',description:'Pale fitted wardrobe doors with contrasting horizontal and vertical trim.'},
 {id:12,title:'A quiet kind of order',category:'cabinetry',type:'Bathroom vanity',description:'A double-basin vanity with drawers and under-counter storage, photographed during fitting.'},
 {id:13,title:'Warmth, fitted in',category:'kitchens',type:'Kitchen installation',description:'Another view of the wood-toned kitchen cabinetry during installation.'},
 {id:14,title:'From the inside out',category:'wardrobes',type:'Wardrobe interior',description:'Shelves, hanging rails and open compartments in a timber-toned fitted wardrobe.'},
 {id:15,title:'Open to possibilities',category:'wardrobes',type:'Wardrobe fitting',description:'A fitted wardrobe with its doors open to show the storage layout.'},
 {id:16,title:'A natural fit',category:'wardrobes',type:'Fitted wardrobe',description:'Timber-toned doors, dark handles and a central drawer stack.'}
];
let currentPhoto=0;
const photoDialog=document.querySelector('#project-dialog');
const videoDialog=document.querySelector('#video-dialog');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function photoCard(p){
 const b=document.createElement('button');b.className='gallery-card reveal';b.dataset.category=p.category;b.setAttribute('aria-label','View '+p.title+', '+p.type);
 b.innerHTML='<div class="gallery-photo"><img src="assets/image'+p.id+'.webp" alt="" loading="lazy" width="900" height="1200">'+(p.category==='inspiration'?'<span class="image-badge">DESIGN INSPIRATION</span>':'')+'<span class="project-arrow" aria-hidden="true">↗</span></div><div class="gallery-meta"><div><h3>'+p.title+'</h3><p>'+p.type+'</p></div><span>'+String(p.id).padStart(2,'0')+'</span></div>';
 b.querySelector('img').alt=p.type+': '+p.description;
 const image=b.querySelector('img');image.srcset='assets/image'+p.id+'-480.webp 480w, assets/image'+p.id+'-900.webp 900w, assets/image'+p.id+'.webp 1440w';image.sizes=document.body.dataset.page==='home'?'(max-width: 640px) 88vw, 28vw':'(max-width: 480px) 88vw, (max-width: 640px) 42vw, 28vw';image.decoding='async';
 b.addEventListener('click',()=>openPhoto(photos.indexOf(p)));return b;
}
const fullGallery=document.querySelector('[data-full-gallery]');if(fullGallery)photos.forEach(p=>fullGallery.append(photoCard(p)));
const homeGallery=document.querySelector('[data-home-gallery]');if(homeGallery)[13,8,12].forEach(id=>homeGallery.append(photoCard(photos.find(p=>p.id===id))));
function filterGallery(category){
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 let count=0;document.querySelectorAll('[data-full-gallery] .gallery-card').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden){count++;card.classList.add('is-visible')}});
 const summary=document.querySelector('.filter-summary');if(summary)summary.textContent='Showing '+count+' '+(category==='all'?'images':category==='inspiration'?'design inspiration images':category+' images')+'. Select any image for a closer look.';
}
const validFilters=['all','kitchens','wardrobes','details','cabinetry','inspiration'];
const initialCategory=new URLSearchParams(location.search).get('category');if(fullGallery&&validFilters.includes(initialCategory))filterGallery(initialCategory);
for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{filterGallery(button.dataset.filter);const url=new URL(location.href);if(button.dataset.filter==='all')url.searchParams.delete('category');else url.searchParams.set('category',button.dataset.filter);history.replaceState({},'',url)});
function paintPhoto(){const p=photos[currentPhoto];document.querySelector('#dialog-title').textContent=p.title;document.querySelector('#dialog-category').textContent=p.type.toUpperCase();document.querySelector('#dialog-description').textContent=p.description;const img=document.querySelector('#dialog-photo');img.src='assets/image'+p.id+'.webp';img.alt=p.type+': '+p.description;document.querySelector('#photo-counter').textContent=String(currentPhoto+1).padStart(2,'0')+' / '+photos.length;}
function showDialog(d){d.showModal();document.body.classList.add('modal-open')}
function openPhoto(index){currentPhoto=index;paintPhoto();showDialog(photoDialog);photoDialog.scrollTop=0}
function movePhoto(direction){currentPhoto=(currentPhoto+direction+photos.length)%photos.length;paintPhoto()}
photoDialog?.querySelector('.photo-prev').addEventListener('click',()=>movePhoto(-1));photoDialog?.querySelector('.photo-next').addEventListener('click',()=>movePhoto(1));
photoDialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1)}if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1)}});
for(const d of document.querySelectorAll('dialog')){d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()});d.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(d===videoDialog){const v=d.querySelector('video');v.pause();v.removeAttribute('src');v.load()}})}
for(const button of document.querySelectorAll('[data-video]'))button.addEventListener('click',()=>{const video=videoDialog.querySelector('video');video.src='assets/video'+button.dataset.video+'.mp4';showDialog(videoDialog);video.play().catch(()=>{})});
const menuToggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
function closeMenu(){menuToggle?.setAttribute('aria-expanded','false');menuToggle?.setAttribute('aria-label','Open navigation');nav?.classList.remove('is-open')}
menuToggle?.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open)});
const quickToggle=document.querySelector('#quick-toggle'),quickPanel=document.querySelector('#quick-contact');
function closeQuick(){if(quickPanel)quickPanel.hidden=true;quickToggle?.setAttribute('aria-expanded','false')}
quickToggle?.addEventListener('click',()=>{quickPanel.hidden=!quickPanel.hidden;quickToggle.setAttribute('aria-expanded',String(!quickPanel.hidden))});
addEventListener('click',e=>{if(!e.target.closest('.floating-contact'))closeQuick();if(!e.target.closest('.header'))closeMenu()});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeQuick();closeMenu()}});
const drawerButton=document.querySelector('.drawer-toggle');drawerButton?.addEventListener('click',()=>{const open=drawerButton.getAttribute('aria-pressed')!=='true';drawerButton.setAttribute('aria-pressed',String(open));drawerButton.closest('.joinery-art').classList.toggle('drawer-open',open);drawerButton.innerHTML=(open?'Close the drawer':'Open the drawer')+' <span>↗</span>'});
function createEmailDraft(values){
 const subject='Project enquiry — '+(values.project||'Tinka Fitting Solutions');
 const body='Hello Tinka Fitting Solutions,\r\n\r\n'+values.message.replace(/\r?\n/g,'\r\n')+'\r\n\r\nProject: '+values.project+'\r\nName: '+values.name+'\r\nEmail: '+values.email+(values.phone?'\r\nPhone: '+values.phone:'')+'\r\n\r\nSent from the Tinka portfolio.';
 return 'mailto:blaster320@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}
window.createEmailDraft=createEmailDraft;
const form=document.querySelector('#contact-form');form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const values=Object.fromEntries(new FormData(form));Object.keys(values).forEach(k=>values[k]=values[k].trim());const draft=createEmailDraft(values),link=document.querySelector('#draft-link');link.href=draft;link.hidden=false;document.querySelector('#form-status').textContent='Your email draft is ready. In your email app, review it and press Send. If it did not open, use the link below or email blaster320@gmail.com.';link.click()});
if(!reduced.matches&&'IntersectionObserver' in window){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px 20px 0px'});document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--reveal-delay',String(i%3*80)+'ms');observer.observe(el)})}
reduced.addEventListener('change',()=>{if(reduced.matches)document.body.classList.remove('motion-ready')});
