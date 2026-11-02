(() => {
  'use strict';
  const recipient = 'podcastomi@gmail.com';
  const projects = {unsure:'Help me choose',freellm:'FreeLLM Hub',rea:'REA Developer Ecosystem',seo:'Universal SEO Agent Suite',vedaachari:'VedaaChari',omsetra:'Omsetra'};
  function selection(search) {
    const query = new URLSearchParams(search);
    const id = query.get('project');
    return {project:Object.hasOwn(projects,id) ? id : 'unsure', offer:query.get('offer') === 'paid' ? 'paid' : 'free'};
  }
  function buildRequest({project='unsure',offer='free',name='',task=''}) {
    const title = Object.hasOwn(projects,project) ? projects[project] : projects.unsure;
    const paid = offer === 'paid';
    const subject = `${paid ? 'Personal help enquiry' : 'Free pilot request'} — ${title}`;
    const body = `Hi Om,\n\nI’d like to ask about ${paid ? 'personal paid help' : 'the free pilot'} for ${title}.\n\nName: ${String(name).trim().slice(0,80) || 'Not provided'}\n\nMy task:\n${String(task).trim().slice(0,1200)}\n\nPlease confirm availability${paid ? ', the exact scope, total price, delivery and cancellation terms before I pay' : ' and whether this task is a fit for the free pilot'}.\n\nThank you!`;
    return {subject,body};
  }
  function makeMailto(request) {
    return `mailto:${recipient}?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {selection,buildRequest,makeMailto};
  if (typeof document === 'undefined') return;
  const orderProduct = document.getElementById('order-product');
  if (orderProduct && window.OM_OFFERS) {
    const id = new URLSearchParams(location.search).get('project');
    orderProduct.value = ['seo','vedaachari'].includes(id) ? id : 'vedaachari';
    const updateOrder = () => {
      const p = window.OM_OFFERS[orderProduct.value];
      for (const [id,value] of Object.entries({'order-brand':p.name,'order-title':p.paid,'order-price':`₹${p.price}`,'order-scope':p.scope,'order-note':p.note})) document.getElementById(id).textContent=value;
      document.getElementById('order-request').href=`join.html?project=${p.id}&offer=paid`;
      document.getElementById('order-payment').href=`support.html?project=${p.id}#qr`;
    };
    orderProduct.addEventListener('change',updateOrder);
    updateOrder();
  }
  const form = document.getElementById('pilot-form');
  if (form) {
    const project = document.getElementById('project');
    const name = document.getElementById('name');
    const task = document.getElementById('task');
    const preview = document.getElementById('request-preview');
    const status = document.getElementById('join-status');
    const selected = selection(location.search);
    project.value = selected.project;
    form.querySelector(`input[name="offer"][value="${selected.offer}"]`).checked = true;
    const request = () => buildRequest({project:project.value,offer:form.querySelector('input[name="offer"]:checked').value,name:name.value,task:task.value});
    const update = () => {const r=request();preview.value=`To: ${recipient}\nSubject: ${r.subject}\n\n${r.body}`;};
    form.addEventListener('input',update);
    form.addEventListener('change',update);
    form.addEventListener('submit',event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      update();
      status.textContent='Your draft is ready. Send it in your email app to complete the request. If no app opens, use “Copy your request” below. This website has not submitted or stored your request.';
      location.href = makeMailto(request());
    });
    document.getElementById('copy-request').addEventListener('click',async () => {
      update();
      try {await navigator.clipboard.writeText(preview.value);status.textContent=`Request copied. Paste it into your email service and send to ${recipient}.`;}
      catch {preview.focus();preview.select();status.textContent='Select and copy the request preview, then paste it into your email service.';}
    });
    update();
  }
  document.getElementById('copy-upi')?.addEventListener('click',async () => {
    const status = document.getElementById('payment-status');
    try {await navigator.clipboard.writeText('8104235964@naviaxis');status.textContent='UPI ID copied. Check the payee in your payment app before confirming.';}
    catch {status.textContent='Copy this UPI ID manually: 8104235964@naviaxis';}
  });
})();
