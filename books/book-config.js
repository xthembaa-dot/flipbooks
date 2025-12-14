// Book Configuration
// This file contains sample book data and configuration

const SAMPLE_BOOKS = {
    sample: {
        id: 'sample',
        title: 'My First Flipbook',
        author: 'Your Name',
        description: 'A sample flipbook to get started',
        coverColor: '#ff99aa',
        pages: [
            {
                id: 1,
                type: 'cover',
                content: `
                    <div style="text-align: center; padding: 20px;">
                        <h1 style="color: #333; font-size: 2.5em;">My First Flipbook</h1>
                        <div style="font-size: 4em; margin: 20px 0;">📚</div>
                        <p style="font-size: 1.2em;">By Your Name</p>
                        <p style="margin-top: 20px;">A fun interactive story</p>
                    </div>
                `
            },
            {
                id: 2,
                type: 'content',
                content: `
                    <h2>Welcome!</h2>
                    <p>This is your first flipbook page.</p>
                    <p>You can add your own content here.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <div style="font-size: 3em;">🎨</div>
                    </div>
                `
            },
            // Add more pages as needed...
        ]
    }
};

// Function to load book configuration
function getBookConfig(bookId) {
    return SAMPLE_BOOKS[bookId] || SAMPLE_BOOKS.sample;
}

// Function to create a book from images
async function createBookFromImages(images) {
    return {
        id: `custom_${Date.now()}`,
        title: 'My Custom Book',
        author: 'Uploaded by You',
        pages: images.map((image, index) => ({
            id: index + 1,
            type: index === 0 ? 'cover' : 
                  index === images.length - 1 ? 'backcover' : 'content',
            imageUrl: URL.createObjectURL(image),
            filename: image.name
        }))
    };
}

// Function to create a book from PDF
async function createBookFromPDF(pdfFile) {
    // In a real app, you would use a PDF library to extract pages
    // For now, return a sample structure
    return {
        id: `pdf_${Date.now()}`,
        title: pdfFile.name.replace('.pdf', ''),
        author: 'PDF Upload',
        pages: Array.from({length: 10}, (_, i) => ({
            id: i + 1,
            type: i === 0 ? 'cover' : i === 9 ? 'backcover' : 'content',
            content: `<h2>PDF Page ${i + 1}</h2><p>Content from PDF</p>`
        }))
    };
}
