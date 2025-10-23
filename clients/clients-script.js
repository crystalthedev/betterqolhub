// Clients Page Script

// Load client data from JSON file
let clientsData = [];

// Fetch clients data
async function loadClients() {
    try {
        const response = await fetch('../data/clients.json');
        if (response.ok) {
            const data = await response.json();
            // Transform data format
            clientsData = data.map(client => ({
                name: client.name,
                type: client.type,
                versions: client.version || [],
                features: client.features?.map(f => {
                    // Normalize feature names
                    const normalized = f.toLowerCase().replace(/\//g, '').replace(/\s+/g, '');
                    return normalized;
                }) || [],
                macros: client.macros?.map(m => {
                    // Normalize macro names
                    const normalized = m.toLowerCase().replace(/\//g, '').replace(/\s+/g, '');
                    return normalized;
                }) || [],
                services: client.services || [],
                prices: client.price || [],
                github: client['github link'],
                download: client['download link'],
                website: client['website link'],
                discord: client['discord link'],
                discordIcon: client['discord server id'] && client['discord icon hash'] 
                    ? `https://cdn.discordapp.com/icons/${client['discord server id']}/${client['discord icon hash']}.webp?size=64`
                    : null
            }));
            return clientsData;
        }
    } catch (error) {
        console.error('Failed to load clients:', error);
    }
    return [];
}

let filteredClients = [];
let currentFilters = {
    search: '',
    sort: 'type',
    type: 'all',
    version: 'all',
    price: 'all',
    features: [],
    macros: []
};

// Filter and render clients
function applyFilters() {
    renderClients();
    updateResultsCount();
}

// Initialize filter event listeners
function initializeFilters() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        applyFilters();
    });

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        applyFilters();
    });

    // Filter buttons
    setupFilterButtons('typeFilters', (value) => {
        currentFilters.type = value;
        applyFilters();
    });

    setupFilterButtons('versionFilters', (value) => {
        currentFilters.version = value;
        applyFilters();
    });

    setupFilterButtons('priceFilters', (value) => {
        currentFilters.price = value;
        applyFilters();
    });

    setupMultiFilterButtons('featuresFilters', currentFilters.features);
    setupMultiFilterButtons('macrosFilters', currentFilters.macros);

    // Reset button
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

function setupFilterButtons(containerId, callback) {
    const container = document.getElementById(containerId);
    const buttons = container.querySelectorAll('.filter-chip');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            callback(button.dataset.filter);
        });
    });
}

function setupMultiFilterButtons(containerId, filterArray) {
    const container = document.getElementById(containerId);
    const buttons = container.querySelectorAll('.filter-chip');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const value = button.dataset.filter;
            
            if (button.classList.contains('active')) {
                if (!filterArray.includes(value)) {
                    filterArray.push(value);
                }
            } else {
                const index = filterArray.indexOf(value);
                if (index > -1) {
                    filterArray.splice(index, 1);
                }
            }
            
            applyFilters();
        });
    });
}

function resetFilters() {
    currentFilters = {
        search: '',
        sort: 'type',
        type: 'all',
        version: 'all',
        price: 'all',
        features: [],
        macros: []
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'type';
    
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('[data-filter="all"]').forEach(btn => {
        btn.classList.add('active');
    });
    
    applyFilters();
}

function applyFilters() {
    filteredClients = clientsData.filter(client => {
        // Search filter
        if (currentFilters.search && 
            !client.name.toLowerCase().includes(currentFilters.search) &&
            !client.type.toLowerCase().includes(currentFilters.search)) {
            return false;
        }
        
        // Type filter
        if (currentFilters.type !== 'all') {
            const typeMap = {
                'cheat': 'Cheat Client',
                'macro': 'Macro Client',
                'legit': 'Legit Client',
                'shop': ['Coin Shop', 'config shop'],
                'other': ['scammer list', 'ct plugins']
            };
            const expectedTypes = typeMap[currentFilters.type];
            if (Array.isArray(expectedTypes)) {
                if (!expectedTypes.includes(client.type)) {
                    return false;
                }
            } else if (client.type !== expectedTypes) {
                return false;
            }
        }
        
        // Version filter
        if (currentFilters.version !== 'all') {
            if (!client.versions.includes(currentFilters.version)) {
                return false;
            }
        }
        
        // Price filter
        if (currentFilters.price !== 'all') {
            const priceCheck = currentFilters.price === 'free' ? 
                client.prices.some(p => p.toLowerCase() === 'free') :
                client.prices.some(p => p.toLowerCase().includes('$'));
            if (!priceCheck) {
                return false;
            }
        }
        
        // Features filter (OR logic - any matching feature)
        if (currentFilters.features.length > 0) {
            const hasAnyFeature = currentFilters.features.some(filterFeature => 
                client.features?.some(clientFeature => clientFeature === filterFeature)
            );
            if (!hasAnyFeature) return false;
        }
        
        // Macros filter (OR logic - any matching macro)
        if (currentFilters.macros.length > 0) {
            const hasAnyMacro = currentFilters.macros.some(filterMacro => 
                client.macros?.some(clientMacro => clientMacro === filterMacro)
            );
            if (!hasAnyMacro) return false;
        }
        
        return true;
    });
    
    // Sort
    filteredClients.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'version':
                return b.version.localeCompare(a.version);
            case 'type':
            default:
                return a.type.localeCompare(b.type);
        }
    });
    
    renderClients();
    updateResultsCount();
}

