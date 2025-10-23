// Better Shop Script

let shopData = [];
let currentService = null;

// Fetch shop data
async function loadShopServices() {
    try {
        const response = await fetch('../data/better-shop.json');
        if (response.ok) {
            shopData = await response.json();
            displayServices();
        }
    } catch (error) {
        console.error('Failed to load shop services:', error);
    }
}

function displayServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    grid.innerHTML = shopData.map(service => createServiceCard(service)).join('');
    
    // Add click handlers for detailed services
    document.querySelectorAll('.service-card[data-has-details="true"]').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.dataset.serviceId;
            const service = shopData.find(s => s.id === serviceId);
            if (service) openServiceModal(service);
        });
    });
}

function createServiceCard(service) {
    const hasDetails = service.features && service.features.length > 0;
    
    return `
        <div class="service-card" data-service-id="${service.id}" data-has-details="${hasDetails}" style="${hasDetails ? 'cursor: pointer;' : ''}">
            <div class="service-icon" style="font-size: 3rem;">${service.icon}</div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-description">${service.description}</p>
            <div class="service-price">${service.price}</div>
            ${hasDetails ? '<p style="font-size: 0.85rem; color: var(--color-text-tertiary); margin-top: 0.5rem;">Click for details</p>' : ''}
        </div>
    `;
}

function openServiceModal(service) {
    currentService = service;
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">${service.icon}</div>
            <h2 style="font-size: 2rem; font-weight: 700; margin: 0; color: var(--color-text-primary);">${service.title}</h2>
            <p style="color: var(--color-text-secondary); margin-top: 0.5rem; font-size: 1.1rem;">${service.description}</p>
        </div>
        
        <div style="padding: 1rem; background: rgba(0, 122, 255, 0.1); border-radius: 12px; border: 1px solid rgba(0, 122, 255, 0.2); margin-bottom: 2rem; text-align: center;">
            <p style="font-size: 1.25rem; font-weight: 600; color: var(--color-accent); margin: 0;">${service.price}</p>
        </div>
        
        ${service.features && service.features.length > 0 ? `
            <div>
                <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: var(--color-text-primary);">What's Included</h3>
                <div style="display: grid; gap: 0.75rem;">
                    ${service.features.map(feature => `
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(76, 175, 80, 0.1); border-radius: 10px;">
                            <span style="color: #4caf50; font-size: 1.25rem;">✓</span>
                            <span style="color: var(--color-text-primary); font-weight: 500;">${feature}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="margin-top: 2rem; text-align: center;">
            <a href="https://discord.gg/PJWAYHuWKF" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem 2rem; background: #5865f2; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 1.1rem; transition: all 0.2s;">
                <img src="../discord-icon.ico" alt="Discord" style="width: 20px; height: 20px;">
                Order on Discord
            </a>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentService = null;
}

// Initialize on page load
loadShopServices();

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeServiceModal();
});

