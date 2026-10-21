const {chromium}=require('C:/Users/ndrwb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[],bad=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4173')&&r.status()>=400)bad.push(r.url())});
 const base='http://127.0.0.1:4173/';
 fs.mkdirSync('review',{recursive:true});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(1400);
 console.log('Running animations',await page.evaluate(()=>document.getAnimations().length));
 assert.ok(await page.evaluate(()=>document.getAnimations().length)>0);
 await page.locator('.drawer-toggle').click();
 assert.equal(await page.locator('.drawer-toggle').getAttribute('aria-pressed'),'true');
 assert.ok(await page.locator('.joinery-art').evaluate(el=>el.classList.contains('drawer-open')));
 await page.goto(base+'gallery.html',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.gallery-card').count(),24);
 const categoryCounts={kitchens:3,wardrobes:11,details:2,cabinetry:1,doors:2,interiors:3,inspiration:4,all:24};
 for(const [category,count] of Object.entries(categoryCounts)){
  await page.locator('[data-filter="'+category+'"]').click();
  assert.equal(await page.locator('.gallery-card:visible').count(),count);
 }
 await page.locator('.gallery-card').first().click();
 for(let i=1;i<=24;i++){
  const img=page.locator('#dialog-photo');
  await img.evaluate(el=>el.decode());
  assert.ok(await img.evaluate(el=>el.naturalWidth>0));
  assert.match(await page.locator('#photo-counter').textContent(),new RegExp(String(i).padStart(2,'0')+' / 24'));
  if(i<24)await page.keyboard.press('ArrowRight');
 }
 await page.keyboard.press('Escape');assert.equal(await page.locator('#project-dialog').evaluate(d=>d.open),false);
 await page.locator('[data-video="2"]').click();
 await page.locator('#video-dialog video').evaluate(v=>new Promise((resolve,reject)=>{if(v.readyState>=2)return resolve();v.addEventListener('loadeddata',resolve,{once:true});v.addEventListener('error',()=>reject(v.error),{once:true})}));
 assert.ok(await page.locator('#video-dialog video').evaluate(v=>v.videoWidth>0));await page.keyboard.press('Escape');
 await page.goto(base+'contact.html',{waitUntil:'domcontentloaded'});
 await page.locator('#quick-toggle').click();assert.equal(await page.locator('#quick-toggle').getAttribute('aria-expanded'),'true');
 assert.equal(await page.locator('#quick-contact a[href^="sms:"]').getAttribute('href'),'sms:+254724271972');
 assert.ok((await page.locator('.whatsapp-float').getAttribute('href')).startsWith('https://wa.me/254724271972?'));
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#contact-form').evaluate(f=>f.checkValidity()),false);
 await page.locator('#name').fill('Amina & James');
 await page.locator('#email').fill('amina@example.com');
 await page.locator('#phone').fill('0712345678');
 await page.locator('#project').selectOption({label:'Kitchen'});
 await page.locator('#message').fill('An oak kitchen & pantry.\nCan we discuss sizes?');
 await page.evaluate(()=>document.querySelector('#draft-link').addEventListener('click',e=>e.preventDefault()));
 await page.getByRole('button',{name:'Open email draft'}).click();
 const draft=await page.locator('#draft-link').getAttribute('href');
 const mail=new URL(draft);assert.equal(mail.pathname,'blaster320@gmail.com');assert.match(mail.searchParams.get('subject'),/Kitchen/);assert.match(mail.searchParams.get('body'),/Amina & James/);assert.match(mail.searchParams.get('body'),/An oak kitchen & pantry\.\r\nCan we discuss sizes\?/);assert.ok(await page.locator('#draft-link').isVisible());console.log('Email draft recipient, subject, multiline body and special characters passed.');
 for(const route of ['index.html','gallery.html','about.html','contact.html']){
  await page.goto(base+route,{waitUntil:'networkidle'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode().catch(()=>{})))});
  await page.waitForTimeout(500);
  await page.waitForFunction(()=>[...document.images].filter(i=>i.getAttribute('src')).every(i=>i.complete&&i.naturalWidth>0));
  const broken=await page.evaluate(()=>[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[]);
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:width===1440?1000:844});await page.waitForTimeout(120);
   const dims=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
   assert.equal(dims.document,dims.viewport,route+' overflow at '+width);
   if(width===390||width===1440)await page.screenshot({path:'review/'+route.replace('.html','')+'-'+width+'.png',fullPage:true});
  }
  console.log(route+' assets and layouts passed at 320/390/768/1440.');
 }
 await page.setViewportSize({width:390,height:844});await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');assert.equal(await page.locator('#main-nav a:visible').count(),4);await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
 console.log('PASS: gallery, all 24 photo views, video playback, drawer, mobile menu, contact links, form draft, reduced motion, all page assets, 16 responsive layouts. No runtime errors or failed local requests.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
