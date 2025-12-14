// Contact form JavaScript
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.initialize();
    }
    
    initialize() {
        if (this.form) {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Add character counter for message
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.addEventListener('input', (e) => {
                const charCount = e.target.value.length;
                this.updateCharacterCount(charCount);
            });
        }
    }
    
    updateCharacterCount(count) {
        let counter = document.getElementById('char-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'char-counter';
            counter.style.cssText = `
                font-size: 0.9rem;
                color: #666;
                text-align: right;
                margin-top: 0.5rem;
            `;
            document.getElementById('message').parentNode.appendChild(counter);
        }
        counter.textContent = `${count}/5000 characters`;
    }
    
    async handleSubmit() {
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }
        
        showLoading('Sending message...');
        
        try {
            // In a real app, you would send this to a server
            // For now, simulate sending
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Save to localStorage (in a real app, this would go to a database)
            const existingMessages = loadFromStorage('contact_messages') || [];
            existingMessages.push(formData);
            saveToStorage('contact_messages', existingMessages);
            
            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            this.form.reset();
            
            // Clear character counter
            const counter = document.getElementById('char-counter');
            if (counter) counter.remove();
            
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }
    
    validateForm(data) {
        // Check required fields
        if (!data.name.trim()) {
            showNotification('Please enter your name', 'error');
            document.getElementById('name').focus();
            return false;
        }
        
        if (!data.email.trim()) {
            showNotification('Please enter your email', 'error');
            document.getElementById('email').focus();
            return false;
        }
        
        if (!validateEmail(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            document.getElementById('email').focus();
            return false;
        }
        
        if (!data.message.trim()) {
            showNotification('Please enter your message', 'error');
            document.getElementById('message').focus();
            return false;
        }
        
        if (data.message.length > 5000) {
            showNotification('Message is too long (max 5000 characters)', 'error');
            document.getElementById('message').focus();
            return false;
        }
        
        return true;
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
});
