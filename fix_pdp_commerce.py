import re

with open('product.html', 'r') as f:
    html = f.read()

# 1. Update `renderPurchaseBlock`
new_purchase_block = """
            function renderPurchaseBlock(prod, activeIndex, suffix) {
                const priceVariants = prod.priceVariants || { "A3+": 45 };
                const firstPrice = Object.values(priceVariants)[0];
                return `
                    <style>
                        .pdp-format-dropdown {
                            font-family: var(--font-display);
                            font-size: 0.8rem;
                            letter-spacing: 0.1em;
                            text-transform: uppercase;
                            color: var(--carbon-black);
                            background: transparent;
                            border: 1px solid var(--border-color);
                            padding: 0.5rem 1rem;
                            width: 100%;
                            cursor: pointer;
                            outline: none;
                        }
                        .pdp-commerce-label {
                            display: block; 
                            margin-bottom: 1rem; 
                            font-family: var(--font-display); 
                            font-size: 0.8rem; 
                            letter-spacing: 0.1em; 
                            text-transform: uppercase; 
                            color: var(--carbon-black); 
                            font-weight: 700;
                        }
                        .btn-bag-pill {
                            font-family: var(--font-body);
                            font-size: 0.65rem;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.1em;
                            background: var(--accent-color);
                            color: #ffffff;
                            border: 1.5px solid var(--accent-color);
                            padding: 0.5rem 0.6rem;
                            border-radius: 12px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            text-align: center;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            margin-top: 2rem;
                        }
                        .btn-bag-pill:hover {
                            background: transparent;
                            color: var(--accent-color);
                        }
                    </style>
                    <div class="pdp-purchase-block" id="purchase-block-${suffix}">
                        ${prod.designVariants ? `
                            <div class="pdp-purchase-row" style="margin-bottom: 2rem;">
                                <span class="pdp-commerce-label">Edition</span>
                                <div class="pdp-variants design-selector" style="display: flex; flex-direction: column; gap: 0.8rem;">
                                    ${prod.designVariants.map((dv, i) => 
                                        `<button class="nav-link ${i === activeIndex ? 'active' : ''} variant-pill-subtle" data-design-index="${i}" style="text-align: left; padding: 0; background: transparent; border: none; cursor: pointer; opacity: 1;">${dv.name}</button>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <div class="pdp-purchase-row" style="margin-bottom: 2rem;">
                            <span class="pdp-commerce-label">Format</span>
                            <div class="pdp-variants size-selector">
                                <select class="pdp-format-dropdown">
                                    ${Object.keys(priceVariants).map((key, i) => 
                                        `<option value="${key}" data-price="${priceVariants[key]}">${key}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="pdp-purchase-row" style="margin-bottom: 2rem;">
                            <span class="pdp-commerce-label">Quantity</span>
                            <div class="pdp-qty-selector" style="justify-content: flex-start; display: flex; align-items: center;">
                                <button class="pdp-qty-btn minus" aria-label="Decrease quantity" style="font-size: 0.9rem; width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; padding: 0;">−</button>
                                <span class="pdp-qty-display" style="font-family: var(--font-display); font-size: 0.8rem; letter-spacing: 0.05em; min-width: 2rem; text-align: center;">1</span>
                                <button class="pdp-qty-btn plus" aria-label="Increase quantity" style="font-size: 0.9rem; width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; padding: 0;">+</button>
                            </div>
                        </div>

                        <div class="pdp-purchase-row">
                            <div class="pdp-price price-display" style="font-size: 3rem; font-weight: 800; margin: 0; color: var(--carbon-black); letter-spacing: -0.02em; font-family: var(--font-body);">£${firstPrice}</div>
                        </div>

                        <button class="btn-bag-pill pdp-add-btn" data-id="${prod.id}">Add to Bag</button>
                    </div>
                `;
            }
"""

html = re.sub(r'function renderPurchaseBlock\([^\{]*\{.*?(?=const renderShowcaseGrid = \(\) => \{)', new_purchase_block, html, flags=re.DOTALL)

# 2. Update `attachEventListeners` block to hook the new <select> element
old_listener = r"""                // Sync Size Selectors
                const sizeSelectors = document.querySelectorAll\('\.size-selector'\);
                sizeSelectors\.forEach\(container => \{
                    const btns = container\.querySelectorAll\('\.variant-pill-subtle'\);
                    btns\.forEach\(btn => \{
                        btn\.addEventListener\('click', \(\) => \{
                            const activeSizeBtn = btn;
                            let selectedPrice = activeSizeBtn \? activeSizeBtn\.getAttribute\('data-price'\) : \(Object\.values\(product\.priceVariants \|\| \{ "A3\+": 45 \}\)\[0\]\);
                            const selectedSize = activeSizeBtn \? activeSizeBtn\.innerText : 'Unknown';
                             
                            document\.querySelectorAll\('\.size-selector \.variant-pill-subtle'\)\.forEach\(b => \{
                                if \(b\.innerText === selectedSize\) b\.classList\.add\('active'\);
                                else b\.classList\.remove\('active'\);
                            \}\);
                             
                            updatePriceDisplays\(selectedPrice\);
                        \}\);
                    \}\);
                \}\);"""

new_listener = """                // Sync Size Selectors (Dropdown)
                const formatSelects = document.querySelectorAll('.pdp-format-dropdown');
                formatSelects.forEach(selectBox => {
                    selectBox.addEventListener('change', (e) => {
                        const selectedOption = e.target.options[e.target.selectedIndex];
                        const selectedPrice = selectedOption.getAttribute('data-price');
                        
                        // Sync any other copies of this dropdown globally
                        formatSelects.forEach(s => s.value = e.target.value);
                        
                        updatePriceDisplays(selectedPrice);
                    });
                });"""

html = re.sub(old_listener, new_listener, html, flags=re.DOTALL)

with open('product.html', 'w') as f:
    f.write(html)

print("Commerce block restructuring completed successfully.")
