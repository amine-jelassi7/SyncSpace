
function switchTab(tabKey) {
  state.activeTab = tabKey;

  const tabs = ['sim', 'real', 'code'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const view = document.getElementById(`view-${t}`);
    if (!btn || !view) return; 
    if (t === tabKey) {
      btn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
      view.classList.remove('hidden');
    } else {
      btn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-slate-400 hover:text-slate-200";
      view.classList.add('hidden');
    }
  });

  if (tabKey === 'real' && !realModeRenderer) {
    initRealModeEngine();
  }

  updateWindowCountBadge();
}
