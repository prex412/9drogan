(function(){
  function encode(s){ return encodeURIComponent(String(s||"")); }

  function buildMailto(values){
    const to = "pxiang4@asu.edu";
    const subject = `[Nine Dragon Inquiry] ${values.topic || "General"}`;
    const bodyLines = [
      `Name: ${values.name || ""}`,
      `Email: ${values.email || ""}`,
      `Topic: ${values.topic || ""}`,
      "",
      values.message || ""
    ];
    const body = bodyLines.join("\n");
    return `mailto:${to}?subject=${encode(subject)}&body=${encode(body)}`;
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const form = document.getElementById("inquiryForm");
    if(!form) return;

    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const values = {
        name: fd.get("name"),
        email: fd.get("email"),
        topic: fd.get("topic"),
        message: fd.get("message")
      };
      if(!form.reportValidity()) return;
      window.location.href = buildMailto(values);
    });
  });
})();