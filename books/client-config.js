// Client Book Configurations
const CLIENT_BOOKS = {
    client1: {
        id: 'client1',
        title: 'Client 1 Flipbook',
        author: 'Client 1',
        totalPages: 20,
        coverImage: 'assets/clients/client1/01.jpg',  // Updated path
        pages: []
    },
    client2: {
        id: 'client2', 
        title: 'Client 2 Flipbook',
        author: 'Client 2',
        totalPages: 20,
        coverImage: 'assets/clients/client2/01.jpg',  // Updated path
        pages: []
    }
};

// Generate pages for each client
for (let i = 1; i <= 20; i++) {
    const pageNum = i.toString().padStart(2, '0');
    
    CLIENT_BOOKS.client1.pages.push({
        id: i,
        type: i === 1 ? 'cover' : i === 20 ? 'backcover' : 'content',
        imageUrl: `assets/clients/client1/${pageNum}.jpg`,  // Updated path
        text: i === 1 ? 'Cover Page' : i === 20 ? 'The End!' : `Page ${i}`
    });
    
    CLIENT_BOOKS.client2.pages.push({
        id: i,
        type: i === 1 ? 'cover' : i === 20 ? 'backcover' : 'content',
        imageUrl: `assets/clients/client2/${pageNum}.jpg`,  // Updated path
        text: i === 1 ? 'Cover Page' : i === 20 ? 'The End!' : `Page ${i}`
    });
}

function getClientBook(clientId) {
    return CLIENT_BOOKS[clientId] || CLIENT_BOOKS.client1;
}

window.CLIENT_BOOKS = CLIENT_BOOKS;
window.getClientBook = getClientBook;
