import re
import glob

def get_robust_js(suffix=""):
    s = suffix
    if s and not s.startswith("-"):
        s = "-" + s
        
    return f"""
                            const audio = document.getElementById('aily-audio-element{s}');
                            const companion = document.getElementById('aily-audio-companion{s}');
                            if (!audio || !companion) return;
                            const minimal = document.getElementById('audio-minimal{s}');
                            const toggleBtn = document.getElementById('audio-toggle-btn{s}');
                            const progressBar = document.getElementById('progress-bar{s}');
                            const progressContainer = document.getElementById('progress-container{s}');
                            const currentTimeEl = document.getElementById('current-time{s}');
                            const speedBtn = document.getElementById('audio-speed-btn{s}');
                            const expanded = document.getElementById('audio-expanded{s}');

                            function formatTime(seconds) {{
                                if (!isFinite(seconds)) return "0:00";
                                const h = Math.floor(seconds / 3600);
                                const m = Math.floor((seconds % 3600) / 60);
                                const sec = Math.floor(seconds % 60);
                                return h > 0 
                                    ? `${{h}}:${{m.toString().padStart(2, '0')}}:${{sec.toString().padStart(2, '0')}}`
                                    : `${{m}}:${{sec.toString().padStart(2, '0')}}`;
                            }}

                            if (minimal) {{
                                minimal.addEventListener('click', (e) => {{
                                    e.preventDefault(); e.stopPropagation();
                                    document.querySelectorAll('audio').forEach(a => {{
                                        if (a !== audio) a.pause();
                                    }});
                                    const playPromise = audio.play();
                                    if (playPromise !== undefined) {{
                                        playPromise.catch(error => console.log('Playback prevented', error));
                                    }}
                                    companion.classList.add('is-playing');
                                    minimal.style.display = 'none';
                                    if (expanded) expanded.style.display = 'flex';
                                }});
                            }}

                            if (toggleBtn) {{
                                toggleBtn.addEventListener('click', (e) => {{
                                    e.preventDefault(); e.stopPropagation();
                                    if (audio.paused) {{
                                        audio.play();
                                        toggleBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
                                    }} else {{
                                        audio.pause();
                                        toggleBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
                                    }}
                                }});
                            }}

                            audio.addEventListener('timeupdate', () => {{
                                if (isFinite(audio.duration) && audio.duration > 0) {{
                                    const remaining = audio.duration - audio.currentTime;
                                    const percent = (audio.currentTime / audio.duration) * 100;
                                    if (progressBar) progressBar.style.width = `${{percent}}%`;
                                    if (currentTimeEl) currentTimeEl.textContent = "-" + formatTime(remaining);
                                }}
                            }});

                            if (speedBtn) {{
                                const speeds = [1, 1.5, 2];
                                let speedIdx = 0;
                                speedBtn.addEventListener('click', (e) => {{
                                    e.preventDefault(); e.stopPropagation();
                                    speedIdx = (speedIdx + 1) % speeds.length;
                                    audio.playbackRate = speeds[speedIdx];
                                    speedBtn.textContent = speeds[speedIdx] + 'x';
                                }});
                            }}
                            
                            let isDragging = false;
                            
                            if (progressContainer) {{
                                const updateProgress = (e) => {{
                                    const rect = progressContainer.getBoundingClientRect();
                                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                                    let pos = (clientX - rect.left) / rect.width;
                                    pos = Math.max(0, Math.min(1, pos));
                                    if (isFinite(audio.duration) && audio.duration > 0) {{
                                        audio.currentTime = pos * audio.duration;
                                    }}
                                }};

                                progressContainer.addEventListener('mousedown', (e) => {{
                                    isDragging = true;
                                    updateProgress(e);
                                }});
                                document.addEventListener('mousemove', (e) => {{
                                    if (isDragging) updateProgress(e);
                                }});
                                document.addEventListener('mouseup', () => {{
                                    isDragging = false;
                                }});
                                progressContainer.addEventListener('touchstart', (e) => {{
                                    isDragging = true;
                                    updateProgress(e);
                                }}, {{passive: true}});
                                document.addEventListener('touchmove', (e) => {{
                                    if (isDragging) updateProgress(e);
                                }}, {{passive: true}});
                                document.addEventListener('touchend', () => {{
                                    isDragging = false;
                                }});
                            }}

                            audio.addEventListener('ended', () => {{
                                companion.classList.remove('is-playing');
                                if (minimal) minimal.style.display = 'flex';
                                if (expanded) expanded.style.display = 'none';
                                if (toggleBtn) toggleBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
                            }});
"""

# Update script.js
with open("script.js", "r") as f:
    script_js = f.read()

# Replace the inner part of companions.forEach in script.js
new_foreach = f"""        companions.forEach(companion => {{
            const idParts = companion.id.split('-');
            const editionNum = idParts[idParts.length - 1];
{get_robust_js("${editionNum}")}
        }});"""

script_js = re.sub(r'companions\.forEach\(companion => \{.*?\n        \}\);', new_foreach, script_js, flags=re.DOTALL)
with open("script.js", "w") as f:
    f.write(script_js)


# Update journal-edition-*.html inline scripts
files = glob.glob("journal-edition-*.html")
for file in files:
    with open(file, "r") as f:
        html = f.read()
    
    # Replace DOMContentLoaded inner part
    start_tag = "document.addEventListener('DOMContentLoaded', () => {"
    end_tag = "});\n                    </script>"
    
    if start_tag in html and end_tag in html:
        start_idx = html.find(start_tag) + len(start_tag)
        end_idx = html.find(end_tag, start_idx)
        
        new_html = html[:start_idx] + get_robust_js("") + "                        " + html[end_idx:]
        
        with open(file, "w") as f:
            f.write(new_html)

print("Robust audio scripts applied successfully!")
