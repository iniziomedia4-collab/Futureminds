const fs=require('fs');const {JSDOM}=require('jsdom');
const bundle=fs.readFileSync('data/bundle.js','utf8');const app=fs.readFileSync('assets/js/app.js','utf8');
const dom=new JSDOM('<!DOCTYPE html><body data-page="global-partnerships" class="no-js"><div id="site-nav"></div><main id="page-main"></main><div id="site-footer"></div></body>',{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/global-partnerships.html'});
const w=dom.window;
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
w.requestAnimationFrame=cb=>0;
let err=null;w.addEventListener('error',e=>err=(e.error&&e.error.stack)||e.message);
try{w.eval(bundle);w.eval(app);}catch(e){err=e.stack||e.message;}
setTimeout(function(){
  const doc=w.document, html=doc.getElementById('page-main').innerHTML;
  console.log('mainLen',html.length, err?('ERR '+err.split('\n')[0]):'OK');
  console.log('navLink', /global-partnerships\.html/.test(doc.getElementById('site-nav').innerHTML));
  console.log('active', [].slice.call(doc.querySelectorAll('.nav-links a.active,.nav-drop.active')).map(a=>a.textContent.trim()).join(',')||'(none)');
  ['Building Partnerships That Create Global Impact','Explore Partnership Opportunities','Start a Conversation','partnership-pathways','eee-nursing','not an OET coaching programme','Responsible Global Readiness','Let Us Build What the Future Needs','Contact Us'].forEach(c=>console.log((html.includes(c)?'[x] ':'[ ] ')+c));
  console.log('sections',(html.match(/<section/g)||[]).length);
  process.exit(0);
},80);
