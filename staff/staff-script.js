let staffData = [];
let copiedUsername = null;
async function loadStaff() {
    try {
        const response = await fetch('../data/staff.json');
        if (response.ok) {
            staffData = await response.json();
            displayStaff();
        }
    } catch (error) {
        console.error('Failed to load staff:', error);
    }
}

function displayStaff() {
    const grid = document.getElementById('staffGrid');
    if (!grid) return;
    
    grid.innerHTML = staffData.map(member => createStaffCard(member)).join('');
}

function createStaffCard(member) {
    const joinDate = new Date(member.joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
    
    const avatarSize = member.id === 'guruofthemoon' ? '83px' : '64px';
    
    return `
        <div class="staff-card" data-staff-id="${member.id}">
            <div class="staff-header">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${member.avatar}" 
                         alt="${member.name} avatar" 
                         class="staff-avatar"
                         style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; border: 2px solid var(--glass-border);"
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <div>
                        <h3 class="staff-title">${member.name}</h3>
                        <p class="staff-role">${member.role}</p>
                        <p class="staff-joined">Joined ${joinDate}</p>
                    </div>
                </div>
            </div>
            
            <p class="staff-description">${member.description}</p>
            
            <div class="staff-specialties">
                <h4>Specialties</h4>
                <div class="specialty-tags">
                    ${member.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
                </div>
            </div>
            
            <div class="staff-footer">
                ${member.discord ? `
                    <button onclick="copyDiscord('${member.discord}')" class="staff-link discord-copy">
                        <img src="../discord-icon.ico" alt="Discord" style="width: 16px; height: 16px;">
                        ${member.discord}
                    </button>
                ` : ''}
                ${member.github ? `
                    <a href="${member.github}" target="_blank" class="staff-link secondary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </a>
                ` : ''}
                ${member.website ? `
                    <a href="${member.website}" target="_blank" class="staff-link secondary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
}

async function copyDiscord(username) {
    try {
        await navigator.clipboard.writeText(username);
        showCopyFeedback(username);
    } catch (error) {
        console.error('Failed to copy:', error);
        const textarea = document.createElement('textarea');
        textarea.value = username;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyFeedback(username);
    }
}

function showCopyFeedback(username) {
    copiedUsername = username;
    
    
    const buttons = document.querySelectorAll('.discord-copy');
    buttons.forEach(btn => {
        if (btn.textContent.includes(username)) {
            btn.classList.add('copied');
            setTimeout(() => {
                btn.classList.remove('copied');
                copiedUsername = null;
            }, 2000);
        }
    });
}

loadStaff();

