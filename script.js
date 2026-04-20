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

    // ---- Homepage Grid Logic ----
    const renderHomeGrids = () => {
        const storeGrid = document.getElementById('home-store-grid');
        const journalGrid = document.getElementById('home-journal-grid');
        
        if (storeGrid && typeof products !== 'undefined') {
            const activeProducts = products.filter(p => p.category.toLowerCase() === 'art prints');
            const dateStr = new Date().toISOString().split('T')[0];
            let seed = 0;
            for(let i=0; i<dateStr.length; i++) seed += dateStr.charCodeAt(i);
            
            const shuffledProducts = [...activeProducts].sort((a,b) => {
                const hashA = (seed * a.title.charCodeAt(0)) % 100;
                const hashB = (seed * b.title.charCodeAt(0)) % 100;
                return hashA - hashB;
            });
            
            const topProducts = shuffledProducts.slice(0, 6);
            
            storeGrid.innerHTML = topProducts.map(p => `
                <a href="product.html?id=${p.id}" class="pdp-related-card" style="text-decoration: none;">
                    <div class="pdp-related-image-container">
                        <img src="${p.images ? p.images[0] : p.image}" alt="${p.title}" class="pdp-related-image" loading="lazy">
                    </div>
                    <div class="card-content-wrapper">
                        <div class="card-pill-orange">${p.category}</div>
                        <div class="card-title">${p.title}${p.designVariants ? ` (${p.designVariants[0].name})` : ''}</div>
                        <div class="card-footer">
                            <span class="card-price">£${Object.values(p.priceVariants || {"Base": "TBD"})[0]}</span>
                            <span class="card-link">Discover &rarr;</span>
                        </div>
                    </div>
                </a>
            `).join('');
        }

        if (journalGrid && typeof window.journalData !== 'undefined') {
            const editionsFound = new Set();
            const topJournals = [];
            for (const post of window.journalData) {
                if (post.category !== 'global-five') {
                    if (!editionsFound.has(post.edition)) {
                        editionsFound.add(post.edition);
                        // Modify link to go to the journal edition page instead of anchor
                        const parts = post.link.split('#');
                        const url = parts.length > 0 ? parts[0] : post.link;
                        topJournals.push({ ...post, link: url });
                        if (topJournals.length === 6) break;
                    }
                }
            }
            
            journalGrid.innerHTML = topJournals.map(j => `
                <a href="${j.link}" class="pdp-related-card is-archive" style="text-decoration: none;">
                    <div class="pdp-related-image-container">
                        <img src="${j.image}" alt="${j.title}" class="pdp-related-image" loading="lazy">
                    </div>
                    <div class="card-content-wrapper">
                        <div class="card-pill-orange">${j.edition || 'JOURNAL'}</div>
                        <div class="card-title">${j.title}</div>
                        <div class="card-desc">${j.subtitle}</div>
                        <div class="card-footer">
                            <span class="card-price" style="color: var(--ink-gray);">${j.publishDate || ''}</span>
                            <span class="card-link">Read &rarr;</span>
                        </div>
                    </div>
                </a>
            `).join('');
        }
    };
    
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

        // Update the new Global Bag Icon
        const globalBagCountBadge = document.querySelector('.bag-count-badge');
        if (globalBagCountBadge) {
            globalBagCountBadge.innerText = count;
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

    // ---- GSAP Scroll Animations (Akaru Inspiration) ----
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Text Reveals
        const revealTexts = document.querySelectorAll('.reveal-text span');
        revealTexts.forEach(text => {
            gsap.to(text, {
                scrollTrigger: {
                    trigger: text,
                    start: "top 95%",
                },
                y: "0%",
                duration: 1,
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

        // Image Parallax
        const parallaxImages = document.querySelectorAll('.akaru-bg, .akaru-block-img img');
        parallaxImages.forEach(img => {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
                y: "15%",
                scale: 1, // subtle scale down
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
            // HIDDEN per user request: Only showing 'all' and 'art prints' categories
            const rawCategories = ['all', ...new Set(products.map(p => p.category))];
            const categories = rawCategories.filter(cat => cat.toLowerCase() === 'all' || cat.toLowerCase() === 'art prints');
            
            categoryNav.innerHTML = categories.map(cat => `
                <button class="category-btn ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
                    ${cat.toUpperCase()}
                </button>
            `).join('');

            categoryNav.querySelectorAll('.category-btn').forEach(btn => {
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
                <button class="filter-btn ${currentSubFilter === 'all' ? 'active' : ''}" data-sub="all">ALL</button>
                ${subFilters.map(sf => `
                    <button class="filter-btn ${currentSubFilter === sf ? 'active' : ''}" data-sub="${sf}">
                        ${sf.toUpperCase()}
                    </button>
                `).join('')}
            `;

            subFilterNav.querySelectorAll('.filter-btn').forEach(btn => {
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
                const prices = Object.values(product.priceVariants);
                const minPrice = Math.min(...prices);
                const card = document.createElement('article');
                card.className = 'product-card';
                card.style.opacity = '0'; // For GSAP staggered entry
                
                const imgTarget = product.images ? product.images[0] : product.image;
                card.innerHTML = `
                    <div class="product-image-container">
                        <a href="product.html?id=${product.id}" style="display:block;">
                            <img src="${imgTarget}" alt="${product.title}" class="product-image" loading="lazy">
                        </a>
                        <div class="product-actions">
                            <button class="btn-shop-add" data-id="${product.id}" onclick="window.location.href='product.html?id=${product.id}'">View Edition</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="product-series">${product.series}</span>
                        <a href="product.html?id=${product.id}" style="color:inherit; text-decoration:none;"><h3 class="product-title">${product.title}</h3></a>
                        <span class="product-price">from £${minPrice}.00</span>
                    </div>
                `;
                productGrid.appendChild(card);
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
            // Pick 4 products: prioritize current category if possible, else random
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
                    <div class="shop-grid" style="padding: 0; width: 100%; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                        ${recs.map(p => {
                            const prices = Object.values(p.priceVariants);
                            const minP = Math.min(...prices);
                            return `
                                <article class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
                                    <div class="product-image-container">
                                        <img src="${p.images ? p.images[0] : p.image}" alt="${p.title}" class="product-image" loading="lazy">
                                    </div>
                                    <div class="product-info">
                                        <span class="product-series">${p.series}</span>
                                        <h3 class="product-title">${p.title}</h3>
                                        <span class="product-price">from £${minP}.00</span>
                                    </div>
                                </article>
                            `;
                        }).join('')}
                    </div>
                    <button class="filter-btn" style="margin-top: var(--spacing-xxl); padding: 1rem 2rem;" onclick="window.location.href='shop.html'">View All Editions</button>
                </div>
            `;
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
    
    // Only initialize if we're on a journal edition page
    if (sections.length === 0 || navLinks.length === 0) return;

    // ---- Create Mobile Roller Nav ----
    const editionNavDesktop = document.querySelector('.edition-nav');
    const journalContent = document.querySelector('.journal-content');
    
    if (editionNavDesktop && journalContent) {
        const mobileNavWrapper = document.createElement('nav');
        mobileNavWrapper.className = 'edition-nav-mobile';
        
        // Add Roller Indicator (Subtle dots/icon)
        const indicator = document.createElement('div');
        indicator.className = 'roller-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        mobileNavWrapper.appendChild(indicator);

        const rollerContainer = document.createElement('div');
        rollerContainer.className = 'roller-container';
        
        const rollerList = document.createElement('div');
        rollerList.className = 'roller-list';
        
        // Clone links from desktop
        const desktopLinks = editionNavDesktop.querySelectorAll('.nav-link');
        desktopLinks.forEach((link, idx) => {
            const clone = link.cloneNode(true);
            clone.classList.remove('active');
            clone.setAttribute('data-index', idx);
            rollerList.appendChild(clone);
            
            // Allow manual click
            clone.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = clone.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        rollerContainer.appendChild(rollerList);
        mobileNavWrapper.appendChild(rollerContainer);
        
        const breadcrumbHeader = document.querySelector('.sticky-breadcrumb-header');
        if (breadcrumbHeader) {
            breadcrumbHeader.insertAdjacentElement('afterend', mobileNavWrapper);
        } else {
            journalContent.insertBefore(mobileNavWrapper, journalContent.firstChild);
        }
        
        navLinks = document.querySelectorAll('.nav-link');
    }
    // ----------------------------

    if (typeof gsap !== 'undefined') {
        gsap.set('.nav-item .nav-subtitle', { height: 0, opacity: 0, marginTop: 0 });
        const initialActive = document.querySelector('.nav-link.active + .nav-subtitle');
        if (initialActive) {
            gsap.set(initialActive, { height: 'auto', opacity: 0.8, marginTop: "0.25rem" });
        }
    }

    let currentActiveLinkId = null;

    window.addEventListener('scroll', () => {
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
                        
                        // Desktop GSAP
                        if (subtitle && subtitle.classList.contains('nav-subtitle') && typeof gsap !== 'undefined') {
                            gsap.to(subtitle, {
                                duration: 0.6,
                                height: 'auto',
                                opacity: 0.8,
                                marginTop: "0.25rem",
                                ease: "back.out(1.7)"
                            });
                        }
                        
                        // Mobile Roller Logic: Center the active link vertically
                        if (link.parentElement && link.parentElement.classList.contains('roller-list')) {
                            const list = link.parentElement;
                            const index = parseInt(link.getAttribute('data-index'));
                            const itemHeight = 32; // 2rem = 32px roughly
                            // Window height is 96px (6rem). To center, we need offset.
                            // Offset = (WindowMid) - (ItemTop + ItemMid)
                            // Offset = 48 - (index * 32 + 16)
                            const offset = 48 - (index * 32 + 16);
                            list.style.transform = `translateY(${offset}px)`;
                        }
                    }
                } else {
                    if (link.classList.contains('active')) {
                        link.classList.remove('active');
                        if (subtitle && subtitle.classList.contains('nav-subtitle') && typeof gsap !== 'undefined') {
                            gsap.to(subtitle, {
                                duration: 0.4,
                                height: 0,
                                opacity: 0,
                                marginTop: 0,
                                ease: "power2.inOut"
                            });
                        }
                    }
                }
            });
        }
    });
});


