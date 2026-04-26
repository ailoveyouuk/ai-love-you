import re

with open("script.js", "r") as f:
    script_js = f.read()

# We need to find the foreach block and fix it.
# The previous replacement created `companions.forEach(companion => { ... });`

def get_robust_js_for_script():
    return """
        companions.forEach(companion => {
            const idParts = companion.id.split('-');
            const editionNum = idParts[idParts.length - 1];
            
            const audio = document.getElementById(`aily-audio-element-${editionNum}`);
            if (!audio) return;
            const minimal = document.getElementById(`audio-minimal-${editionNum}`);
            const toggleBtn = document.getElementById(`audio-toggle-btn-${editionNum}`);
            const progressBar = document.getElementById(`progress-bar-${editionNum}`);
            const progressContainer = document.getElementById(`progress-container-${editionNum}`);
            const currentTimeEl = document.getElementById(`current-time-${editionNum}`);
            const speedBtn = document.getElementById(`audio-speed-btn-${editionNum}`);
            const expanded = document.getElementById(`audio-expanded-${editionNum}`);

            function formatTime(seconds) {
                if (!isFinite(seconds)) return "0:00";
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const sec = Math.floor(seconds % 60);
                return h > 0 
                    ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
                    : `${m}:${sec.toString().padStart(2, '0')}`;
            }

            if (minimal) {
                minimal.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    document.querySelectorAll('audio').forEach(a => {
                        if (a !== audio) a.pause();
                    });
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => console.log('Playback prevented', error));
                    }
                    companion.classList.add('is-playing');
                    minimal.style.display = 'none';
                    if (expanded) expanded.style.display = 'flex';
                });
            }

            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (audio.paused) {
                        audio.play();
                        toggleBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
                    } else {
                        audio.pause();
                        toggleBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
                    }
                });
            }

            audio.addEventListener('timeupdate', () => {
                if (isFinite(audio.duration) && audio.duration > 0) {
                    const remaining = audio.duration - audio.currentTime;
                    const percent = (audio.currentTime / audio.duration) * 100;
                    if (progressBar) progressBar.style.width = `${percent}%`;
                    if (currentTimeEl) currentTimeEl.textContent = "-" + formatTime(remaining);
                }
            });

            if (speedBtn) {
                const speeds = [1, 1.5, 2];
                let speedIdx = 0;
                speedBtn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    speedIdx = (speedIdx + 1) % speeds.length;
                    audio.playbackRate = speeds[speedIdx];
                    speedBtn.textContent = speeds[speedIdx] + 'x';
                });
            }
            
            let isDragging = false;
            
            if (progressContainer) {
                const updateProgress = (e) => {
                    const rect = progressContainer.getBoundingClientRect();
                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                    let pos = (clientX - rect.left) / rect.width;
                    pos = Math.max(0, Math.min(1, pos));
                    if (isFinite(audio.duration) && audio.duration > 0) {
                        audio.currentTime = pos * audio.duration;
                    }
                };

                progressContainer.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    updateProgress(e);
                });
                document.addEventListener('mousemove', (e) => {
                    if (isDragging) updateProgress(e);
                });
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
                progressContainer.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    updateProgress(e);
                }, {passive: true});
                document.addEventListener('touchmove', (e) => {
                    if (isDragging) updateProgress(e);
                }, {passive: true});
                document.addEventListener('touchend', () => {
                    isDragging = false;
                });
            }

            audio.addEventListener('ended', () => {
                companion.classList.remove('is-playing');
                if (minimal) minimal.style.display = 'flex';
                if (expanded) expanded.style.display = 'none';
                if (toggleBtn) toggleBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            });
        });"""

# Replace everything from `companions.forEach(companion => {` to the end of the initHomeAudio function.
# Look for `function initHomeAudio() {` to correctly constrain.
start_idx = script_js.find("companions.forEach(companion => {")
end_idx = script_js.find("    }\n    \n    renderHomeGrids();", start_idx)

if start_idx != -1 and end_idx != -1:
    new_script = script_js[:start_idx] + get_robust_js_for_script() + "\n" + script_js[end_idx:]
    with open("script.js", "w") as f:
        f.write(new_script)
    print("Fixed script.js successfully")
else:
    print("Could not find boundaries")
