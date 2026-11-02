const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function run({reduced=false,mobile=false}={}) {
  const callbacks=[],observations=[],mutations=[],events={};
  let paused=false,cancelled=0,started=0;
  function node(rect={top:0,bottom:1000,height:1000}) {
    return {style:{values:{},setProperty(k,v){this.values[k]=v;},removeProperty(k){delete this.values[k];}},
      getBoundingClientRect(){return rect;},classList:{contains:()=>false},
      animate(){started++;return {cancel(){cancelled++;},finished:Promise.resolve()};}};
  }
  const sculpture=node(),display=node();display.offsetTop=600;
  const hero=node({top:-1000,bottom:0,height:1000});hero.id='home';hero.classList.contains=x=>x==='hero';hero.querySelector=x=>x==='.hero-sculpture'?sculpture:null;
  const project=node({top:0,bottom:1400,height:1400});project.id='freellm';project.querySelector=()=>display;
  const nav=node(),descriptor={textContent:'Independent engineer'},heading=node();
  const body={classList:{contains:()=>paused}};
  const document={hidden:false,body,documentElement:{scrollHeight:5000},
    querySelector:s=>({'.local-nav':nav,'.local-descriptor':descriptor,'.hero-sculpture':sculpture})[s],
    querySelectorAll:s=>s==='.product-display'?[display]:s.startsWith('.hero,')?[hero,project]:[heading],
    addEventListener(n,fn){events[n]=fn;}};
  const window={innerHeight:800,scrollY:100,addEventListener(n,fn){events[n]=fn;}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'scroll-motion.js'),'utf8'),{
    window,document,matchMedia:q=>({matches:q.includes('reduced')?reduced:mobile,addEventListener(){}}),
    requestAnimationFrame:fn=>{callbacks.push(fn);return callbacks.length;},
    IntersectionObserver:class{constructor(fn){observations.push(fn);}observe(){}unobserve(){}},
    MutationObserver:class{constructor(fn){mutations.push(fn);}observe(){}},Set,WeakSet,
  });
  observations[0]([{target:hero,isIntersecting:true},{target:project,isIntersecting:true}]);
  while(callbacks.length)callbacks.shift()();
  return {sculpture,display,descriptor,nav,heading,observations,events,callbacks,
    pause(){paused=true;mutations[0]();},get started(){return started;},get cancelled(){return cancelled;}};
}
const desktop=run();
assert.ok(Number(desktop.display.style.values['--display-scale'])<1);
assert.ok(Number(desktop.display.style.values['--display-scale'])>.94);
assert.ok(desktop.sculpture.style.values['--sculpture-turn']);
assert.equal(desktop.descriptor.textContent,'FreeLLM Hub');
desktop.observations[1]([{target:desktop.heading,isIntersecting:true}]);
assert.equal(desktop.started,1);
desktop.pause();
assert.equal(desktop.cancelled,1);
assert.deepEqual(desktop.display.style.values,{});
const reduced=run({reduced:true});
assert.deepEqual(reduced.display.style.values,{});
reduced.observations[1]([{target:reduced.heading,isIntersecting:true}]);
assert.equal(reduced.started,0);
const mobile=run({mobile:true});
assert.ok(Number(mobile.display.style.values['--display-scale'])>Number(run().display.style.values['--display-scale']));
console.log('PASS: viewport-based product motion, chapter labels, entrance cancellation, reduced motion and gentler mobile motion.');
