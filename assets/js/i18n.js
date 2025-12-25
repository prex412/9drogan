(function(){
  const supported = ["en","zh","ja"];
  const defaultLang = "en";

  function getQueryLang(){
    const p = new URLSearchParams(window.location.search);
    const q = p.get("lang");
    if(q && supported.includes(q)) return q;
    return null;
  }

  function getLang(){
    return getQueryLang() || localStorage.getItem("nd_lang") || defaultLang;
  }

  function getRoot(){
    const meta = document.querySelector('meta[name="nd-root"]');
    return meta ? meta.getAttribute("content") : "./";
  }

  async function loadDict(lang){
    const root = getRoot();
    const res = await fetch(`${root}i18n/${lang}.json`);
    if(!res.ok) throw new Error("Failed to load language file");
    return await res.json();
  }

  function apply(dict){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if(typeof val === "string") el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el=>{
      const key = el.getAttribute("data-i18n-html");
      const val = dict[key];
      if(typeof val === "string") el.innerHTML = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
      const key = el.getAttribute("data-i18n-placeholder");
      const val = dict[key];
      if(typeof val === "string") el.setAttribute("placeholder", val);
    });

    const titleKey = document.documentElement.getAttribute("data-title-key");
    if(titleKey && dict[titleKey]){
      const suffix = dict["meta.title_suffix"] || "";
      document.title = `${dict[titleKey]} | ${suffix}`;
    }

    const year = new Date().getFullYear();
    document.querySelectorAll("[data-year-template]").forEach(el=>{
      const key = el.getAttribute("data-year-template");
      const tpl = dict[key];
      if(typeof tpl === "string"){
        el.textContent = tpl.replace("{year}", String(year));
      }
    });
  }

  function setActiveLang(lang){
    document.querySelectorAll("[data-lang]").forEach(btn=>{
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  async function setLang(lang){
    if(!supported.includes(lang)) lang = defaultLang;
    localStorage.setItem("nd_lang", lang);
    setActiveLang(lang);
    try{
      const dict = await loadDict(lang);
      apply(dict);
      try{ document.documentElement.setAttribute('lang', lang); }catch(e){}
      try{ document.dispatchEvent(new CustomEvent('nd:lang', {detail:{lang}})); }catch(e){}
    }catch(e){
      console.error(e);
    }
  }

  function wireLangButtons(){
    document.querySelectorAll("[data-lang]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const lang = btn.getAttribute("data-lang");
        setLang(lang);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    wireLangButtons();
    setLang(getLang());
  });

  window.ND_I18N = { setLang };
})();
