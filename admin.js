function isMobile() {
  return window.innerWidth < 768;
}
function isAdmin() {
  return localStorage.getItem("xg_admin") === "true";
}
function loginAdmin() {
  localStorage.setItem("xg_admin", "true");
  alert("Modo administrador ativado");
  renderDashboardCards();
}
function logoutAdmin() {
  localStorage.removeItem("xg_admin");
  alert("Saiu do modo administrador");
  renderDashboardCards();
}
