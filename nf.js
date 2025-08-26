// nf.js — versão final LF Transportes com expand/collapse por cidade
(function () {
  const STORAGE_KEY = 'lf_nfs_v1';
  let notas = [];

  // util: parse number
  function parseNumber(v) {
    if (!v && v !== 0) return 0;
    const n = Number(String(v).trim().replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }

  // capitaliza palavras
  function capitalizeWords(str) {
    if (!str) return '';
    return String(str).toLowerCase().split(' ').filter(Boolean)
      .map(s => s[0].toUpperCase() + s.slice(1))
      .join(' ');
  }

  // transforma uma chave em id-safe (apenas letras, números, hífen, underscore)
  function makeSafeId(key) {
    return String(key || 'outra')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-');
  }

  // storage
  function loadFromStorage() {
    try {
      notas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      notas = [];
    }
  }
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
  }

  // agrupa notas por cidade
  function agruparPorCidade() {
    const mapa = {};
    notas.forEach(nf => {
      const key = (nf.rota || 'Outra').trim().toLowerCase();
      if (!mapa[key]) {
        mapa[key] = {
          display: capitalizeWords(nf.rota || 'Outra'),
          qtd: 0,
          volumes: 0,
          peso: 0,
          m3: 0
        };
      }
      mapa[key].qtd += 1;
      mapa[key].volumes += parseNumber(nf.volumes);
      mapa[key].peso += parseNumber(nf.peso);
      mapa[key].m3 += parseNumber(nf.m3);
    });
    return mapa;
  }

  // Toggle show/hide lista (usado pelos botões)
  function toggleLista(safeId) {
    const el = document.getElementById('lista-' + safeId);
    const btn = document.getElementById('btn-' + safeId);
    if (!el) return;
    const isHidden = window.getComputedStyle(el).display === 'none';
    el.style.display = isHidden ? 'block' : 'none';
    if (btn) btn.textContent = isHidden ? 'Ocultar Detalhes' : 'Mostrar Detalhes';
  }

  // criar markup para lista de NFs (HTML string)
  function montarListaNFs(nfsCidade) {
    if (!nfsCidade || !nfsCidade.length) return '<div style="font-style:italic">— sem NFs —</div>';
    let lista = '<ul style="margin:6px 0;padding-left:18px">';
    nfsCidade.forEach(nf => {
      const dataFmt = nf.dataHora ? new Date(nf.dataHora).toLocaleString('pt-BR') : '-';
      lista += `<li style="margin:6px 0">
        <strong>NF:</strong> ${nf.numero || '-'} &nbsp;•&nbsp;
        <strong>Data:</strong> ${dataFmt} &nbsp;•&nbsp;
        <strong>Resp:</strong> ${nf.resp || '-'}
      </li>`;
    });
    lista += '</ul>';
    return lista;
  }

  // atualizar Resumo (tabela) com botão de expandir
  function atualizarResumo() {
    const resumo = agruparPorCidade();
    const out = document.getElementById('sumResumo');
    if (!out) return;

    let html = "<table class='table-resumo' style='width:100%;border-collapse:collapse'><thead><tr style='text-align:left'><th>Cidade</th><th>Notas</th><th>Volumes</th><th>Peso (kg)</th><th>m³</th><th>Detalhes</th></tr></thead><tbody>";

    for (const key in resumo) {
      const r = resumo[key];
      const safeId = makeSafeId(key);
      const nfsCidade = notas.filter(nf => (nf.rota || 'Outra').trim().toLowerCase() === key);
      const listaHtml = montarListaNFs(nfsCidade);

      html += `<tr>
        <td style="vertical-align:top;padding:8px">${r.display}</td>
        <td style="vertical-align:top;padding:8px">${r.qtd}</td>
        <td style="vertical-align:top;padding:8px">${r.volumes}</td>
        <td style="vertical-align:top;padding:8px">${r.peso.toFixed(2)}</td>
        <td style="vertical-align:top;padding:8px">${r.m3.toFixed(2)}</td>
        <td style="vertical-align:top;padding:8px">
          <button id="btn-${safeId}" style="padding:6px 8px;border-radius:6px;cursor:pointer" onclick="LF_NF_toggle('${safeId}')">Mostrar Detalhes</button>
          <div id="lista-${safeId}" style="display:none;margin-top:8px">${listaHtml}</div>
        </td>
      </tr>`;
    }

    html += "</tbody></table>";
    out.innerHTML = html;
  }

  // atualizar Dashboard (cards) com botão de expandir
  function atualizarDashboard() {
    const resumo = agruparPorCidade();
    const out = document.getElementById('dashCards');
    if (!out) return;

    let html = '';
    for (const key in resumo) {
      const r = resumo[key];
      const safeId = makeSafeId(key);
      const nfsCidade = notas.filter(nf => (nf.rota || 'Outra').trim().toLowerCase() === key);
      const listaHtml = montarListaNFs(nfsCidade);

      html += `<div class="card" style="padding:12px;margin:8px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08)">
        <h3 style="margin:0 0 6px 0">${r.display}</h3>
        <p style="margin:4px 0">Notas: <b>${r.qtd}</b> • Volumes: <b>${r.volumes}</b> • Peso: <b>${r.peso.toFixed(2)} kg</b> • m³: <b>${r.m3.toFixed(2)}</b></p>
        <button id="btn-${safeId}" style="padding:6px 8px;border-radius:6px;cursor:pointer" onclick="LF_NF_toggle('${safeId}')">Mostrar Detalhes</button>
        <div id="lista-${safeId}" style="display:none;margin-top:8px">${listaHtml}</div>
      </div>`;
    }

    out.innerHTML = html;
  }

  // limpa formulário
  function limparCamposNF() {
    const ids = ['nfNumero','nfDataHora','nfRem','nfDest','nfVolumes','nfPeso','nfM3','nfResp','nfObs'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  // salvar NF do form
  function salvarNFFromForm() {
    const get = id => document.getElementById(id)?.value || '';
    const nf = {
      numero: get('nfNumero'),
      dataHora: get('nfDataHora'),
      remetente: get('nfRem'),
      destinatario: get('nfDest'),
      volumes: parseNumber(get('nfVolumes')),
      peso: parseNumber(get('nfPeso')),
      m3: parseNumber(get('nfM3')),
      rota: get('nfRota') || 'Outra',
      resp: get('nfResp'),
      obs: get('nfObs')
    };
    notas.push(nf);
    saveToStorage();
    atualizarResumo();
    atualizarDashboard();
    limparCamposNF();
    return true;
  }

  // init
  document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    atualizarResumo();
    atualizarDashboard();

    const bt = document.getElementById('btSalvarNF');
    if (!bt) return;
    if (bt.__lf_bound) return;
    bt.__lf_bound = true;
    bt.addEventListener('click', ev => {
      ev.preventDefault();
      salvarNFFromForm();
    });
  });

  // expõe toggle para os botões inline que usamos no HTML gerado
  window.LF_NF_toggle = function (safeId) {
    toggleLista(safeId);
  };

  // exporta para debug
  window.LF_NF = {
    notas,
    salvarNFFromForm,
    atualizarResumo,
    atualizarDashboard,
    limparCamposNF,
    toggleLista
  };
})();
