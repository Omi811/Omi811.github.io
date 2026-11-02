(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.querySelector('#orbit');
  const context = canvas.getContext('2d');
  const toggle = document.querySelector('#motion-toggle');
  const progress = document.querySelector('.progress');
  let paused = reduced.matches, width = 0, height = 0, frame = 0, angle = .4;
  let visible = true, previous = 0, pointerX = 0, pointerY = 0;

  document.querySelector('#year').textContent = new Date().getFullYear();
  function updateProgress() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${available > 0 ? Math.min(100, window.scrollY / available * 100) : 0}%`;
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  window.addEventListener('resize', updateProgress);
  updateProgress();

  if (!context) { toggle.hidden = true; return; }
  function draw() {
    context.clearRect(0, 0, width, height);
    const radius = Math.min(width * .38, height * .37);
    const cx = width * .5, cy = height * .5;
    const tilt = .42 + pointerY * .08;
    const points = [];
    for (let ring = 0; ring < 17; ring++) {
      const latitude = Math.PI * (ring + 1) / 18;
      for (let i = 0; i < 100; i++) {
        const longitude = i / 100 * Math.PI * 2 + angle + pointerX * .1;
        const x = Math.sin(latitude) * Math.cos(longitude);
        const y = Math.cos(latitude);
        const z = Math.sin(latitude) * Math.sin(longitude);
        const ry = y * Math.cos(tilt) - z * Math.sin(tilt);
        const rz = y * Math.sin(tilt) + z * Math.cos(tilt);
        points.push({x:cx + x * radius, y:cy + ry * radius, z:rz});
      }
    }
    points.sort((a,b) => a.z-b.z);
    for (const point of points) {
      const alpha = .10 + (point.z + 1) * .29;
      context.fillStyle = `rgba(221,166,126,${alpha})`;
      context.beginPath(); context.arc(point.x, point.y, point.z > .3 ? 1 : .65, 0, Math.PI * 2); context.fill();
    }
    for (let orbit = 0; orbit < 3; orbit++) {
      context.beginPath();
      for (let i = 0; i <= 240; i++) {
        const t = i / 240 * Math.PI * 2;
        const rotation = -.62 + orbit * .63;
        const x = Math.cos(t) * radius * 1.25;
        const y = Math.sin(t) * radius * (.3 + orbit * .08);
        const px = cx + x * Math.cos(rotation) - y * Math.sin(rotation);
        const py = cy + x * Math.sin(rotation) + y * Math.cos(rotation);
        if (!i) context.moveTo(px, py); else context.lineTo(px, py);
      }
      context.strokeStyle = `rgba(221,166,126,${.22-orbit*.035})`; context.lineWidth = .7; context.stroke();
      const t = angle * (orbit % 2 ? -1 : 1) + orbit * 2;
      const rotation = -.62 + orbit * .63;
      const x = Math.cos(t) * radius * 1.25, y = Math.sin(t) * radius * (.3 + orbit * .08);
      context.beginPath(); context.arc(cx + x * Math.cos(rotation)-y*Math.sin(rotation),cy+x*Math.sin(rotation)+y*Math.cos(rotation),2,0,Math.PI*2);
      context.fillStyle = '#e5c5a6'; context.fill();
    }
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
  }
  function animate(now) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (now - previous >= 32) { angle += .0025; draw(); previous = now; }
    frame = window.requestAnimationFrame(animate);
  }
  function sync() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.innerHTML = paused ? 'Play motion <span>▷</span>' : 'Pause motion <span>Ⅱ</span>';
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (!paused && visible && !document.hidden) frame = window.requestAnimationFrame(animate);
    else draw();
  }
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  document.querySelector('.hero').addEventListener('pointermove', event => {
    if (paused || event.pointerType !== 'mouse') return;
    const box = canvas.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (event.clientX-box.left)/box.width-.5));
    pointerY = Math.max(-1, Math.min(1, (event.clientY-box.top)/box.height-.5));
  }, {passive:true});
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(canvas);
  new ResizeObserver(resize).observe(canvas);
  resize(); sync();
})();
