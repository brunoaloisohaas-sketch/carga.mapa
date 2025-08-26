// Estado
const LS = { nfs:'xg_nfs' };
function loadLS(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch(e){ return fallback; } }
function saveLS(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
let nfs = loadLS(LS.nfs, []);

// Registrar eventos após DOM pronto
window.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab').forEach(sec=>{
        sec.style.display = (sec.id===btn.dataset.tab?'block':'none');
      });
    });
  });

  // Salvar NF
  const btNF = document.getElementById("btSalvarNF");
  if (btNF) {
    btNF.addEventListener("click", ()=>{
      const nf = {
        numero: document.getElementById("nfNumero").value.trim(),
        datahora: document.getElementById("nfDataHora").value,
        rem: document.getElementById("nfRem").value.trim(),
        dest: document.getElementById("nfDest").value.trim(),
        volumes: Number(document.getElementById("nfVolumes").value||0),
        peso: Number(document.getElementById("nfPeso").value||0),
        m3: Number(document.getElementById("nfM3").value||0),
        rota: document.getElementById("nfRota").value,
        resp: document.getElementById("nfResp").value.trim(),
        obs: document.getElementById("nfObs").value.trim()
      };
      if(!nf.numero){ alert("Informe número da NF"); return; }
      nfs.unshift(nf);
      saveLS(LS.nfs, nfs);
      renderDashboardCards();
      alert("NF salva!");
      // Limpar campos
      ["nfNumero","nfDataHora","nfRem","nfDest","nfVolumes","nfPeso","nfM3","nfResp","nfObs"].forEach(id=>{
        const el = document.getElementById(id); if (el) el.value = "";
      });
    });
  }
  const API_URL = "https://script.google.com/macros/s/AKfycbw8AjQGE2bGbN0FAFek53d1IL7TavTSIcaGskRDrDvnWCQdxPpOQK_5tD2A2jCbu0VOWA/exec"; // coloque a URL do Apps Script

let nfs = [];

document.getElementById('adminBtn').addEventListener('click', () => {
    isAdmin = !isAdmin;
    document.getElementById('adminBtn').innerText = isAdmin ? 'Sair Admin' : 'Entrar como Admin';
    renderDashboardCards();
});

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

async function loadNFs() {
    const res = await fetch(API_URL);
    nfs = await res.json();
    renderDashboardCards();
}

async function addNF(cidade, peso, volume, data) {
    await fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams({
            action: "add",
            cidade,
            peso,
            volume,
            data
        })
    });
    loadNFs();
}

async function deleteNF(id) {
    await fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams({
            action: "delete",
            id
        })
    });
    loadNFs();
}

// carrega ao iniciar
loadNFs();


  // ETA
  const btCalc = document.getElementById("btCalcETA");
  const btSave = document.getElementById("btSalvarETA");
  if (btCalc) {
    btCalc.addEventListener("click", ()=>{
      const partida = document.getElementById("etaPartida").value;
      const min = Number(document.getElementById("etaMin").value);
      if(!partida || !min){ alert("Informe partida e duração"); return; }
      const d = new Date(partida);
      const eta = new Date(d.getTime() + min*60000);
      document.getElementById("etaOut").textContent = `Chegada prevista: ${eta.toLocaleString()}`;
    });
  }
  if (btSave) {
    btSave.addEventListener("click", ()=>{
      localStorage.setItem("xg_eta", document.getElementById("etaOut").textContent);
      alert("ETA salvo no resumo!");
    });
  }

  // Inicialização
  renderDashboardCards();
});
