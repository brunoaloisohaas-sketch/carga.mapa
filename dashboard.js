function renderDashboardCards() {
  const container = document.getElementById("dashCards");
  if (!container) return;

  container.innerHTML = "";

  // Modo simplificado no celular (não-admin)
  if (isMobile() && !isAdmin()) {
    container.innerHTML = "<p class='muted'>📱 Versão simplificada no celular (somente Admin vê os cards completos).</p>";
    return;
  }

  if (!nfs || !nfs.length) {
    container.innerHTML = "<div class='empty'>Nenhuma NF cadastrada ainda. Vá em <b>Cadastrar NF</b> para adicionar.</div>";
    return;
  }

  nfs.forEach(nf => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${nf.rota}</h3>
      <div class="kpi"><span class="big">${Number(nf.peso||0).toFixed(2)} kg</span></div>
      <div class="muted">Previsão informada</div>
      <div class="kpi"><span class="big">${Number(nf.m3||0).toFixed(2)} m³</span></div>
      <div class="muted">NF: ${nf.numero}</div>
    `;
    container.appendChild(card);
  });
}
function renderDashboardCards() {
    const container = document.getElementById('dashboard');
    container.innerHTML = '';

    nfs.forEach(nf => {
        // Se for mobile e não for admin → não mostra nada
        if (isMobile() && !isAdmin) return;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${nf.cidade}</h3>
            <p>Peso: ${nf.peso} kg</p>
            <p>Volume: ${nf.volume} m³</p>
            <p>Data: ${nf.data}</p>
            <button class="deleteBtn" data-id="${nf.id}">Excluir</button>
        `;

        container.appendChild(card);
    });

    // adiciona evento aos botões de excluir
    document.querySelectorAll('.deleteBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            deleteNF(id);
        });
    });
}
