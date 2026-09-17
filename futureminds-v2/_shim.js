const fs=require('fs');const store={};
function stub(id){return {id,_html:'',get innerHTML(){return this._html},set innerHTML(v){this._html=v;store[id]=v},classList:{add(){},remove(){},toggle(){}},querySelectorAll(){return[]},querySelector(){return null},addEventListener(){},appendChild(){},setAttribute(){},style:{},dataset:{},reset(){},value:''};}
const els={'page-main':stub('page-main'),'site-nav':stub('site-nav'),'site-footer':stub('site-footer')};
global.window=global;window.matchMedia=()=>({matches:false,addEventListener(){}});window.addEventListener=()=>{};window.requestAnimationFrame=()=>0;window.location={pathname:'/index.html'};
global.document={body:{dataset:{page:'home'},classList:{remove(){}},appendChild(){}},getElementById:id=>els[id]||null,createElement:()=>stub('x'),querySelectorAll:()=>[],querySelector:()=>null,addEventListener:()=>{}};
global.fetch=()=>Promise.reject('x');
eval(fs.readFileSync('data/bundle.js','utf8'));eval(fs.readFileSync('assets/js/app.js','utf8'));
setTimeout(()=>{
  const nav=store['site-nav']||'', foot=store['site-footer']||'';
  const cpy=(foot.match(/&copy;[^<]*/)||[''])[0];
  console.log('copyright:', cpy.trim());
  console.log('nav brand alt has India:', /alt="Futureminds India/.test(nav));
  console.log('nav wordmark:', /Future<b>minds<\/b> India/.test(nav));
  console.log('footer accreditations KSHEC:', foot.includes('KSHEC'));
  console.log('any stray "Futureminds." (no India):', /Futureminds\.(?! )/.test(foot+store['page-main']) && !/futureminds\./.test('x'));
  process.exit(0);
},60);
