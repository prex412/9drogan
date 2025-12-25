(function(){
  function getLang(){
    try{
      const stored = localStorage.getItem('nd_lang');
      if (stored) return stored;
    }catch(e){}
    const htmlLang = document.documentElement.getAttribute('lang');
    return htmlLang || 'en';
  }

  function setContent(el, value, asHtml){
    if (asHtml) el.innerHTML = value || '';
    else el.textContent = value || '';
  }

  function render(lang){
    const root = document.getElementById('itinerary-root');
    if(!root || !window.ND_ITINERARY) return;

    const dict = window.ND_ITINERARY[lang] || window.ND_ITINERARY.en;
    const headers = dict.headers;
    const days = dict.days || [];

    const asHtml = (lang !== 'zh');
    root.innerHTML = '';

    days.forEach(day=>{
      const details = document.createElement('details');
      details.className = 'day';
      details.open = (day.id === 1);

      const summary = document.createElement('summary');
      summary.className = 'day-title';
      summary.textContent = day.title;
      details.appendChild(summary);

      const tableWrap = document.createElement('div');
      tableWrap.className = 'day-table';

      const table = document.createElement('table');
      table.className = 'it-table';
      const thead = document.createElement('thead');
      const trh = document.createElement('tr');

      ['time','place','note'].forEach(k=>{
        const th = document.createElement('th');
        th.textContent = headers[k] || k;
        trh.appendChild(th);
      });
      thead.appendChild(trh);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      (day.rows||[]).forEach(r=>{
        const tr = document.createElement('tr');
        const tdTime = document.createElement('td');
        const tdPlace = document.createElement('td');
        const tdNote = document.createElement('td');

        tdTime.textContent = r.time || '';
        setContent(tdPlace, r.place, asHtml);
        setContent(tdNote, r.note, asHtml);

        tr.appendChild(tdTime);
        tr.appendChild(tdPlace);
        tr.appendChild(tdNote);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      tableWrap.appendChild(table);
      details.appendChild(tableWrap);
      root.appendChild(details);
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    render(getLang());
  });

  document.addEventListener('nd:lang', (e)=>{
    const lang = (e && e.detail && e.detail.lang) ? e.detail.lang : getLang();
    render(lang);
  });
})();