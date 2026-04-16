// Zettelkasten AI App - Pure JavaScript (No Build Tools!)
// Main Application Logic

document.addEventListener('DOMContentLoaded', function() {
    console.log('Zettelkasten AI App initialized!');
    
    // Initialize the app
    initNavigation();
    initDashboard();
    initTrunksView();
    initSearchView();
    initMatrixView();
});

// Navigation
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewName = this.dataset.view;
            
            // Update active button
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding view
            showView(viewName);
        });
    });
}

function showView(viewName) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
        if (view.id === `${viewName}-view`) {
            view.classList.add('active');
        }
    });
}

// Dashboard
function initDashboard() {
    if (!window.zettelData) {
        console.error('zettelData not loaded!');
        return;
    }
    
    // Update stats
    document.getElementById('total-trunks').textContent = zettelData.getTotalTrunks();
    document.getElementById('total-entries').textContent = zettelData.getTotalEntries();
    document.getElementById('total-categories').textContent = zettelData.getCategories().length;
    
    // Quick links - show first 6 trunks
    const quickTrunksContainer = document.getElementById('quick-trunks');
    const firstTrunks = zettelData.trunks.slice(0, 6);
    
    quickTrunksContainer.innerHTML = firstTrunks.map(trunk => `
        <div class="trunk-link" onclick="openTrunkModal('${trunk.id}')">
            <h4>Trunk ${trunk.id}</h4>
            <p>${truncateText(trunk.title, 50)}</p>
            <small>${trunk.entries.length} entries</small>
        </div>
    `).join('');
}

// Trunks View
function initTrunksView() {
    const trunkFilter = document.getElementById('trunk-filter');
    const categoryFilter = document.getElementById('category-filter');
    
    // Populate category filter
    const categories = zettelData.getCategories();
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    // Render trunks
    renderTrunksList(zettelData.trunks);
    
    // Filter functionality
    trunkFilter.addEventListener('input', filterTrunks);
    categoryFilter.addEventListener('change', filterTrunks);
}

function filterTrunks() {
    const trunkFilter = document.getElementById('trunk-filter');
    const categoryFilter = document.getElementById('category-filter');
    
    const trunkQuery = trunkFilter.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    let filtered = zettelData.trunks;
    
    // Filter by text
    if (trunkQuery) {
        filtered = filtered.filter(trunk => 
            trunk.title.toLowerCase().includes(trunkQuery) ||
            trunk.description.toLowerCase().includes(trunkQuery) ||
            trunk.id.includes(trunkQuery)
        );
    }
    
    // Filter by category
    if (selectedCategory) {
        filtered = filtered.filter(trunk => 
            trunk.description && trunk.description.includes(selectedCategory)
        );
    }
    
    renderTrunksList(filtered);
}

function renderTrunksList(trunks) {
    const container = document.getElementById('trunks-list');
    
    if (trunks.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem;">No trunks found</p>';
        return;
    }
    
    container.innerHTML = trunks.map(trunk => `
        <div class="trunk-card" onclick="openTrunkModal('${trunk.id}')">
            <h3>Trunk ${trunk.id}: ${escapeHtml(trunk.title)}</h3>
            ${trunk.description ? `<p class="description">${escapeHtml(trunk.description)}</p>` : ''}
            <p class="entry-count">${trunk.entries.length} entries</p>
        </div>
    `).join('');
}

// Search View
function initSearchView() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (!query) {
        resultsContainer.innerHTML = '<p style="color: #888;">Please enter a search term</p>';
        return;
    }
    
    const results = zettelData.search(query);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="color: #888;">No results found</p>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="search-result-item">
            <h4>${escapeHtml(result.entryTitle)}</h4>
            <p class="trunk-ref">Trunk ${result.trunkId}${result.entryId ? ` • Entry ${result.entryId}` : ''}</p>
            ${result.description ? `<p>${escapeHtml(result.description)}</p>` : ''}
        </div>
    `).join('');
}

// Matrix View
function initMatrixView() {
    const container = document.getElementById('matrix-container');
    
    // Create a simple visualization showing connections between trunks
    const categories = zettelData.getCategories();
    
    container.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--color-cyan); margin-bottom: 1rem;">Knowledge Categories</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
                ${categories.map(cat => `
                    <div style="
                        background: rgba(128, 0, 255, 0.2);
                        border: 1px solid var(--color-purple);
                        padding: 1rem;
                        border-radius: 5px;
                        min-width: 200px;
                    ">
                        <strong style="color: var(--color-cyan);">${escapeHtml(cat)}</strong>
                        <p style="color: #aaa; font-size: 0.9rem; margin-top: 0.5rem;">
                            ${zettelData.trunks.filter(t => t.description && t.description.includes(cat)).length} trunks
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div>
            <h3 style="color: var(--color-yellow); margin-bottom: 1rem;">Trunk Distribution</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.5rem;">
                ${zettelData.trunks.map(trunk => `
                    <div style="
                        background: rgba(0, 255, 204, 0.1);
                        border: 1px solid var(--color-cyan);
                        padding: 0.5rem;
                        border-radius: 3px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s;
                    " onclick="openTrunkModal('${trunk.id}')"
                       onmouseover="this.style.background='rgba(0, 255, 204, 0.3)'"
                       onmouseout="this.style.background='rgba(0, 255, 204, 0.1)'">
                        <div style="color: var(--color-cyan); font-family: var(--font-mono);">T${trunk.id}</div>
                        <div style="color: #888; font-size: 0.8rem;">${trunk.entries.length} entries</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Modal
function openTrunkModal(trunkId) {
    const trunk = zettelData.getTrunkById(trunkId);
    if (!trunk) return;
    
    const modal = document.getElementById('trunk-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>Trunk ${trunk.id}: ${escapeHtml(trunk.title)}</h2>
        ${trunk.description ? `<p class="description">${escapeHtml(trunk.description)}</p>` : ''}
        
        <h3 style="color: var(--color-yellow); margin: 1.5rem 0 1rem;">Entries (${trunk.entries.length})</h3>
        ${trunk.entries.length > 0 ? `
            <ul class="entry-list">
                ${trunk.entries.map(entry => `
                    <li class="entry-item">
                        <code>[${entry.id}]</code>
                        <strong style="color: var(--color-cyan);">${escapeHtml(entry.title)}</strong>
                        ${entry.description ? `<blockquote>${escapeHtml(entry.description)}</blockquote>` : ''}
                    </li>
                `).join('')}
            </ul>
        ` : '<p style="color: #888;">No entries in this trunk</p>'}
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('trunk-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('trunk-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Utility functions
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.openTrunkModal = openTrunkModal;
window.closeModal = closeModal;

console.log('✓ Zettelkasten AI App ready!');
