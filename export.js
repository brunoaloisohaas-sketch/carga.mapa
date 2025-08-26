function exportNFs() {
  const startInp = document.getElementById("filtroInicio").value;
  const endInp = document.getElementById("filtroFim").value;
  const start = startInp ? new Date(startInp) : null;
  const end = endInp ? new Date(endInp) : null;

  const filtradas = nfs.filter(nf => {
    const d = new Date(nf.datahora);
    const afterStart = start ? d >= start : true;
    const beforeEnd = end ? d <= end : true;
    return afterStart && beforeEnd;
  });

  let csv = "NF,Data,Remetente,Destinatário,Volumes,Peso,m³,Rota\n";
  filtradas.forEach(nf => {
    csv += `${nf.numero},${nf.datahora},${nf.rem},${nf.dest},${nf.volumes},${nf.peso},${nf.m3},${nf.rota}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "notas_filtradas.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
