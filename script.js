document.addEventListener('DOMContentLoaded', () => {
    // ---- Typewriter Animation (Homepage Only) ----
    const initTypewriter = () => {
        const target = document.querySelector('.typewriter-text');
        if (!target) return;

        const text = "MAN.\nDAUGHTER.\n+ MACHINE.";
        let index = 0;

        // Ensure text is clear initially
        target.innerHTML = '';

        const type = () => {
            if (index < text.length) {
                target.innerHTML += text.charAt(index) === '\n' ? '<br>' : text.charAt(index);
                index++;
                setTimeout(type, 80); // Speed of typing
            }
        };

        // Subtle delay before starting
        setTimeout(type, 500);
    }

    initTypewriter();

    // ---- 2026 Editorial Orchestration: Home Grid Logic ----
    const renderHomeGrids = () => {
        const storeGrid = document.getElementById('home-store-grid');
        const journalGrid = document.getElementById('home-journal-grid');
        
        if (storeGrid && typeof products !== 'undefined') {
            const activeProducts = products.filter(p => p.category.toLowerCase() === 'art prints');
            const topProducts = activeProducts.slice(0, 3);
            
            storeGrid.innerHTML = topProducts.map(p => `
                <div class="home-journal-card">
                    <a href="product.html?id=${p.id}" class="image-container">
                        <img src="${(p.images ? p.images[0] : p.image).replace(/ /g, '%20')}" alt="${p.title}" loading="lazy">
                    </a>
                    <div class="edition-label">STORE // ${p.category.toUpperCase()}</div>
                    <a href="product.html?id=${p.id}" class="headline" style="text-decoration: none; color: inherit;">${p.title}</a>
                    
                    <div class="edition-meta-stacked">
                        <div class="meta-date">SERIES: ${p.series ? p.series.toUpperCase() : '01'}</div>
                        <div class="meta-listen-row">
                            <span>FROM £${p.priceVariants ? Math.min(...Object.values(p.priceVariants)) : 'TBD'}</span>
                            <a href="product.html?id=${p.id}" style="color: var(--color-action); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;">PRODUCT DETAILS &rarr;</a>
                        </div>
                    </div>
                    
                    <div class="home-journal-tags">
                        ${(p.archiveTags || ['ARTPRINT', 'ARCHIVE', 'STUDIO']).slice(0, 5).map(tag => `<span>#${tag.toUpperCase()}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        if (journalGrid && typeof window.journalData !== 'undefined') {
            const editionsFound = new Set();
            const topJournals = [];
            for (const post of window.journalData) {
                if (post.category !== 'global-five') {
                    if (!editionsFound.has(post.edition)) {
                        editionsFound.add(post.edition);
                        const parts = post.link.split('#');
                        const url = parts.length > 0 ? parts[0] : post.link;
                        topJournals.push({ ...post, link: url });
                        if (topJournals.length === 3) break; // Limit to 3 for clean grid
                    }
                }
            }
            
            journalGrid.innerHTML = topJournals.map(j => {
                const editionNum = j.edition.split(' ')[1] || '00';
                const audioFile = `assets/audio/Journal ${editionNum} Audio.m4a`;
                return `
                <div class="home-journal-card">
                    <a href="${j.link}" class="image-container">
                        <img src="${j.image}" alt="${j.title}" loading="lazy">
                    </a>
                    <div class="edition-label">JOURNAL // EDITION ${editionNum}</div>
                    <a href="${j.link}" class="headline" style="text-decoration: none;">${j.title}</a>
                    
                    <div class="edition-meta-stacked">
                        <div class="meta-date">PUBLISHED: ${j.publishDate.toUpperCase()}</div>
                        <div class="meta-listen-row">
                            <span>${j.readDuration || '35 MIN READ'}</span>
                            
                            <!-- Integrated Audio Control -->
                            <div class="audio-companion" id="aily-audio-companion-${editionNum}" style="border: none; padding: 0; background: none; box-shadow: none; margin: 0; min-width: auto; flex-direction: row; align-items: center; gap: 0.8rem; flex-grow: 1;">
                                <audio id="aily-audio-element-${editionNum}" src="${audioFile}" preload="metadata"></audio>
                                
                                <div class="audio-player-minimal" id="audio-minimal-${editionNum}" style="display: flex; align-items: center; gap: 0.8rem; cursor: pointer; margin-left: auto;">
                                    <button class="play-pause-btn" aria-label="Play Edition Audio" style="width: 24px; height: 24px; background: none; border: none; cursor: pointer;">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                    </button>
                                    <span class="audio-duration" style="font-size: 0.65rem; color: var(--ink-gray);">LISTEN // ${j.audioDuration || '34:30'}</span>
                                </div>

                                <!-- Expanded (Progress) -->
                                <div class="audio-player-expanded" id="audio-expanded-${editionNum}" style="display: none; align-items: center; gap: 0.8rem; flex-grow: 1;">
                                    <button class="play-pause-btn" id="audio-toggle-btn-${editionNum}" aria-label="Pause" style="width: 20px; height: 20px; background: none; border: none; cursor: pointer;">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                    </button>
                                    <div class="audio-progress-container" id="progress-container-${editionNum}" style="flex-grow: 1; min-width: 40px; height: 2px; position: relative; cursor: pointer; height: 20px; display: flex; align-items: center;">
                                        <div class="audio-progress-bar" id="progress-bar-${editionNum}" style="position: relative; width: 0%; height: 2px; background: var(--accent-color);">
                                            <div style="position: absolute; right: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent-color);"></div>
                                        </div>
                                    </div>
                                    <span id="current-time-${editionNum}" style="font-size: 0.55rem; min-width: 25px;">0:00</span>
                                    <button id="audio-speed-btn-${editionNum}" style="font-size: 0.55rem; font-family: var(--font-display); font-weight: 700; background: none; border: none; cursor: pointer; color: var(--ink-gray); padding: 0;">1x</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="home-journal-tags">
                        ${(j.keywords || ['SYNTHETICNATURE', 'BIODIGITAL', 'ARCHIVE']).slice(0, 6).map(tag => `<span>#${tag.toUpperCase()}</span>`).join('')}
                    </div>
                </div>
                `;
            }).join('');

            initHomeAudio();
        }
    };

    function initHomeAudio() {
        const companions = document.querySelectorAll('.audio-companion');

        function formatTime(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return h > 0 
                ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                : `${m}:${s.toString().padStart(2, '0')}`;
        }

                
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
        });
    }
    
    renderHomeGrids();
    // ---- Native Scrolling Priority ----
    // Lenis smooth scrolling disabled per user request for fast, snappy native movement.



    // ---- Archive (Cart) Logic (Global) ----
    const globalCartBtns = document.querySelectorAll('.btn-archive, #global-cart-btn');
    if (globalCartBtns.length > 0) {
        globalCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        });
    }

    // Initialize or get cart state
    window.cartState = JSON.parse(localStorage.getItem('aily_cart_items')) || [];

    // Migrate old archiveCount if needed
    let oldArchiveCount = parseInt(localStorage.getItem('aily_archive_count'));
    if (oldArchiveCount && window.cartState.length === 0) {
        window.cartState.push({ id: 'legacy-item', title: 'Archived Print', variant: 'Standard', price: 0, image: '', quantity: oldArchiveCount });
        localStorage.setItem('aily_cart_items', JSON.stringify(window.cartState));
        localStorage.removeItem('aily_archive_count');
    }

    window.updateCartDisplay = function () {
        const count = window.cartState.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update all elements that might show the bag count
        const cartElements = document.querySelectorAll('.btn-archive, #global-cart-btn, .sidebar-link, .nav-link, .nav-links a');
        
        cartElements.forEach(el => {
            // Check if this element is meant for the Bag/Cart
            if (el.innerText.includes('Bag') || el.innerText.includes('Archive')) {
                // Preserving the word "Bag" or "Archive" but updating the count
                const label = el.innerText.includes('Bag') ? 'Bag' : 'Archive';
                el.innerText = `${label} (${count})`;
            }
        });

        // Update all Global Bag Icons (Desktop and Mobile)
        const bagBadges = document.querySelectorAll('.bag-count-badge');
        if (bagBadges.length > 0) {
            bagBadges.forEach(badge => {
                badge.innerText = count;
            });
        }
    }

    // Call once on load to sync between pages
    window.updateCartDisplay();

    // Attach cart logic to generic add buttons (like on the homepage bento grid)
    const addBtns = document.querySelectorAll('.btn-add');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.addToArchiveFeedback(btn, { id: 'generic-art', title: 'Curated Print', variant: 'Standard', price: 95, image: 'assets/brutalist-hero.png' });
        });
    });

    window.addToArchiveFeedback = function (btnElement, productInfo) {
        const originalText = btnElement.innerText;

        if (productInfo) {
            const existing = window.cartState.find(item => item.id === productInfo.id && item.variant === productInfo.variant);
            const qtyToAdd = productInfo.quantity || 1;
            if (existing) {
                existing.quantity += qtyToAdd;
            } else {
                window.cartState.push({ ...productInfo, quantity: qtyToAdd });
            }
            localStorage.setItem('aily_cart_items', JSON.stringify(window.cartState));
        }

        window.updateCartDisplay();

        // Interaction feedback
        btnElement.innerText = 'Added to Bag';
        btnElement.style.background = 'var(--text-color)';
        btnElement.style.color = 'var(--bg-color)';

        // Reset text after 2 seconds
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.background = '';
            btnElement.style.color = '';
        }, 2000);
    }

    // ---- GSAP Scroll Animations (Editorial Orchestration) ----
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Ensure we start at top for "Impact" phase
        window.scrollTo(0, 0);

        // Text Reveals (LIFT System: Eye Choreography)
        const revealTexts = document.querySelectorAll('.reveal-text span');
        revealTexts.forEach(text => {
            gsap.to(text, {
                scrollTrigger: {
                    trigger: text,
                    start: "top 95%",
                },
                y: "0%",
                autoAlpha: 1, // Fix for invisible headline
                duration: 1.2,
                ease: "power4.out"
            });
        });

        // Image Mask Reveals
        const masks = document.querySelectorAll('.img-mask');
        masks.forEach(mask => {
            gsap.to(mask, {
                scrollTrigger: {
                    trigger: mask.parentElement,
                    start: "top 85%",
                },
                scaleY: 0,
                duration: 1.4,
                ease: "power3.inOut"
            });
        });

        // Image Parallax (Movement & Flow)
        const parallaxImages = document.querySelectorAll('.akaru-bg, .akaru-block-img img');
        parallaxImages.forEach(img => {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
                y: "10%", // Reduced for more subtle flow
                scale: 1,
                ease: "none"
            });
        });
    }

    // ---- Shop Catalog Logic (shop.html only) ----
    const productGrid = document.getElementById('productGrid');
    const categoryNav = document.getElementById('categoryNav');
    const subFilterNav = document.getElementById('subFilterNav');
    const searchInput = document.getElementById('productSearch');

    if (productGrid && typeof products !== 'undefined') {
        let currentCategory = 'all';
        let currentSubFilter = 'all';
        let currentSearch = '';

        // Check for incoming URL Parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('category')) currentCategory = urlParams.get('category');
        if (urlParams.get('sub')) currentSubFilter = urlParams.get('sub');

        // Initial Render
        initShop();

        function initShop() {
            renderCategoryNav();
            renderSubFilters();
            renderProducts();
        }

        // 1. Category Navigation (Top Tier)
        function renderCategoryNav() {
            if (!categoryNav) return;
            const categories = ['all', ...new Set(products.map(p => p.category))];
            
            categoryNav.innerHTML = categories.map(cat => `
                <button class="tag-btn ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
                    ${cat.toUpperCase()}
                </button>
            `).join('');

            categoryNav.querySelectorAll('.tag-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentCategory = btn.getAttribute('data-category');
                    currentSubFilter = 'all'; // Reset sub-filter when category changes
                    renderCategoryNav();
                    renderSubFilters();
                    renderProducts();
                    updateURL();
                });
            });
        }

        // 2. Sub-Filters (Dynamic Pills)
        function renderSubFilters() {
            if (!subFilterNav) return;
            
            // Extract relevant sub-filters (Series for Art Prints, or general Series/Type for others)
            let subFilters = [];
            if (currentCategory === 'all') {
                subFilters = []; // Hide sub-filters on 'all' or show all unique series? User said dynamic based on category.
            } else {
                const filteredByCat = products.filter(p => p.category === currentCategory);
                subFilters = [...new Set(filteredByCat.map(p => p.series))];
            }

            if (subFilters.length === 0) {
                subFilterNav.style.display = 'none';
                return;
            } else {
                subFilterNav.style.display = 'flex';
            }

            subFilterNav.innerHTML = `
                <button class="tag-btn ${currentSubFilter === 'all' ? 'active' : ''}" data-sub="all">ALL</button>
                ${subFilters.map(sf => `
                    <button class="tag-btn ${currentSubFilter === sf ? 'active' : ''}" data-sub="${sf}">
                        ${sf.toUpperCase()}
                    </button>
                `).join('')}
            `;

            subFilterNav.querySelectorAll('.tag-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentSubFilter = btn.getAttribute('data-sub');
                    renderSubFilters();
                    renderProducts();
                    updateURL();
                });
            });
        }

        // 3. Render Products
        function renderProducts() {
            productGrid.innerHTML = '';
            let filtered = products;

            if (currentCategory !== 'all') {
                filtered = filtered.filter(p => p.category === currentCategory);
            }
            if (currentSubFilter !== 'all') {
                filtered = filtered.filter(p => p.series === currentSubFilter);
            }
            if (currentSearch) {
                const q = currentSearch.toLowerCase();
                filtered = filtered.filter(p => 
                    p.title.toLowerCase().includes(q) || 
                    p.series.toLowerCase().includes(q) || 
                    p.category.toLowerCase().includes(q) ||
                    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
                );
            }

            if (filtered.length === 0) {
                renderRecommendations();
                return;
            }

            filtered.forEach((product, index) => {
                const prices = Object.entries(product.priceVariants || { "Standard": 45 });
                const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p[1])) : 'TBD';
                const [firstSize, firstPrice] = prices[0]; // Kept for default selection
                const card = document.createElement('article');
                card.className = 'product-card';
                card.style.opacity = '0';
                
                const imgTarget = product.images ? product.images[0] : product.image;
                
                card.innerHTML = `
                    <div class="product-image-container">
                        <a href="product.html?id=${product.id}" style="display:block;">
                            <img src="${imgTarget}" alt="${product.title}" class="product-image" loading="lazy">
                        </a>
                    </div>
                    <div class="product-info">
                        <span class="product-series">${product.series}</span>
                        <a href="product.html?id=${product.id}" style="color:inherit; text-decoration:none;"><h3 class="product-title">${product.title}</h3></a>
                        
                        <div class="product-commerce-row">
                            <span class="product-price">from £${minPrice}.00</span>
                            <div class="product-grid-actions">
                                <select class="grid-size-selector" data-id="${product.id}">
                                    ${prices.map(([size, price]) => `<option value="${size}" data-price="${price}">${size}</option>`).join('')}
                                </select>
                                <button class="btn-pill-orange quick-add-btn" 
                                        data-id="${product.id}" 
                                        data-title="${product.title}" 
                                        data-img="${imgTarget}">ADD</button>
                            </div>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
            });

            // Dynamic Price Updating & Quick Add
            productGrid.querySelectorAll('.product-card').forEach(card => {
                const selector = card.querySelector('.grid-size-selector');
                const priceDisplay = card.querySelector('.product-price');
                const addBtn = card.querySelector('.quick-add-btn');

                if (selector) {
                    selector.addEventListener('change', () => {
                        const selectedOption = selector.options[selector.selectedIndex];
                        const newPrice = selectedOption.getAttribute('data-price');
                        priceDisplay.innerText = `£${newPrice}.00`;
                    });
                }

                if (addBtn) {
                    addBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const selectedSize = selector.value;
                        const selectedPrice = selector.options[selector.selectedIndex].getAttribute('data-price');
                        
                        // Construct variant info
                        const designName = (products.find(p => p.id === addBtn.getAttribute('data-id')).designVariants?.[0]?.name) || '';
                        const variantString = designName ? `${designName} Edition - ${selectedSize}` : selectedSize;

                        const info = {
                            id: addBtn.getAttribute('data-id'),
                            title: addBtn.getAttribute('data-title'),
                            variant: variantString,
                            price: parseFloat(selectedPrice),
                            image: addBtn.getAttribute('data-img'),
                            quantity: 1
                        };
                        if (window.addToArchiveFeedback) {
                            window.addToArchiveFeedback(addBtn, info);
                        }
                    });
                }
            });

            // GSAP Staggered Fade In
            if (typeof gsap !== 'undefined') {
                gsap.to('.product-card', {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "power2.out",
                    from: { y: 20 }
                });
            } else {
                productGrid.querySelectorAll('.product-card').forEach(c => c.style.opacity = '1');
            }
        }

        // 4. Recommendations (Empty State)
        function renderRecommendations() {
            let recs = products.filter(p => p.category === currentCategory && p.id !== 'placeholder');
            if (recs.length < 4) {
                const otherProducts = products.filter(p => p.category !== currentCategory && p.id !== 'placeholder');
                recs = [...recs, ...otherProducts].slice(0, 4);
            } else {
                recs = recs.slice(0, 4);
            }

            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; padding: var(--spacing-xxl) 0; text-align: center; border-top: 1px solid var(--border-color); margin-top: var(--spacing-xl);">
                    <p style="opacity: 0.5; margin-bottom: var(--spacing-md); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em;">No exact matches found in the archive.</p>
                    <h3 style="margin-bottom: var(--spacing-xl); font-family: var(--font-display); font-size: 2rem;">YOU MIGHT ALSO LIKE</h3>
                    <div class="shop-grid-recommendations" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-md); width: 100%;">
                        ${recs.map(p => {
                            const prices = Object.entries(p.priceVariants || { "Standard": 45 });
                            const [fSize, fPrice] = prices[0];
                            const iTarget = p.images ? p.images[0] : p.image;

                            return `
                                <article class="product-card">
                                    <div class="product-image-container">
                                        <a href="product.html?id=${p.id}" style="display:block;">
                                            <img src="${iTarget}" alt="${p.title}" class="product-image" loading="lazy">
                                        </a>
                                    </div>
                                    <div class="product-info">
                                        <span class="product-series">${p.series}</span>
                                        <a href="product.html?id=${p.id}" style="color:inherit; text-decoration:none;"><h3 class="product-title">${p.title}</h3></a>
                                        
                                        <div class="product-commerce-row">
                                            <span class="product-price">from £${fPrice}.00</span>
                                            <div class="product-grid-actions">
                                                <select class="grid-size-selector" data-id="${p.id}">
                                                    ${prices.map(([size, price]) => `<option value="${size}" data-price="${price}">${size}</option>`).join('')}
                                                </select>
                                                <button class="btn-pill-orange quick-add-btn" 
                                                        data-id="${p.id}" 
                                                        data-title="${p.title}" 
                                                        data-img="${iTarget}">ADD</button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            `;
                        }).join('')}
                    </div>
                    <button class="tag-btn" style="margin-top: var(--spacing-xxl); padding: 1rem 2rem;" onclick="window.location.href='shop.html'">View All Editions</button>
                </div>
            `;

            // Dynamic Price Updating & Quick Add for recommendations
            productGrid.querySelectorAll('.product-card').forEach(card => {
                const selector = card.querySelector('.grid-size-selector');
                const priceDisplay = card.querySelector('.product-price');
                const addBtn = card.querySelector('.quick-add-btn');

                if (selector) {
                    selector.addEventListener('change', () => {
                        const selectedOption = selector.options[selector.selectedIndex];
                        const newPrice = selectedOption.getAttribute('data-price');
                        priceDisplay.innerText = `£${newPrice}.00`;
                    });
                }

                if (addBtn) {
                    addBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const selectedSize = selector.value;
                        const selectedPrice = selector.options[selector.selectedIndex].getAttribute('data-price');
                        
                        const targetProduct = products.find(p => p.id === addBtn.getAttribute('data-id'));
                        const designName = (targetProduct?.designVariants?.[0]?.name) || '';
                        const variantString = designName ? `${designName} Edition - ${selectedSize}` : selectedSize;

                        const info = {
                            id: addBtn.getAttribute('data-id'),
                            title: addBtn.getAttribute('data-title'),
                            variant: variantString,
                            price: parseFloat(selectedPrice),
                            image: addBtn.getAttribute('data-img'),
                            quantity: 1
                        };
                        if (window.addToArchiveFeedback) {
                            window.addToArchiveFeedback(addBtn, info);
                        }
                    });
                }
            });
        }

        function updateURL() {
            const params = new URLSearchParams();
            if (currentCategory !== 'all') params.set('category', currentCategory);
            if (currentSubFilter !== 'all') params.set('sub', currentSubFilter);
            const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
            window.history.replaceState({}, '', newUrl);
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.toLowerCase();
                renderProducts();
            });
        }
    }

    // ---- Mobile Menu Toggle ----
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking links
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Studio Insights & Taxonomy Sync ----
    window.trackStudioInsight = function(tag) {
        if (!tag) return;
        // Clean tag (remove # if present)
        const cleanTag = tag.replace('#', '').trim();
        let insights = JSON.parse(localStorage.getItem('studio_insights')) || {};
        insights[cleanTag] = (insights[cleanTag] || 0) + 1;
        localStorage.setItem('studio_insights', JSON.stringify(insights));
        console.log(`Studio Insight Recorded: ${cleanTag}`);
    }

    // Attach tracking to all journal cards and tag links
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.journal-card, .filter-btn, .category-btn, .journal-card-mini, .edition-meta span, .article-tags span');
        if (target) {
            const tags = target.getAttribute('data-tags') || target.getAttribute('data-category') || target.getAttribute('data-sub') || target.innerText;
            if (tags) {
                tags.split(/[ ,#]+/).filter(Boolean).forEach(tag => window.trackStudioInsight(tag.trim()));
            }
        }
    });

});

// ---- Dynamic Sidebar Products (for Journals) ----
// This is outside DOMContentLoaded so inline scripts can call it immediately
window.renderFeaturedProductsInJournal = function (keywords = []) {
    const sidebar = document.getElementById('featured-products-sidebar');
    if (!sidebar || typeof products === 'undefined') return;

    // Find products with matching archiveTags
    const matches = products.filter(p =>
        p.archiveTags && p.archiveTags.some(tag => keywords.includes(tag))
    ).slice(0, 3);

    if (matches.length > 0) {
        sidebar.innerHTML = `
                <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
                    <span style="font-family: var(--font-display); font-size: 0.6rem; color: var(--ink-gray); text-transform: uppercase; letter-spacing: 0.2rem; display: block; margin-bottom: 2rem;">Featured Products</span>
                    <div style="display: flex; flex-direction: column; gap: 2rem;">
                        ${matches.map(p => `
                            <a href="product.html?id=${p.id}" style="text-decoration: none; display: block; group">
                                <div style="width: 100%; aspect-ratio: 1; background: #f9f9f9; overflow: hidden; margin-bottom: 1rem; transition: transform 0.3s ease;">
                                    <img src="${p.images ? p.images[0] : p.image}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8; filter: grayscale(0.5); transition: all 0.3s ease;" onmouseover="this.style.filter='grayscale(0)'; this.style.opacity='1';" onmouseout="this.style.filter='grayscale(0.5)'; this.style.opacity='0.8';">
                                </div>
                                <span style="font-family: var(--font-display); font-size: 0.65rem; color: var(--text-color); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1rem; display: block;">${p.title}</span>
                                <span style="font-size: 0.6rem; color: var(--ink-gray); text-transform: uppercase; letter-spacing: 0.05rem;">Shop Edition →</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
    }
}
// Journal Navigation GSAP Accordion System & Mobile Vertical Roller
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-container, .journal-content section[id], #editor-note');
    let navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    // ---- Create Mobile Roller Nav ----
    const editionNavDesktop = document.querySelector('.edition-nav');
    const journalContent = document.querySelector('.journal-content');
    
    if (editionNavDesktop && journalContent) {
        const mobileNavWrapper = document.createElement('nav');
        mobileNavWrapper.className = 'edition-nav-mobile';
        
        // [MOBILE REFINEMENT] Scroll Indicator (Surgical Arrows Only)
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-roll-indicator';
        scrollIndicator.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
            </svg>
        `;

        const indicator = document.createElement('div');
        indicator.className = 'roller-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        mobileNavWrapper.appendChild(indicator);

        const rollerContainer = document.createElement('div');
        rollerContainer.className = 'roller-container';
        
        const rollerList = document.createElement('div');
        rollerList.className = 'roller-list';
        
        const desktopLinks = editionNavDesktop.querySelectorAll('.nav-link');
        desktopLinks.forEach((link, idx) => {
            const clone = link.cloneNode(true);
            clone.classList.remove('active');
            clone.setAttribute('data-index', idx);
            rollerList.appendChild(clone);
            
            clone.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = clone.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    window.isScrollingByNav = true;
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { window.isScrollingByNav = false; }, 1000);
                }
            });
        });
        
        rollerContainer.appendChild(rollerList);
        mobileNavWrapper.appendChild(rollerContainer);
        
        // Appended AFTER rollerContainer to ensure it stays on the right visually in the stack
        mobileNavWrapper.appendChild(scrollIndicator);
        
        const breadcrumbHeader = document.querySelector('.sticky-breadcrumb-header');
        if (breadcrumbHeader) {
            breadcrumbHeader.insertAdjacentElement('afterend', mobileNavWrapper);
        } else {
            journalContent.insertBefore(mobileNavWrapper, journalContent.firstChild);
        }

        // --- Roller Touch Interactivity Logic ---
        let debounceTimer;
        rollerContainer.addEventListener('scroll', () => {
            if (window.isScrollingByPage) return;
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const item = rollerList.querySelector('.nav-link');
                const itemHeight = item ? item.offsetHeight : 19;
                const scrollPos = rollerContainer.scrollTop;
                const activeIndex = Math.round(scrollPos / itemHeight);
                
                const targetLink = rollerList.querySelector(`[data-index="${activeIndex}"]`);
                if (targetLink && !targetLink.classList.contains('active')) {
                    const targetId = targetLink.getAttribute('href').substring(1);
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        window.isScrollingByNav = true;
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setTimeout(() => { window.isScrollingByNav = false; }, 800);
                    }
                }
            }, 150);
        });
        
        navLinks = document.querySelectorAll('.nav-link');
    }

    if (typeof gsap !== 'undefined') {
        gsap.set('.nav-item .nav-subtitle', { height: 0, opacity: 0, marginTop: 0 });
        const initialActive = document.querySelector('.nav-link.active + .nav-subtitle');
        if (initialActive) {
            gsap.set(initialActive, { height: 'auto', opacity: 0.8, marginTop: "0.25rem" });
        }
    }

    let currentActiveLinkId = null;

    window.addEventListener('scroll', () => {
        if (window.isScrollingByNav) return;
        window.isScrollingByPage = true;

        let currentSectionId = "";
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 200) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (!currentSectionId && sections[0]) {
            currentSectionId = sections[0].getAttribute('id');
        }

        if (currentSectionId && currentSectionId !== currentActiveLinkId) {
            currentActiveLinkId = currentSectionId;

            navLinks.forEach(link => {
                const subtitle = link.nextElementSibling;
                const isActiveTarget = link.getAttribute('href') === `#${currentSectionId}`;

                if (isActiveTarget) {
                    if (!link.classList.contains('active')) {
                        link.classList.add('active');
                        
                        if (subtitle && subtitle.classList.contains('nav-subtitle') && typeof gsap !== 'undefined') {
                            gsap.to(subtitle, {
                                duration: 0.6,
                                height: 'auto', opacity: 0.8, marginTop: "0.25rem",
                                ease: "back.out(1.7)"
                            });
                        }
                        
                        // Sync Roller Position
                        const rollerContainer = document.querySelector('.roller-container');
                        const index = parseInt(link.getAttribute('data-index'));
                        if (rollerContainer && !isNaN(index)) {
                            const item = rollerContainer.querySelector('.nav-link');
                            const itemHeight = item ? item.offsetHeight : 19;
                            rollerContainer.scrollTo({
                                top: index * itemHeight,
                                behavior: 'smooth'
                            });
                        }
                    }
                } else {
                    if (link.classList.contains('active')) {
                        link.classList.remove('active');
                        if (subtitle && subtitle.classList.contains('nav-subtitle') && typeof gsap !== 'undefined') {
                            gsap.to(subtitle, {
                                duration: 0.4,
                                height: 0, opacity: 0, marginTop: 0,
                                ease: "power2.inOut"
                            });
                        }
                    }
                }
            });
        }
        
        clearTimeout(window.scrollEndTimer);
        window.scrollEndTimer = setTimeout(() => { window.isScrollingByPage = false; }, 200);
    });
});



