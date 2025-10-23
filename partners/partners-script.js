// Partners Page Script

let partnersData = [];
let currentPartner = null;

// Fetch partners data
async function loadPartners() {
    try {
        const response = await fetch('../data/partners.json');
        if (response.ok) {
            partnersData = await response.json();
            displayPartners();
        }
    } catch (error) {
        console.error('Failed to load partners:', error);
    }
}

function displayPartners() {
    const grid = document.getElementById('partnersGrid');
    if (!grid) return;
    
    grid.innerHTML = partnersData.map(partner => createPartnerCard(partner)).join('');
    
    // Add click handlers
    document.querySelectorAll('.partner-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking a link
            if (e.target.closest('a')) return;
            
            const partnerId = card.dataset.partnerId;
            const partner = partnersData.find(p => p.id === partnerId);
            if (partner) openPartnerModal(partner);
        });
    });
}

function openPartnerModal(partner) {
    currentPartner = partner;
    const modal = document.getElementById('partnerModal');
    const modalContent = document.getElementById('modalContent');
    
    const establishedDate = new Date(partner.established).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${partner.avatar}" 
                     alt="${partner.name} avatar" 
                     style="width: 80px; height: 80px; border-radius: 16px; border: 1px solid var(--glass-border);"
                     onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                <div>
                    <h2 style="font-size: 1.75rem; font-weight: 700; margin: 0; color: var(--color-text-primary); display: flex; align-items: center; gap: 0.5rem;">
                        ${partner.name}
                        ${partner.verified ? '<span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: linear-gradient(135deg, #007aff, #00c9ff); color: white; border-radius: 50%; font-size: 11px; font-weight: bold;">✓</span>' : ''}
                    </h2>
                    <p style="color: #ff1744; font-weight: 600; margin: 0.25rem 0;">${partner.type}</p>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin: 0;">Owner: ${partner.owner || 'N/A'}</p>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin: 0;">Est. ${establishedDate}</p>
                </div>
            </div>
        </div>
        
        <p style="color: var(--color-text-secondary); line-height: 1.6; margin: 1.5rem 0;">${partner.description}</p>
        
        <div style="margin: 1.5rem 0;">
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--color-text-primary);">Services</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${partner.services.map(s => `<span style="padding: 0.375rem 0.75rem; background: rgba(33, 150, 243, 0.15); color: #2196f3; border: 1px solid rgba(33, 150, 243, 0.3); border-radius: 8px; font-size: 0.875rem;">${s}</span>`).join('')}
            </div>
        </div>
        
        ${partner.pricing ? `
        <div style="margin: 1.5rem 0; padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 12px; border: 1px solid var(--glass-border);">
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: var(--color-text-primary);">Pricing</h3>
            ${Object.entries(partner.pricing).map(([service, price]) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="color: var(--color-text-secondary);">${service}:</span>
                    <span style="color: ${price.toLowerCase().includes('free') ? '#4caf50' : price.includes('%') ? '#ff9800' : '#2196f3'}; font-weight: 600;">${price}</span>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div style="margin: 1.5rem 0;">
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--color-text-primary);">Features</h3>
            <div style="display: grid; gap: 0.75rem;">
                ${partner.features.map(f => `
                    <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: rgba(76, 175, 80, 0.1); border-radius: 10px;">
                        <span style="color: #4caf50; font-size: 1.1rem; line-height: 1.5; flex-shrink: 0; margin-top: 0.1rem;">✓</span>
                        <span style="color: var(--color-text-primary); font-size: 0.95rem; font-weight: 500; line-height: 1.5;">${f}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--color-text-primary);">Links</h3>
            <div style="display: flex; gap: 0.75rem;">
                ${partner.discord ? `
                    <a href="${partner.discord}" target="_blank" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem; background: #5865f2; color: white; text-decoration: none; border-radius: 10px; font-weight: 500; transition: all 0.2s;">
                        <img src="../discord-icon.ico" alt="Discord" style="width: 18px; height: 18px;">
                        Discord Server
                    </a>
                ` : ''}
                ${partner.website ? `
                    <a href="${partner.website}" target="_blank" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem; background: var(--glass-bg-strong); color: var(--color-text-primary); text-decoration: none; border-radius: 10px; font-weight: 500; border: 1px solid var(--glass-border); transition: all 0.2s;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Website
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePartnerModal() {
    const modal = document.getElementById('partnerModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentPartner = null;
}

function createPartnerCard(partner) {
    return `
        <div class="partner-card" data-partner-id="${partner.id}" style="cursor: pointer;">
            <div class="partner-header">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${partner.avatar}" 
                         alt="${partner.name} avatar" 
                         class="partner-avatar"
                         style="width: 64px; height: 64px; border-radius: 12px; border: 1px solid var(--glass-border);"
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <div>
                        <h3 class="partner-title">
                            ${partner.name}
                            ${partner.verified ? '<span class="verified-badge">✓</span>' : ''}
                        </h3>
                        <p class="partner-type">${partner.type}</p>
                    </div>
                </div>
            </div>
            
            <p class="partner-description">${partner.description}</p>
            
            <div class="partner-services">
                <h4>Services</h4>
                <div class="service-tags">
                    ${partner.services.map(s => `<span class="service-tag">${s}</span>`).join('')}
                </div>
            </div>
            
            <div style="margin-top: auto; padding-top: 1rem; border-top: 0.5px solid var(--glass-border); text-align: center;">
                <span style="font-size: 0.85rem; color: var(--color-text-tertiary);">Click for details</span>
            </div>
        </div>
    `;
}

// Initialize on page load
loadPartners();

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePartnerModal();
});

