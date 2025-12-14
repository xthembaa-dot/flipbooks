
// Flipbook JavaScript
class Flipbook {
    constructor() {
        this.TOTAL_PAGES = 20; // Default
        this.currentPageIndex = 1;
        this.pages = [];
        this.bookData = null;
        this.soundEnabled = true;
        this.zoomLevel = 1;
        this.isFullscreen = false;
        
        this.initialize();
    }
    
    async initialize() {
        showLoading('Loading book...');
        
        // Load book configuration
        await this.loadBookConfig();
        
        // Initialize DOM elements
        this.flipbook = document.getElementById('flipbook');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentPageEl = document.getElementById('current-page');
        this.totalPagesEl = document.getElementById('total-pages');
        this.soundToggle = document.getElementById('sound-toggle');
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');
        this.fullscreenBtn = document.getElementById('fullscreen');
        this.printBtn = document.getElementById('print-btn');
        this.bookTitle = document.getElementById('book-title');
        
        // Set book title
        if (this.bookData && this.bookData.title) {
            this.bookTitle.textContent = this.bookData.title;
        }
        
        // Generate pages
        generatePages() {
    this.flipbook.innerHTML = '';
    
    // Generate pages from book data
    for (let i = 1; i <= this.TOTAL_PAGES; i++) {
        const isRightPage = i % 2 !== 0;
        const sideClass = isRightPage ? 'right-page' : 'left-page';
        const pageEl = document.createElement('div');
        pageEl.id = `page-${i}`;
        pageEl.className = `page ${sideClass}`;
        
        // Get page data - check if we have data for this page
        const pageData = this.bookData.pages[i-1];
        
        if (pageData && pageData.imageUrl) {
            // Client book with image
            pageEl.innerHTML = `
                <div class="page-content">
                    <img src="${pageData.imageUrl}" 
                         alt="${pageData.text || 'Page ' + i}" 
                         class="page-image">
                    ${pageData.text ? `<div class="page-text">${pageData.text}</div>` : ''}
                </div>
            `;
        } else {
            // Fallback: no image available
            pageEl.innerHTML = `
                <div class="page-content">
                    <p>Page ${i}</p>
                    <p>Content for page ${i}</p>
                </div>
            `;
        }
        
        this.flipbook.appendChild(pageEl);
    }
    
    // Add controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls';
    controlsContainer.innerHTML = `
        <button id="prev-btn" class="nav-button" disabled>◀️</button>
        <button id="next-btn" class="nav-button">▶️</button>
    `;
    this.flipbook.appendChild(controlsContainer);
    
    // Update page references
    this.pages = document.querySelectorAll('.page');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
};
        
        // Initialize sound
        this.sound = new Audio('assets/sounds/page-flip.mp3');
        this.sound.volume = 0.3;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize book display
        this.initializeBook();
        
        // Set total pages
        this.totalPagesEl.textContent = this.TOTAL_PAGES;
        
        hideLoading();
    }
    
   async loadBookConfig() {
    try {
        // Get client ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('client') || 'client1'; // Default to client1
        
        // Load the client's book configuration
        this.bookData = getClientBook(clientId);
        
        // Set total pages from book data
        this.TOTAL_PAGES = this.bookData.pages.length;
        
        // Update book title
        if (this.bookTitle && this.bookData.title) {
            this.bookTitle.textContent = this.bookData.title;
        }
        
        console.log(`Loaded book for client: ${clientId}`);
        
    } catch (error) {
        console.error('Error loading book config:', error);
        showNotification('Error loading book', 'error');
        
        // Fallback to sample book
        this.bookData = SAMPLE_BOOKS.sample;
        this.TOTAL_PAGES = 20;
    }
};
            
