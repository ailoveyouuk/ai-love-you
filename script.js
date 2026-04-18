document.addEventListener('DOMContentLoaded', () => {
    // ---- Typewriter Animation (Homepage Only) ----
    const initTypewriter = () => {
        const target = document.querySelector('.typewriter-text');
        if (!target) return;

        const text = "MAN, DAUGHTER & MACHINE";
        let index = 0;

        // Ensure text is clear initially
        target.innerText = '';

        const type = () => {
            if (index < text.length) {
                target.innerText += text.charAt(index);
                index++;
                setTimeout(type, 80); // Speed of typing
            }
        };

        // Subtle delay before starting
        setTimeout(type, 500);
    }

    initTypewriter();
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
            const categories = ['all', ...new Set(products.map(p => p.category))];
            
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
