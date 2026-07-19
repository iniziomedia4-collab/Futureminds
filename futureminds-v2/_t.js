const fs=require('fs');const {JSDOM}=require('jsdom');
const bundle=fs.readFileSync('data/bundle.js','utf8');const app=fs.readFileSync('assets/js/app.js','utf8');
function render(page){
  const dom=new JSDOM('<!DOCTYPE html><body data-page="'+page+'" class="no-js"><div id="site-nav"></div><main id="page-main"></main><div id="site-footer"></div></body>',{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/'+page+'.html'});
  const w=dom.window;
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),0);
  let err=null;w.addEventListener('error',e=>err=(e.error&&e.error.stack)||e.message);
  try{w.eval(bundle);w.eval(app);}catch(e){err=e.stack||e.message;}
  return {w,err};
}
(async()=>{
  const {w,err}=render('global-partnerships');
  await new Promise(r=>setTimeout(r,60));
  const doc=w.document, html=doc.getElementById('page-main').innerHTML;
  const out=[];
  out.push('GP mainLen '+html.length+' '+(err?('ERR '+err.split('\n')[0]):'OK'));
  out.push('nav link: '+/global-partnerships\.html/.test(doc.getElementById('site-nav').innerHTML));
  out.push('active: '+([].slice.call(doc.querySelectorAll('.nav-links a.active, .nav-drop.active')).map(a=>a.textContent.trim()).join(',')||'(none)'));
  ['Building Partnerships That Create Global Impact','Explore Partnership Opportunities','Start a Conversation','partnership-pathways','eee-nursing','not an OET coaching programme','Responsible Global Readiness','Let Us Build What the Future Needs','Partner With Futureminds','Contact Us'].forEach(c=>out.push('['+(html.includes(c)?'x':' ')+'] '+c));
  out.push('sections '+(html.match(/<section/g)||[]).length);
  const r2=render('about'); await new Promise(r=>setTimeout(r,40));
  out.push('about mainLen '+r2.w.document.getElementById('page-main').innerHTML.length+' '+(r2.err?('ERR '+r2.err.split('\n')[0]):'OK'));
  fs.writeFileSync('/tmp/t.out', out.join('\n'));
})();
