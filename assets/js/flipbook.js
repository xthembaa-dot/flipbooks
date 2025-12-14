// Simple Flipbook with Client Support
console.log("Flipbook script loading...");

class Flipbook {
    constructor() {
        console.log("Flipbook starting...");
        this.currentPageIndex = 1;
        this.initialize();
    }
    
    async initialize() {
        console.log("Initializing flipbook...");
        
        // Get client from URL
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('client') || 'client1';
        console.log("Client ID:", clientId);
        
        // Get book data
        try {
            this.bookData = getClientBook(clientId);
            console.log("Book data loaded:", this.bookData);
        } catch (e) {
            console.error("Error loading book:", e);
            showNotification("Error loading book", "error");
            return;
        }
        
        // Get DOM elements
        this.flipbook = document.getElementById('flipbook');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        if (!this.flipbook) {
            console.error("Flipbook element not found!");
            return;
        }
        
        // Generate pages
        this.generatePages();
        
        // Initialize display
        this.initializeBook();
        
        // Setup events
        this.setupEventListeners();
        
        // Hide loading
        hideLoading();
        console.log("Flipbook ready!");
    }
    
    generatePages() {
        console.log("Generating pages...");
        this.flipbook.innerHTML = '';
        
        for (let i = 1; i <= 20; i++) {
            const pageData = this.bookData.pages[i-1];
            const isRightPage = i % 2 !== 0;
            const sideClass = isRightPage ? 'right-page' : 'left-page';
            
            const pageEl = document.createElement('div');
            pageEl.id = `page-${i}`;
            pageEl.className = `page ${sideClass}`;
            
            pageEl.innerHTML = `
                <div class="page-content">
                    <img src="${pageData.imageUrl}" 
                         alt="Page ${i}" 
                         class="page-image"
                         onerror="console.error('Failed to load image:', this.src)">
                </div>
            `;
            
            this.flipbook.appendChild(pageEl);
        }
        
        // Add controls
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `
            <button id="prev-btn" class="nav-button">◀️</button>
            <button id="next-btn" class="nav-button">▶️</button>
        `;
        this.flipbook.appendChild(controls);
        
        // Update references
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.pages = document.querySelectorAll('.page');
    }
    
    initializeBook() {
        console.log("Initializing book display...");
        this.pages.forEach(p => p.style.display = 'none');
        
        const cover = document.getElementById('page-1');
        cover.classList.add('visible-right');
        cover.style.display = 'block';
        
        this.updateControls();
    }
    
    setupEventListeners() {
        console.log("Setting up event listeners...");
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
    }
    
    nextPage() {
        if (this.currentPageIndex >= 20) return;
        this.currentPageIndex++;
        this.updateBookDisplay();
    }
    
    prevPage() {
        if (this.currentPageIndex <= 1) return;
        this.currentPageIndex--;
        this.updateBookDisplay();
    }
    
    updateBookDisplay() {
        console.log("Updating to page:", this.currentPageIndex);
        this.updateControls();
    }
    
    updateControls() {
        this.prevBtn.disabled = this.currentPageIndex === 1;
        this.nextBtn.disabled = this.currentPageIndex >= 20;
    }
}

// Start when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, starting flipbook...");
    window.flipbook = new Flipbook();
});
