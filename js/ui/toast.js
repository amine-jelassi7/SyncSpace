

function showToast(msg, color = 'cyan') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `p-3 rounded-xl glass-panel border border-${color}-500/40 text-${color}-300 text-xs shadow-xl flex items-center gap-2 pointer-events-auto transition-all transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i data-lucide="info" class="w-4 h-4 text-${color}-400"></i> <span>${msg}</span>`;
  container.appendChild(toast);
  lucide.createIcons({ props: {}, nameAttr: 'data-lucide' });

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
