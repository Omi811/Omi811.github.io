const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function fixture(prefersReducedMotion) {
  const elements = new Map();
  function element(selector) {
    if (elements.has(selector)) return elements.get(selector);
    const el = {attributes:{},listeners:{},style:{setProperty(k,v){this[k]=v;}},classList:{toggle(){}},
      addEventListener(name,handler){this.listeners[name]=handler;},
      setAttribute(name,value){this.attributes[name]=value;},
      getBoundingClientRect(){return {top:-100,bottom:800,height:900};}};
    elements.set(selector, el); return el;
  }
  const dots = Array.from({length:5}, (_,i)=>element(`dot${i}`));
  const track = element('#highlight-track');
  track.children = Array.from({length:5}, (_,i)=>({offsetLeft:100+i*464}));
  track.scrollLeft = 0; track.scrollWidth = 2656; track.clientWidth = 800;
  track.scrollTo = ({left}) => {track.scrollLeft = left;track.listeners.scroll();};
  const media = {matches:prefersReducedMotion,addEventListener(){}};
  const window = {innerHeight:900,matchMedia(){return media;},addEventListener(){},requestAnimationFrame(fn){fn();return 0;}};
  const document = {hidden:false,body:element('body'),querySelector:element,querySelectorAll:()=>dots};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'cinema.js'),'utf8'),{
    window,document,ResizeObserver:class {constructor(fn){this.fn=fn;}observe(){this.fn();}},Date,
  });
  return {elements,dots,track,element};
}

const standard = fixture(false);
assert.equal(standard.element('#motion-toggle').attributes['aria-pressed'],'false');
standard.element('#motion-toggle').listeners.click();
assert.equal(standard.element('#motion-toggle').attributes['aria-pressed'],'true');
standard.element('#motion-toggle').listeners.click();
assert.equal(standard.element('#motion-toggle').attributes['aria-pressed'],'false');
assert.equal(standard.element('#gallery-prev').disabled,true);
standard.element('#gallery-next').listeners.click();
assert.equal(standard.track.scrollLeft,464);
assert.equal(standard.dots[1].attributes['aria-current'],'true');
standard.dots[4].listeners.click();
assert.equal(standard.element('#gallery-count').textContent,'05 / 05');
assert.equal(standard.element('#gallery-next').disabled,true);
let prevented = false;
standard.track.listeners.keydown({target:standard.track,key:'ArrowLeft',preventDefault(){prevented=true;}});
assert.equal(prevented,true);
assert.equal(standard.element('#gallery-count').textContent,'04 / 05');
const reduced = fixture(true);
assert.equal(reduced.element('#motion-toggle').attributes['aria-pressed'],'true');
assert.equal(reduced.element('#motion-toggle').disabled,true);
assert.equal(reduced.element('.hero').style['--hero-shift'],undefined);
console.log('PASS: gallery boundaries, direct selection, keyboard navigation, pause/resume and reduced-motion defaults.');
