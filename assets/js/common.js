/* Common helpers for all pages */
(function(){
  // Footer year
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year-template]').forEach(el=>{
    const tpl = el.getAttribute('data-year-template');
    if (tpl === 'footer.note') el.textContent = `© ${year} Nine Dragon Sports Development Company. All rights reserved.`;
  });

  // Mobile nav toggle
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && toggle){
    const setOpen = (open)=>{
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', ()=>{
      setOpen(!nav.classList.contains('open'));
    });
    document.addEventListener('click', (e)=>{
      if (!nav.classList.contains('open')) return;
      const inside = nav.contains(e.target) || toggle.contains(e.target);
      if (!inside) setOpen(false);
    });
    window.addEventListener('resize', ()=>{
      if (window.matchMedia('(min-width: 921px)').matches) setOpen(false);
    });
  }

  // Dropdown open on click/tap (works for desktop + mobile)
  const items = Array.from(document.querySelectorAll('.nav .item'));
  const closeAll = (except)=>{
    items.forEach(it=>{ if (it!==except) it.classList.remove('open'); });
  };
  items.forEach(item=>{
    const a = item.querySelector(':scope > a');
    const dd = item.querySelector(':scope > .dropdown');
    if (!a || !dd) return;

    a.addEventListener('click', (e)=>{
      // First click opens submenu, second click navigates to the top-level page.
      if (!item.classList.contains('open')){
        e.preventDefault();
        closeAll(item);
        item.classList.add('open');
      }
    });

    // If user clicks any submenu link, allow navigation and close menus.
    dd.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>{
        closeAll();
      });
    });
  });

  // Close submenu when clicking outside the navbar
  document.addEventListener('click', (e)=>{
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (!navbar.contains(e.target)) closeAll();
  });

  // Close submenu on Escape
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeAll();
  });

// View mode toggle (force mobile/desktop)
const viewBtn = document.getElementById('viewToggle');
const VIEW_KEY = 'nd_view';
const mq = window.matchMedia('(max-width: 920px)');

const setEffective = ()=>{
  try{ document.body.classList.toggle('effective-mobile', mq.matches); }catch(e){}
};
setEffective();
try{
  if (mq.addEventListener) mq.addEventListener('change', setEffective);
  else mq.addListener(setEffective);
}catch(e){}

const applyView = (mode)=>{
  if (!['auto','mobile','desktop'].includes(mode)) mode = 'auto';
  document.body.classList.toggle('force-mobile', mode === 'mobile');
  document.body.classList.toggle('force-desktop', mode === 'desktop');
  localStorage.setItem(VIEW_KEY, mode);

  // Close menus when switching view
  try{
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded','false');
  }catch(e){}
  closeAll();
};

const initMode = localStorage.getItem(VIEW_KEY) || 'auto';
applyView(initMode);

if (viewBtn){
  viewBtn.addEventListener('click', ()=>{
    const cur = localStorage.getItem(VIEW_KEY) || 'auto';
    const effectiveMobile = document.body.classList.contains('effective-mobile');
    let next;
    if (cur === 'desktop') next = 'mobile';
    else if (cur === 'mobile') next = 'desktop';
    else next = effectiveMobile ? 'desktop' : 'mobile'; // from auto
    applyView(next);
  });
}
})();