function renderClients() {
    const grid = document.getElementById('clientsGrid');
    
    if (filteredClients.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                </svg>
                <h3>No clients found</h3>
                <p>Try adjusting your filters to see more results.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredClients.map(client => createClientCard(client)).join('');
}

function createClientCard(client) {
    // Collect all tags from features, macros, and services
    const allTags = [
        ...(client.features || []),
        ...(client.macros || []),
        ...(client.services || [])
    ].slice(0, 5).map(tag => {
        // Capitalize first letter
        const display = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<span class="client-tag">${display}</span>`;
    }).join('');
    
    // Format versions and prices
    const versionTags = (client.versions || []).map(v => `<span class="client-tag version">${v}</span>`).join('');
    const priceTags = (client.prices || []).map(p => `<span class="client-tag price">${p}</span>`).join('');
    
    return `
        <div class="client-card">
            <div class="client-header">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    ${client.discordIcon ? `
                        <img src="${client.discordIcon}" 
                             alt="${client.name}" 
                             style="width: 40px; height: 40px; border-radius: 8px; border: 1px solid var(--glass-border);"
                             onerror="this.style.display='none'">
                    ` : ''}
                    <div>
                        <h3 class="client-title">${client.name}</h3>
                        <span class="client-type">${client.type}</span>
                    </div>
                </div>
            </div>
            
            ${(versionTags || priceTags) ? `<div class="client-tags">${versionTags}${priceTags}</div>` : ''}
            ${allTags ? `<div class="client-tags">${allTags}</div>` : ''}
            
            <div class="client-footer">
                ${client.download ? `
                    <a href="${client.download}" target="_blank" class="client-btn-icon primary" title="Download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </a>
                ` : ''}
                ${client.github ? `
                    <a href="${client.github}" target="_blank" class="client-btn-icon" title="GitHub">
                        <svg width="16" height="16" viewBox="0 0 98 96" fill="currentColor">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
                        </svg>
                    </a>
                ` : ''}
                ${client.discord ? `
                    <a href="${client.discord}" target="_blank" class="client-btn-icon" title="Discord">
                        <img src="../discord-icon.ico" alt="Discord" style="width: 18px; height: 18px;">
                    </a>
                ` : ''}
                ${client.website ? `
                    <a href="${client.website}" target="_blank" class="client-btn-icon" title="Website">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function updateResultsCount() {
    const count = document.getElementById('resultsCount');
    count.textContent = `${filteredClients.length} client${filteredClients.length !== 1 ? 's' : ''} found`;
}

// Update Discord online count
async function updateDiscordCount() {
    try {
        const response = await fetch('https://discord.com/api/guilds/1346908926855221372/widget.json');
        if (response.ok) {
            const data = await response.json();
            const count = data.presence_count || 0;
            document.getElementById('onlineCount').textContent = count;
        } else {
            document.getElementById('onlineCount').textContent = '150+';
        }
    } catch (error) {
        console.error('Failed to fetch Discord data:', error);
        document.getElementById('onlineCount').textContent = '150+';
    }
}

// Initialize everything on page load
async function initializePage() {
    await loadClients();
    filteredClients = [...clientsData];
    initializeFilters();
    applyFilters();
    updateDiscordCount();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

