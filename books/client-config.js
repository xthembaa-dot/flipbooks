// Client Book Configurations
// This file defines different books for different clients

const CLIENT_BOOKS = {
    client1: {
        id: 'client1',
        title: 'Client 1 Flipbook',
        author: 'Client 1',
        totalPages: 20,
        coverImage: 'assets/images/clients/client1/01.jpg',  // CORRECT PATH
        pages: []
    },
    client2: {
        id: 'client2', 
        title: 'Client 2 Flipbook',
        author: 'Client 2',
        totalPages: 20,
        coverImage: 'assets/images/clients/client2/01.jpg',  // CORRECT PATH
        pages: []
    }
};

// Generate pages for each client
for (let i = 1; i <= 20; i++) {
    // Format: 01, 02, 03, etc.
    const pageNum = i.toString().padStart(2, '0');
    
    // Client 1 pages
    CLIENT_BOOKS.client1.pages.push({
        id: i,
        type: i === 1 ? 'cover' : i === 20 ? 'backcover' : 'content',
        imageUrl: `assets/images/clients/client1/${pageNum}.jpg`,  // CORRECT PATH
        text: i === 1 ? 'Cover Page' : i === 20 ? 'The End!' : `Page ${i}`
    });
    
    // Client 2 pages
    CLIENT_BOOKS.client2.pages.push({
        id: i,
        type: i === 1 ? 'cover' : i === 20 ? 'backcover' : 'content',
        imageUrl: `assets/images/clients/client2/${pageNum}.jpg`,  // CORRECT PATH
        text: i === 1 ? 'Cover Page' : i === 20 ? 'The End!' : `Page ${i}`
    });
}

// Function to get book by client ID
function getClientBook(clientId) {
    return CLIENT_BOOKS[clientId] || CLIENT_BOOKS.client1;
}

// Make available globally
window.CLIENT_BOOKS = CLIENT_BOOKS;
window.getClientBook = getClientBook;