            // Generate sample page data
            for (let i = 1; i <= this.TOTAL_PAGES; i++) {
                this.bookData.pages.push({
                    id: i,
                    type: i === 1 ? 'cover' : i === this.TOTAL_PAGES ? 'backcover' : 'content',
                    content: i === 1 ? 
                        `<h1>Cover Page</h1><p>Book Title</p><p>By Your Name</p>` :
                        i === this.TOTAL_PAGES ?
                        `<h1>The End!</h1><p>Thank you for reading!</p>` :
                        `<h2>Page ${i}</h2><p>This is page ${i} of your book.</p>`
                });
            }
            
        } catch (error) {
            console.error('Error loading book config:', error);
            showNotification('Error loading book', 'error');
        }
    }
    
    generatePages() {
        this.flipbook.innerHTML = '';
        
        // Generate all pages
        for (let i = 1; i <= this.TOTAL_PAGES; i++) {
            const isRightPage = i % 2 !== 0;
            const sideClass = isRightPage ? 'right-page' : 'left-page';
            const pageEl = document.createElement('div');
            pageEl.id = `page-${i}`;
            pageEl.className = `page ${sideClass}`;
            
            // Add page content from book data
            if (this.bookData && this.bookData.pages[i-1]) {
                pageEl.innerHTML = `<div class="page-content">${this.bookData.pages[i-1].content}</div>`;
            } else {
                // Fallback content
                pageEl.innerHTML = `<div class="page-content"><p>Page ${i}</p></div>`;
            }
            
            this.flipbook.appendChild(pageEl);
        }
        
        // Add controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'controls';
        controlsContainer.innerHTML = `
            <button id="prev-btn" class="nav-button" disabled>◀️</button>
            <button id="next-btn" class="nav-button">▶️</button>
        `;
        this.flipbook.appendChild(controlsContainer);
        
        // Update page references
        this.pages = document.querySelectorAll('.page');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Sound toggle
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        
        // Zoom controls
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        
        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Print
        this.printBtn.addEventListener('click', () => this.printBook());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'f' || e.key === 'F') this.toggleFullscreen();
            if (e.key === '+' || e.key === '=') this.zoomIn();
            if (e.key === '-' || e.key === '_') this.zoomOut();
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.flipbook.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.flipbook.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) this.nextPage();
            if (touchEndX > touchStartX + 50) this.prevPage();
        });
        
        // Double-click to zoom
        this.flipbook.addEventListener('dblclick', (e) => {
            if (e.target.closest('.page')) {
                this.zoomIn();
            }
        });
    }
    
    initializeBook() {
        this.pages.forEach(p => p.style.display = 'none');
        const coverPage = document.getElementById('page-1');
        coverPage.classList.add('visible-right');
        coverPage.style.zIndex = 100;
        this.updateControls();
    }
    
    updateBookDisplay() {
        // Remove all transition classes
        this.pages.forEach(p => {
            p.className = p.className.split(' ').filter(c => 
                !c.startsWith('visible') && 
                !c.startsWith('turning') && 
                !c.startsWith('turned')
            ).join(' ');
            
            if (p.id === 'page-1') p.classList.add('page-1');
            if (p.id === `page-${this.TOTAL_PAGES}`) p.classList.add('page-20');
            p.style.display = 'none';
        });
        
        // Cover view
        if (this.currentPageIndex === 1) {
            document.getElementById('page-1').classList.add('visible-right');
            document.getElementById('page-1').style.display = 'block';
            
            for (let i = 2; i <= this.TOTAL_PAGES; i++) {
                document.getElementById(`page-${i}`).style.display = 'block';
                document.getElementById(`page-${i}`).classList.add('turned-back-page');
            }
        } 
        // Reading view
        else if (this.currentPageIndex >= 2 && this.currentPageIndex < this.TOTAL_PAGES) {
            const leftPageIndex = this.currentPageIndex;
            const rightPageIndex = this.currentPageIndex + 1;
            
            // Pages already turned
            for (let i = 1; i < leftPageIndex; i++) {
                const page = document.getElementById(`page-${i}`);
                page.style.display = 'block';
                if (i % 2 !== 0) {
                    page.classList.add('turned-page');
                } else {
                    page.classList.add('turned-back-page');
                }
            }
            
            // Currently visible pages
            const leftPage = document.getElementById(`page-${leftPageIndex}`);
            const rightPage = document.getElementById(`page-${rightPageIndex}`);
            leftPage.classList.add('visible-left');
            rightPage.classList.add('visible-right');
            leftPage.style.display = 'block';
            rightPage.style.display = 'block';
            
            // Pages yet to be opened
            for (let i = rightPageIndex + 1; i <= this.TOTAL_PAGES; i++) {
                document.getElementById(`page-${i}`).style.display = 'none';
            }
        } 
        // Back cover view
        else if (this.currentPageIndex === this.TOTAL_PAGES) {
            for (let i = 1; i < this.TOTAL_PAGES; i++) {
                const page = document.getElementById(`page-${i}`);
                page.style.display = 'block';
                if (i % 2 !== 0) {
                    page.classList.add('turned-page');
                } else {
                    page.classList.add('turned-back-page');
                }
            }
            
            document.getElementById(`page-${this.TOTAL_PAGES}`).classList.add('visible-left');
            document.getElementById(`page-${this.TOTAL_PAGES}`).style.display = 'block';
        }
        
        // Update page counter
        if (this.currentPageIndex === 1) {
            this.currentPageEl.textContent = '1';
        } else if (this.currentPageIndex === this.TOTAL_PAGES) {
            this.currentPageEl.textContent = this.TOTAL_PAGES.toString();
        } else {
            this.currentPageEl.textContent = this.currentPageIndex.toString();
        }
        
        this.updateControls();
    }
    
    nextPage() {
        if (this.currentPageIndex >= this.TOTAL_PAGES) return;
        
        this.playSound();
        
        if (this.currentPageIndex === 1) {
            const cover = document.getElementById('page-1');
            cover.classList.remove('visible-right');
            cover.classList.add('turning-right');
            this.currentPageIndex = 2;
            
            setTimeout(() => {
                this.updateBookDisplay();
            }, 400);
            
        } else if (this.currentPageIndex >= 2 && this.currentPageIndex < this.TOTAL_PAGES - 1) {
            const turningRightPage = document.getElementById(`page-${this.currentPageIndex + 1}`);
            turningRightPage.classList.remove('visible-right');
            turningRightPage.classList.add('turning-right');
            this.currentPageIndex += 2;
            
            setTimeout(() => {
                this.updateBookDisplay();
            }, 400);
            
        } else if (this.currentPageIndex === this.TOTAL_PAGES - 1) {
            const turningRightPage = document.getElementById(`page-${this.TOTAL_PAGES - 1}`);
            turningRightPage.classList.remove('visible-right');
            turningRightPage.classList.add('turning-right');
            this.currentPageIndex = this.TOTAL_PAGES;
            
            setTimeout(() => {
                this.updateBookDisplay();
            }, 400);
        }
    }
    
    prevPage() {
        if (this.currentPageIndex <= 1) return;
        
        this.playSound();
        
        if (this.currentPageIndex === this.TOTAL_PAGES) {
            const turningLeftPage = document.getElementById(`page-${this.TOTAL_PAGES}`);
            turningLeftPage.classList.remove('visible-left');
            turningLeftPage.classList.add('turning-left');
            this.currentPageIndex = this.TOTAL_PAGES - 1;
            
            setTimeout(() => {
                this.updateBookDisplay();
            }, 400);
            
        } else if (this.currentPageIndex > 2) {
            const turningLeftPage = document.getElementById(`page-${this.currentPageIndex}`);
            turningLeftPage.classList.remove('visible-left');
            turningLeftPage.classList.add('turning-left');
            this.currentPageIndex -= 2;
            
            setTimeout(() => {
                this.updateBookDisplay();
            }, 400);
            
        } else if (this.currentPageIndex === 2) {
            const turningLeftPage = document.getElementById('page-2');
            turningLeftPage.classList.remove('visible-left');
            turningLeftPage.classList.add('turning-left');
            this.currentPageIndex = 1;
            
            setTimeout(() => {
                this.updateBookDisplay();
            }, 400);
        }
    }
    
    updateControls() {
        this.prevBtn.disabled = this.currentPageIndex === 1;
        this.prevBtn.classList.toggle('disabled', this.prevBtn.disabled);
        this.nextBtn.disabled = this.currentPageIndex >= this.TOTAL_PAGES;
        this.nextBtn.classList.toggle('disabled', this.nextBtn.disabled);
    }
    
    playSound() {
        if (this.soundEnabled && this.sound) {
            this.sound.currentTime = 0;
            this.sound.play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
        showNotification(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
    }
    
    zoomIn() {
        if (this.zoomLevel < 2) {
            this.zoomLevel += 0.1;
            this.flipbook.style.transform = `scale(${this.zoomLevel})`;
            this.flipbook.style.transformOrigin = 'center';
        }
    }
    
    zoomOut() {
        if (this.zoomLevel > 0.5) {
            this.zoomLevel -= 0.1;
            this.flipbook.style.transform = `scale(${this.zoomLevel})`;
            this.flipbook.style.transformOrigin = 'center';
        }
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            this.flipbook.classList.add('fullscreen');
            this.isFullscreen = true;
            this.fullscreenBtn.textContent = '⛶ Exit Fullscreen';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.flipbook.classList.remove('fullscreen');
            this.isFullscreen = false;
            this.fullscreenBtn.textContent = '⛶ Fullscreen';
        }
    }
    
    printBook() {
        window.print();
    }
    
    // Load external book data
    async loadBook(bookId) {
        showLoading('Loading book...');
        try {
            // This would fetch from an API in a real app
            // const response = await fetch(`/api/books/${bookId}`);
            // this.bookData = await response.json();
            
            // For now, simulate loading
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update book data
            this.bookData = {
                id: bookId,
                title: `Book ${bookId}`,
                author: 'Various Authors',
                pages: Array.from({length: 20}, (_, i) => ({
                    id: i + 1,
                    type: i === 0 ? 'cover' : i === 19 ? 'backcover' : 'content',
                    content: `<h2>Page ${i + 1}</h2><p>Content for page ${i + 1}</p>`
                }))
            };
            
            // Update display
            this.bookTitle.textContent = this.bookData.title;
            this.generatePages();
            this.initializeBook();
            showNotification('Book loaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error loading book:', error);
            showNotification('Failed to load book', 'error');
        } finally {
            hideLoading();
        }
    }
}

// Initialize flipbook when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.flipbook = new Flipbook();
});
