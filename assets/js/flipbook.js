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
        // References the buttons defined in your main HTML
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
            // Pages 1, 3, 5, etc. are right pages (front page of a spread)
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
        
        // ** FIX 1: REMOVED DUPLICATE CONTROL BUTTON CREATION **
        // The buttons are already defined in the main HTML file.
        // Removing the following block ensures the event listeners attach to the correct buttons.
        /*
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `
            <button id="prev-btn" class="nav-button">◀️</button>
            <button id="next-btn" class="nav-button">▶️</button>
        `;
        this.flipbook.appendChild(controls);
        */
        
        // Update references (These lines now correctly refer to the buttons in the main HTML)
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.pages = document.querySelectorAll('.page');
    }
    
    initializeBook() {
        console.log("Initializing book display...");
        // Hide all pages initially
        this.pages.forEach(p => p.style.display = 'none');
        
        // Display the cover page (Page 1)
        const cover = document.getElementById('page-1');
        cover.classList.add('visible-right'); // Assuming cover starts on the right side
        cover.style.display = 'block';
        
        // Update total pages counter in the book-info section
        const totalPagesEl = document.getElementById('total-pages');
        if (totalPagesEl) totalPagesEl.textContent = this.bookData.pages.length;

        this.updateBookDisplay(); // Calls updateControls
    }
    
    setupEventListeners() {
        console.log("Setting up event listeners...");
        // These listeners now correctly bind to the buttons referenced in initialize()
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
    }
    
    nextPage() {
        // If we are showing the last page (page 20), stop
        if (this.currentPageIndex >= this.bookData.pages.length) return; 
        
        // If current page is 1, next page is 2. If current page is 3, next page is 4.
        const currentRightPage = this.currentPageIndex;
        let nextRightPage = currentRightPage + 2;

        if (currentRightPage === 1) {
            // Special case: Page 1 (cover) flips to show Page 2 (left) and Page 3 (right)
            nextRightPage = 3;
        }

        this.turnPage(currentRightPage, 'forward');
        this.currentPageIndex = nextRightPage;
        
        this.updateBookDisplay();
    }
    
    prevPage() {
        if (this.currentPageIndex <= 1) return;
        
        // We always jump to the start of a spread. 
        // If current is 3, previous spread is 1. If current is 5, previous spread is 3.
        const currentRightPage = this.currentPageIndex;
        let prevRightPage = currentRightPage - 2;

        if (prevRightPage < 1) {
            // Special case: Going back to the cover (Page 1)
            prevRightPage = 1;
        }

        this.turnPage(prevRightPage, 'backward');
        this.currentPageIndex = prevRightPage;
        
        this.updateBookDisplay();
    }
    
    // ** FIX 2: IMPLEMENTED MISSING PAGE FLIP LOGIC **
    turnPage(startPageIndex, direction) {
        // Determine the two pages involved in the flip
        const pageA = document.getElementById(`page-${startPageIndex}`);
        const pageB = document.getElementById(`page-${startPageIndex + 1}`);

        // Get the two pages currently visible (the current spread)
        const currentRightPage = document.querySelector('.visible-right');
        const currentLeftPage = document.querySelector('.visible-left');

        if (direction === 'forward') {
            // Turning to the next spread (Page 1 -> Page 3)
            if (pageA) {
                // Apply the turning class to the currently visible right page (or cover)
                pageA.classList.remove('visible-right');
                pageA.classList.add('turning-right');
                
                // Hide the page after the transition is complete
                setTimeout(() => {
                    pageA.classList.remove('turning-right');
                    pageA.classList.add('turned-page');
                    pageA.style.display = 'none';
                }, 800); 
            }
            
            // Show the next spread's pages (startPageIndex + 1 and startPageIndex + 2)
            const nextLeft = document.getElementById(`page-${startPageIndex + 1}`);
            const nextRight = document.getElementById(`page-${startPageIndex + 2}`);

            if (nextLeft) {
                 // Set the next left page to be visible immediately
                 nextLeft.classList.add('visible-left');
                 nextLeft.style.display = 'block';
            }
            if (nextRight) {
                 // Set the next right page to be visible immediately
                 nextRight.classList.add('visible-right');
                 nextRight.style.display = 'block';
            }

        } else if (direction === 'backward') {
            // Turning back to the previous spread (Page 3 -> Page 1)

            // The previous right page (pageA) needs to "unflip"
            if (pageA) {
                pageA.classList.remove('turned-page');
                pageA.classList.add('turning-left'); // CSS for turning back
                pageA.style.display = 'block'; // Make it visible for the animation

                // After the transition, make it a normal visible page
                setTimeout(() => {
                    pageA.classList.remove('turning-left');
                    pageA.classList.add('visible-right');
                }, 800);
            }

            // Hide the current spread's pages
            if (currentRightPage) {
                currentRightPage.classList.remove('visible-right');
                currentRightPage.style.display = 'none';
            }
            if (currentLeftPage) {
                currentLeftPage.classList.remove('visible-left');
                currentLeftPage.style.display = 'none';
            }
        }
    }

    updateBookDisplay() {
        console.log("Updating to page spread starting at:", this.currentPageIndex);
        
        // Update the page counter in the HTML
        const currentEl = document.getElementById('current-page');
        if (currentEl) currentEl.textContent = this.currentPageIndex;
        
        this.updateControls();
    }
    
    updateControls() {
        // Disable prev button on the cover page (index 1)
        this.prevBtn.disabled = this.currentPageIndex === 1; 
        
        // Disable next button on the last page (index 19 flips to 20, but the spread starts at 19, so check against total)
        this.nextBtn.disabled = this.currentPageIndex >= this.bookData.pages.length - 1;
        
        // Optional: Add visual disabled class for styling
        this.prevBtn.classList.toggle('disabled', this.prevBtn.disabled);
        this.nextBtn.classList.toggle('disabled', this.nextBtn.disabled);
    }
}

// Start when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, starting flipbook...");
    window.flipbook = new Flipbook();
});
