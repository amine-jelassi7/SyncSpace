

function updateWindowCountBadge() {
  const countTag = document.getElementById('win-count');
  if (state.activeTab === 'sim') {
    countTag.textContent = `Virtual Windows: ${simWindows.length}`;
  } else {
    const now = Date.now();
    let count = 1;
    realWindowsMap.forEach((time) => {
      if (now - time < 2000) count++;
    });
    countTag.textContent = `Real Windows: ${count}`;
  }
}
