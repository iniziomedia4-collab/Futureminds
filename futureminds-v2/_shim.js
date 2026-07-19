const fs=require('fs');
const store={};
function stub(id){return {id,_html:'',get innerHTML(){return this._html},set innerHTML(v){this._html=v;store[id]=v},classList:{add(){},remove(){},toggle(){}},querySelectorAll(){return[]},querySelector(){return null},addEventListener(){},appendChild(){},setAttribute(){},style:{},dataset:{},reset(){},value:''};}
const els={'page-main':stub('page-main'),'site-nav':stub('site-nav'),'site-footer':stub('site-footer')};
global.window=global;
global.window.matchMedia=()=>({matches:false,addEventListener(){}});
global.window.addEventListener=()=>{};
global.window.requestAnimationFrame=()=>0;
global.window.location={pathname:'/global-partnerships.html'};
global.document={ body:{dataset:{page:'global-partnerships'},classList:{remove(){}},appendChild(){}},
  getElementById:id=>els[id]||null, createElement:()=>stub('x'), querySelectorAll:()=>[], querySelector:()=>null, addEventListener:()=>{} };
global.fetch=()=>Promise.reject('no fetch');
// load bundle then app
eval(fs.readFileSync('data/bundle.js','utf8'));
eval(fs.readFileSync('assets/js/app.js','utf8'));
setTimeout(()=>{
  const html=store['page-main']||''; const nav=store['site-nav']||'';
  console.log('mainLen',html.length);
  console.log('navHasGP', /global-partnerships\.html/.test(nav));
  ['Building Partnerships That Create Global Impact','Explore Partnership Opportunities','Start a Conversation','id="partnership-pathways"','id="eee-nursing"','not an OET coaching programme','Responsible Global Readiness','Let Us Build What the Future Needs','Contact Us','var(--surface)'].forEach(c=>console.log((html.includes(c)?'[x] ':'[ ] ')+c));
  console.log('sections',(html.match(/<section/g)||[]).length);
  console.log('undefinedInHtml', html.includes('undefined'));
  process.exit(0);
},50);
