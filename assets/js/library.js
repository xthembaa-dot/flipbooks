// Library JavaScript
class Library {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
        this.currentCategory = 'all';
        this.uploadedFiles = [];
        
        this.initialize();
    }
    
    async initialize() {
        // Load sample books
        await this.loadBooks();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render books
        this.renderBooks();
    }
    
    async loadBooks() {
        // In a real app, you'd fetch this from an API
        this.books = [
            {
                id: 'book1',
                title: 'The Little Red Hen',
                author: 'Traditional',
                category: 'kids',
                pages: 20,
                cover: '📕',
                color: '#ff9999'
            },
            {
                id: 'book2',
                title: 'Counting Animals',
                author: 'Math Fun',
                category: 'educational',
                pages: 16,
                cover: '🐘',
                color: '#99ff99'
            },
            {
                id: 'book3',
                title: 'Space Adventure',
                author: 'Cosmic Kids',
                category: 'story',
                pages: 24,
                cover: '🚀',
                color: '#9999ff'
            },
            {
                id: 'book4',
                title: 'ABC Learning',
                author: 'Alphabet Fun',
                category: 'educational',
                pages: 28,
                cover: '🔤',
                color: '#ffff99'
            },
            {
                id: 'book5',
                title: 'Bedtime Stories',
                author: 'Dreamy Tales',
                category: 'kids',
                pages: 18,
                cover: '🌙',
                color: '#ff99ff'
            },
            {
                id: 'book6',
                title: 'Animal Friends',
                author: 'Nature World',
                category: 'kids',
                pages: 22,
                cover: '🐻',
                color: '#99ffff'
            }
        ];
        
        this.filteredBooks = [...this.books];
    }
    
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        searchInput.addEventListener('input', debounce(() => {
            this.searchBooks(searchInput.value);
        }, 300));
        
        searchBtn.addEventListener('click', () => {
            this.searchBooks(searchInput.value);
        });
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.filterBooks();
            });
        });
        
        // File upload
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');
        
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files);
        });
        
        // Create book button
        const createBtn = document.querySelector('.create-book-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.createBookFromUploads());
        }
    }
    
    renderBooks() {
        const booksGrid = document.getElementById('books-grid');
        if (!booksGrid) return;
        
        booksGrid.innerHTML = '';
        
        this.filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <div class="book-cover" style="background-color: ${book.color}">
                    ${book.cover}
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p>By ${book.author}</p>
                    <p>${book.pages} pages</p>
                    <span class="book-category">${book.category}</span>
                </div>
            `;
            
            bookCard.addEventListener('click', () => {
                this.openBook(book.id);
            });
            
            booksGrid.appendChild(bookCard);
        });
    }
    
    searchBooks(query) {
        if (!query.trim()) {
            this.filteredBooks = [...this.books];
            this.filterBooks();
            return;
        }
        
        const searchTerm = query.toLowerCase();
        this.filteredBooks = this.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm)
        );
        
        this.filterBooks();
    }
    
    filterBooks() {
        if (this.currentCategory === 'all') {
            this.filteredBooks = [...this.books];
        } else {
            this.filteredBooks = this.books.filter(book => 
                book.category === this.currentCategory
            );
        }
        
        this.renderBooks();
    }
    
    openBook(bookId) {
        showLoading('Opening book...');
        
        // In a real app, you might redirect to the book
        // window.location.href = `index.html?book=${bookId}`;
        
        // For now, simulate loading
        setTimeout(() => {
            showNotification(`Opening "${this.books.find(b => b.id === bookId)?.title}"`, 'success');
            hideLoading();
            
            // Redirect to main page with book parameter
            window.location.href = `index.html?book=${bookId}`;
        }, 1000);
    }
    
    handleFileUpload(files) {
        if (!files || files.length === 0) return;
        
        const uploadArea = document.getElementById('upload-area');
        const fileList = document.createElement('div');
        fileList.className = 'file-list';
        
        Array.from(files).forEach(file => {
            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                showNotification(`Invalid file type: ${file.name}`, 'error');
                return;
            }
            
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showNotification(`File too large: ${file.name}`, 'error');
                return;
            }
            
            this.uploadedFiles.push(file);
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file.name} (${formatFileSize(file.size)})</span>
                <button class="remove-file" data-name="${file.name}">&times;</button>
            `;
            
            fileList.appendChild(fileItem);
        });
        
        // Remove existing file list
        const existingList = uploadArea.querySelector('.file-list');
        if (existingList) {
            existingList.remove();
        }
        
        uploadArea.appendChild(fileList);
        
        // Add remove file functionality
        fileList.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileName = e.target.dataset.name;
                this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== fileName);
                e.target.closest('.file-item').remove();
                
                if (this.uploadedFiles.length === 0) {
                    fileList.remove();
                }
            });
        });
        
        // Enable create book button
        const createBtn = document.querySelector('.create-book-btn');
        if (createBtn) {
            createBtn.disabled = this.uploadedFiles.length === 0;
        }
        
        showNotification(`${files.length} file(s) uploaded successfully`, 'success');
    }
    
    async createBookFromUploads() {
        if (this.uploadedFiles.length === 0) {
            showNotification('No files uploaded', 'error');
            return;
        }
        
        showLoading('Creating your book...');
        
        try {
            // In a real app, you would upload files to a server
            // For now, simulate the process
            
            // Create book data from uploaded files
            const bookData = {
                id: `uploaded_${Date.now()}`,
                title: 'My Uploaded Book',
                author: 'You',
                pages: this.uploadedFiles.map((file, index) => ({
                    id: index + 1,
                    type: index === 0 ? 'cover' : 
                          index === this.uploadedFiles.length - 1 ? 'backcover' : 'content',
                    file: file,
                    filename: file.name
                }))
            };
            
            // Save to localStorage (in a real app, you'd save to a database)
            saveToStorage(`book_${bookData.id}`, bookData);
            
            // Show success message
            showNotification('Book created successfully!', 'success');
            
            // Redirect to the new book
            setTimeout(() => {
                window.location.href = `index.html?book=${bookData.id}`;
            }, 1500);
            
        } catch (error) {
            console.error('Error creating book:', error);
            showNotification('Error creating book', 'error');
        } finally {
            hideLoading();
        }
    }
}

// Initialize library when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.library = new Library();
});
