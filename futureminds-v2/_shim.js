const fs=require('fs');
const store={};
function stub(id){return {id,_html:'',get innerHTML(){return this._html},set innerHTML(v){this._html=v;store[id]=v},classList:{add(){},remove(){},toggle(){}},querySelectorAll(){return[]},querySelector(){return null},addEventListener(){},appendChild(){},setAttribute(){},style:{},dataset:{},reset(){},value:''};}
const els={'page-main':stub('page-main'),'site-nav':stub('site-nav'),'site-footer':stub('site-footer')};
global.window=global;window.matchMedia=()=>({matches:false,addEventListener(){}});window.addEventListener=()=>{};window.requestAnimationFrame=()=>0;window.location={pathname:'/global-partnerships.html'};
global.document={body:{dataset:{page:'global-partnerships'},classList:{remove(){}},appendChild(){}},getElementById:id=>els[id]||null,createElement:()=>stub('x'),querySelectorAll:()=>[],querySelector:()=>null,addEventListener:()=>{}};
global.fetch=()=>Promise.reject('x');
eval(fs.readFileSync('data/bundle.js','utf8'));
eval(fs.readFileSync('assets/js/app.js','utf8'));
setTimeout(()=>{
  const h=store['page-main']||'', f=store['site-footer']||'';
  console.log('mainLen',h.length,'undefined?',h.includes('undefined'));
  ['img/sections/1.3.png','img/sections/1.1.png','img/sections/1.2.png','gp-hero-grid','gp-split'].forEach(c=>console.log((h.includes(c)?'[x] ':'[ ] ')+c));
  console.log('footer KSHEC:', f.includes('Recommended by KSHEC'), '| KHEC-only:', /Recommended by KHEC\b/.test(f));
  console.log('footer middot ok:', f.includes('All rights reserved. &middot; Bengaluru')|| f.includes('All rights reserved. · Bengaluru'), '| has Â:', f.includes('Â'));
  process.exit(0);
},50);
