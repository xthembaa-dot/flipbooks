// Client Book Configurations
// This file defines different books for different clients

const CLIENT_BOOKS = {
    client1: {
        id: 'client1',
        title: 'Client 1 Flipbook',
        author: 'Client 1',
        totalPages: 20,
        coverImage: 'assets/clients/client1/01.jpg',
        pages: []
    },
    client2: {
        id: 'client2', 
        title: 'Client 2 Flipbook',
        author: 'Client 2',
        totalPages: 20,
        coverImage: 'assets/clients/client2/01.jpg',
        pages: []
    }
};

client1: {
    id: 'client1',
    title: 'Client 1 Flipbook',
    author: 'Client 1',
    totalPages: 20,
    coverImage: `/flipbooks/assets/clients/client1/01.jpg`,  // Add /flipbooks/ here
    pages: []
},
client2: {
    id: 'client2', 
    title: 'Client 2 Flipbook',
    author: 'Client 2',
    totalPages: 20,
    coverImage: `/flipbooks/assets/clients/client2/01.jpg`,  // Add /flipbooks/ here
    pages: []
}

// Function to get book by client ID
function getClientBook(clientId) {
    return CLIENT_BOOKS[clientId] || CLIENT_BOOKS.client1;
}

// Make available globally
window.CLIENT_BOOKS = CLIENT_BOOKS;
window.getClientBook = getClientBook;
