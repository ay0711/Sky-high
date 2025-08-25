// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Global variables
let currentModal = null;
let shippingQuote = null;

// Mobile menu toggle function
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
}

// Request pickup function
function requestPickup() {
    // Scroll to the pickup section and highlight it
    const pickupSection = document.getElementById('request');
    if (pickupSection) {
        pickupSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary highlight effect
        pickupSection.style.background = 'rgba(255, 114, 0, 0.1)';
        setTimeout(() => {
            pickupSection.style.background = '';
        }, 2000);
    }
}

// Consolidated DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
    // Load testimonials
    loadTestimonials();
    
    // Initialize tracking form
    initializeTrackingForm();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize pickup form
    initializePickupForm();
    
    // Initialize shipping form
    initializeShippingForm();
});

// Load testimonials from API
async function loadTestimonials() {
    try {
    const response = await fetch('https://sky-high-zcxt.onrender.com/api/testimonials');
        const data = await response.json();
        
        if (data.success && data.testimonials) {
            displayTestimonials(data.testimonials);
        } else {
            displayTestimonialsError();
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        displayTestimonialsError();
    }
}

// Display testimonials in the grid
function displayTestimonials(testimonials) {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    
    if (!testimonialsGrid) return;
    
    const testimonialsHTML = testimonials.map(testimonial => `
        <div class="testimonial-card" data-aos="zoom-in" data-aos-delay="${Math.random() * 200}">
            <div class="testimonial-header">
                <div class="customer-info">
                    <h4 class="customer-name">${testimonial.name}</h4>
                    <p class="customer-company">${testimonial.company}</p>
                    <p class="customer-location">📍 ${testimonial.location}</p>
                </div>
                <div class="testimonial-rating">
                    ${'⭐'.repeat(testimonial.rating)}
                </div>
            </div>
            <div class="testimonial-content">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-meta">
                    <span class="service-used">Service: ${testimonial.service}</span>
                    <span class="testimonial-date">${formatDate(testimonial.date)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    testimonialsGrid.innerHTML = testimonialsHTML;
    
    // Re-initialize AOS for new elements
    AOS.refresh();
}

// Display error state for testimonials
function displayTestimonialsError() {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    
    if (!testimonialsGrid) return;
    
    testimonialsGrid.innerHTML = `
        <div class="testimonials-error">
            <div class="error-icon">😊</div>
            <h3>Our Customers Love Us!</h3>
            <p>We're currently updating our testimonials. Check back soon!</p>
            <div class="fallback-testimonials">
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="customer-info">
                            <h4 class="customer-name">John D.</h4>
                            <p class="customer-company">Business Owner</p>
                            <p class="customer-location">📍 Lagos</p>
                        </div>
                        <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div class="testimonial-content">
                        <p class="testimonial-text">"Outstanding service! Sky High Logistics has never let me down."</p>
                    </div>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="customer-info">
                            <h4 class="customer-name">Mary O.</h4>
                            <p class="customer-company">Online Store</p>
                            <p class="customer-location">📍 Abuja</p>
                        </div>
                        <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div class="testimonial-content">
                        <p class="testimonial-text">"Fast, reliable, and professional. Highly recommended!"</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Enhanced Tracking form functionality with detailed display
// Initialize tracking form functionality
function initializeTrackingForm() {
    const trackingForm = document.getElementById('tracking-form');
    const trackingResult = document.getElementById('tracking-result');
    
    if (trackingForm) {
        trackingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const trackingId = document.getElementById('trackingId').value.trim();
            
            if (!trackingId) {
                displayTrackingResult({
                    success: false,
                    message: 'Please enter a tracking ID'
                });
                return;
            }
            
            // Show loading state
            displayTrackingResult({
                success: true,
                message: 'Searching for your package...',
                loading: true
            });
            
            try {
                console.log('Sending tracking request for:', trackingId);
                const response = await fetch('https://sky-high-zcxt.onrender.com/api/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ trackingId: trackingId }),
                });
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('API Response:', result);
                displayTrackingResult(result);
                
            } catch (error) {
                console.error('Error tracking package:', error);
                displayTrackingResult({
                    success: false,
                    message: 'Error connecting to tracking service. Please try again later.'
                });
            }
        });
    }
}

function displayTrackingResult(result) {
    const trackingResult = document.getElementById('tracking-result');
    
    if (!trackingResult) return;
    
    if (result.loading) {
        trackingResult.innerHTML = `
            <div class="tracking-info loading">
                <div class="loading-spinner"></div>
                <p>${result.message}</p>
            </div>
        `;
        trackingResult.style.display = 'block';
        return;
    }
    
    if (result.success && result.tracking) {
        const tracking = result.tracking;
        
        // Status indicator with color coding
        let statusClass = 'status-default';
        if (tracking.status.toLowerCase().includes('delivered')) statusClass = 'status-delivered';
        else if (tracking.status.toLowerCase().includes('transit')) statusClass = 'status-transit';
        else if (tracking.status.toLowerCase().includes('out for delivery')) statusClass = 'status-out-for-delivery';
        else if (tracking.status.toLowerCase().includes('picked up')) statusClass = 'status-picked-up';
        
        let timelineHtml = '';
        if (tracking.timeline && tracking.timeline.length > 0) {
            timelineHtml = '<div class="timeline">';
            tracking.timeline.forEach((event, index) => {
                const isLatest = index === tracking.timeline.length - 1;
                timelineHtml += `
                    <div class="timeline-item ${isLatest ? 'current' : ''}">
                        <div class="timeline-marker ${isLatest ? 'current-marker' : ''}"></div>
                        <div class="timeline-content">
                            <div class="timeline-date">${event.date}</div>
                            <div class="timeline-location">${event.location}</div>
                            <div class="timeline-description">${event.description}</div>
                        </div>
                    </div>
                `;
            });
            timelineHtml += '</div>';
        }
        
        trackingResult.innerHTML = `
            <div class="tracking-info success">
                <div class="tracking-header">
                    <div class="package-status ${statusClass}">
                        <div class="status-indicator"></div>
                        <h3>${tracking.status}</h3>
                    </div>
                    <div class="tracking-id">Tracking ID: ${tracking.id}</div>
                </div>
                
                <div class="tracking-summary">
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Current Location</div>
                            <div class="summary-value">${tracking.location}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Estimated Delivery</div>
                            <div class="summary-value">${formatDate(tracking.estimatedDelivery)}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Last Updated</div>
                            <div class="summary-value">${tracking.lastUpdated}</div>
                        </div>
                    </div>
                </div>
                
                <div class="timeline-section">
                    <h4>Package Journey</h4>
                    ${timelineHtml}
                </div>
            </div>
        `;
    } else {
        trackingResult.innerHTML = `
            <div class="tracking-info error">
                <div class="error-icon">📦</div>
                <h3>Package Not Found</h3>
                <p>${result.message}</p>
                <div class="tracking-tips">
                    <h4>Tracking Tips:</h4>
                    <ul>
                        <li>Check that the tracking ID is correct</li>
                        <li>Sky High tracking IDs start with "SKH"</li>
                        <li>Allow 24 hours for new shipments to appear</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    trackingResult.style.display = 'block';
    trackingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // Validate form
            if (!contactData.name || !contactData.email || !contactData.message) {
                showContactMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactData.email)) {
                showContactMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            showContactMessage('Sending your message...', 'loading');
            
            try {
                const response = await fetch('https://sky-high-zcxt.onrender.com/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contactData),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showContactMessage(result.message, 'success');
                    contactForm.reset();
                } else {
                    showContactMessage(result.message, 'error');
                }
                
            } catch (error) {
                console.error('Error sending message:', error);
                showContactMessage('Failed to send message. Please try again later.', 'error');
            }
        });
    }
});

function showContactMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `contact-message ${type}`;
    messageElement.textContent = message;
    
    // Insert after the contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
        
        // Auto-hide success/error messages after 5 seconds
        if (type !== 'loading') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
}

// Enhanced Pickup request modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const requestPickupBtn = document.getElementById('request-pickup-btn');
    const pickupModal = document.getElementById('pickup-modal');
    const closeModal = document.querySelector('.close-modal');
    const pickupForm = document.getElementById('pickup-form');
    
    // Open modal
    if (requestPickupBtn && pickupModal) {
        requestPickupBtn.addEventListener('click', function() {
            pickupModal.style.display = 'block';
            currentModal = pickupModal;
        });
    }
    
    // Close modal
    if (closeModal && pickupModal) {
        closeModal.addEventListener('click', function() {
            closeCurrentModal();
        });
    }
    
    // Close modal when clicking outside
    if (pickupModal) {
        pickupModal.addEventListener('click', function(e) {
            if (e.target === pickupModal) {
                closeCurrentModal();
            }
        });
    }
    
    // Handle pickup form submission
    if (pickupForm) {
        pickupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(pickupForm);
            const pickupData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                pickupAddress: formData.get('pickup-address'),
                deliveryAddress: formData.get('delivery-address'),
                packageType: formData.get('package-type'),
                packageDescription: formData.get('package-description'),
                weight: formData.get('weight'),
                preferredDate: formData.get('preferred-date'),
                serviceType: formData.get('service-type'),
                specialInstructions: formData.get('special-instructions')
            };
            
            // Validate required fields
            const requiredFields = ['name', 'phone', 'pickupAddress', 'deliveryAddress', 'packageType', 'preferredDate'];
            const missingFields = requiredFields.filter(field => !pickupData[field]);
            
            if (missingFields.length > 0) {
                showPickupMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            showPickupMessage('Submitting your pickup request...', 'loading');
            
            try {
                const response = await fetch('https://sky-high-zcxt.onrender.com/api/pickup-request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pickupData),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showPickupMessage(
                        `<div class="success-details">
                            <h4>Pickup Request Submitted Successfully!</h4>
                            <div class="reference-info">
                                <strong>Reference ID:</strong> ${result.referenceId}<br>
                                <strong>Estimated Cost:</strong> ₦${result.estimatedCost}<br>
                                <strong>Estimated Delivery:</strong> ${formatDate(result.estimatedDelivery)}
                            </div>
                            <p>We'll contact you within 24 hours to confirm the pickup.</p>
                        </div>`, 
                        'success'
                    );
                    pickupForm.reset();
                    
                    // Close modal after a delay
                    setTimeout(() => {
                        closeCurrentModal();
                    }, 8000);
                } else {
                    showPickupMessage(result.message, 'error');
                }
                
            } catch (error) {
                console.error('Error submitting pickup request:', error);
                showPickupMessage('Failed to submit pickup request. Please try again later.', 'error');
            }
        });
    }
});

// Create shipment functionality (for the main send package form)
document.addEventListener('DOMContentLoaded', function() {
    // Add create shipment button to hero section
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions && !document.getElementById('create-shipment-btn')) {
        const createShipmentBtn = document.createElement('button');
        createShipmentBtn.id = 'create-shipment-btn';
        createShipmentBtn.className = 'btn btn-secondary';
        createShipmentBtn.innerHTML = '📦 Send Package';
        heroActions.appendChild(createShipmentBtn);
        
        // Create shipment modal
        createShipmentModal();
        
        // Add event listener
        createShipmentBtn.addEventListener('click', function() {
            const shipmentModal = document.getElementById('shipment-modal');
            if (shipmentModal) {
                shipmentModal.style.display = 'block';
                currentModal = shipmentModal;
            }
        });
    }
});

function createShipmentModal() {
    if (document.getElementById('shipment-modal')) return; // Already exists
    
    const modalHTML = `
        <div id="shipment-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>📦 Create New Shipment</h2>
                
                <form id="shipment-form">
                    <!-- Sender Information -->
                    <fieldset>
                        <legend>Sender Information</legend>
                        <div class="form-group">
                            <label for="sender-name">Full Name *</label>
                            <input type="text" id="sender-name" name="sender-name" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="sender-email">Email *</label>
                                <input type="email" id="sender-email" name="sender-email" required>
                            </div>
                            <div class="form-group">
                                <label for="sender-phone">Phone *</label>
                                <input type="tel" id="sender-phone" name="sender-phone" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="sender-address">Full Address *</label>
                            <textarea id="sender-address" name="sender-address" rows="3" required></textarea>
                        </div>
                    </fieldset>
                    
                    <!-- Receiver Information -->
                    <fieldset>
                        <legend>Receiver Information</legend>
                        <div class="form-group">
                            <label for="receiver-name">Full Name *</label>
                            <input type="text" id="receiver-name" name="receiver-name" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="receiver-email">Email</label>
                                <input type="email" id="receiver-email" name="receiver-email">
                            </div>
                            <div class="form-group">
                                <label for="receiver-phone">Phone *</label>
                                <input type="tel" id="receiver-phone" name="receiver-phone" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="receiver-address">Full Address *</label>
                            <textarea id="receiver-address" name="receiver-address" rows="3" required></textarea>
                        </div>
                    </fieldset>
                    
                    <!-- Package Information -->
                    <fieldset>
                        <legend>Package Information</legend>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="package-type">Package Type *</label>
                                <select id="package-type" name="package-type" required>
                                    <option value="">Select Type</option>
                                    <option value="document">Documents</option>
                                    <option value="small-package">Small Package</option>
                                    <option value="medium-package">Medium Package</option>
                                    <option value="large-package">Large Package</option>
                                    <option value="fragile">Fragile Items</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="food">Food Items</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="package-weight">Weight (kg)</label>
                                <input type="number" id="package-weight" name="package-weight" min="0.1" step="0.1">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="package-description">Package Description *</label>
                            <textarea id="package-description" name="package-description" rows="2" 
                                placeholder="Brief description of package contents" required></textarea>
                        </div>
                    </fieldset>
                    
                    <!-- Shipping Options -->
                    <fieldset>
                        <legend>Shipping Options</legend>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pickup-location">Pickup Location *</label>
                                <input type="text" id="pickup-location" name="pickup-location" 
                                    placeholder="City or state" required>
                            </div>
                            <div class="form-group">
                                <label for="delivery-location">Delivery Location *</label>
                                <input type="text" id="delivery-location" name="delivery-location" 
                                    placeholder="City or state" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="service-type">Service Type *</label>
                            <select id="service-type" name="service-type" required>
                                <option value="">Select Service</option>
                                <option value="standard">Standard (3-5 days)</option>
                                <option value="express">Express (1-2 days)</option>
                                <option value="next-day">Next Day</option>
                                <option value="same-day">Same Day</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="special-instructions">Special Instructions</label>
                            <textarea id="special-instructions" name="special-instructions" rows="2" 
                                placeholder="Any special handling instructions"></textarea>
                        </div>
                    </fieldset>
                    
                    <div class="quote-section">
                        <button type="button" id="get-quote-btn" class="btn btn-secondary">
                            💰 Get Shipping Quote
                        </button>
                        <div id="quote-display"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" id="create-shipment-submit" class="btn btn-primary" disabled>
                            📦 Create Shipment
                        </button>
                        <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners for the new modal
    setupShipmentModal();
}

function setupShipmentModal() {
    const shipmentModal = document.getElementById('shipment-modal');
    const shipmentForm = document.getElementById('shipment-form');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const createShipmentSubmit = document.getElementById('create-shipment-submit');
    
    // Close modal functionality
    shipmentModal.addEventListener('click', function(e) {
        if (e.target === shipmentModal || e.target.classList.contains('close-modal')) {
            closeCurrentModal();
        }
    });
    
    // Get quote functionality
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', async function() {
            const formData = new FormData(shipmentForm);
            const quoteData = {
                packageType: formData.get('package-type'),
                weight: formData.get('package-weight'),
                pickupLocation: formData.get('pickup-location'),
                deliveryLocation: formData.get('delivery-location'),
                serviceType: formData.get('service-type')
            };
            
            // Validate required fields for quote
            if (!quoteData.packageType || !quoteData.pickupLocation || 
                !quoteData.deliveryLocation || !quoteData.serviceType) {
                showShipmentMessage('Please fill in package type, locations, and service type to get a quote.', 'error');
                return;
            }
            
            showShipmentMessage('Calculating shipping cost...', 'loading');
            
            try {
                const response = await fetch('https://sky-high-zcxt.onrender.com/api/shipping-quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(quoteData),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    shippingQuote = result.quote;
                    displayQuote(result.quote);
                    createShipmentSubmit.disabled = false;
                } else {
                    showShipmentMessage(result.message, 'error');
                }
                
            } catch (error) {
                console.error('Error getting quote:', error);
                showShipmentMessage('Failed to get shipping quote. Please try again.', 'error');
            }
        });
    }
    
    // Submit shipment form
    if (shipmentForm) {
        shipmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!shippingQuote) {
                showShipmentMessage('Please get a shipping quote first.', 'error');
                return;
            }
            
            const formData = new FormData(shipmentForm);
            const shipmentData = {
                senderName: formData.get('sender-name'),
                senderEmail: formData.get('sender-email'),
                senderPhone: formData.get('sender-phone'),
                senderAddress: formData.get('sender-address'),
                receiverName: formData.get('receiver-name'),
                receiverEmail: formData.get('receiver-email'),
                receiverPhone: formData.get('receiver-phone'),
                receiverAddress: formData.get('receiver-address'),
                packageType: formData.get('package-type'),
                packageDescription: formData.get('package-description'),
                weight: formData.get('package-weight'),
                serviceType: formData.get('service-type'),
                pickupLocation: formData.get('pickup-location'),
                deliveryLocation: formData.get('delivery-location'),
                specialInstructions: formData.get('special-instructions')
            };
            
            showShipmentMessage('Creating your shipment...', 'loading');
            
            try {
                const response = await fetch('https://sky-high-zcxt.onrender.com/api/create-shipment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(shipmentData),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showShipmentMessage(
                        `<div class="shipment-success">
                            <h4>🎉 Shipment Created Successfully!</h4>
                            <div class="shipment-details">
                                <div class="detail-row">
                                    <strong>Tracking ID:</strong> 
                                    <span class="tracking-id-display">${result.trackingId}</span>
                                </div>
                                <div class="detail-row">
                                    <strong>Total Cost:</strong> ₦${result.cost}
                                </div>
                                <div class="detail-row">
                                    <strong>Estimated Delivery:</strong> ${formatDate(result.estimatedDelivery)}
                                </div>
                            </div>
                            <p class="confirmation-note">
                                A confirmation email has been sent to ${shipmentData.senderEmail}. 
                                Save your tracking ID for future reference.
                            </p>
                        </div>`, 
                        'success'
                    );
                    
                    shipmentForm.reset();
                    shippingQuote = null;
                    createShipmentSubmit.disabled = true;
                    document.getElementById('quote-display').innerHTML = '';
                    
                    // Close modal after a delay
                    setTimeout(() => {
                        closeCurrentModal();
                    }, 10000);
                } else {
                    showShipmentMessage(result.message, 'error');
                }
                
            } catch (error) {
                console.error('Error creating shipment:', error);
                showShipmentMessage('Failed to create shipment. Please try again later.', 'error');
            }
        });
    }
}

function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quote-display');
    if (quoteDisplay) {
        quoteDisplay.innerHTML = `
            <div class="quote-result">
                <h4>💰 Shipping Quote</h4>
                <div class="quote-details">
                    <div class="quote-item">
                        <span class="quote-label">Total Cost:</span>
                        <span class="quote-value">₦${quote.finalPrice}</span>
                    </div>
                    <div class="quote-item">
                        <span class="quote-label">Estimated Delivery:</span>
                        <span class="quote-value">${formatDate(quote.estimatedDelivery)} (${quote.estimatedDays} days)</span>
                    </div>
                    <div class="quote-item">
                        <span class="quote-label">Quote Valid Until:</span>
                        <span class="quote-value">${formatDate(quote.validUntil)}</span>
                    </div>
                </div>
                <p class="quote-note">Click "Create Shipment" to proceed with this quote.</p>
            </div>
        `;
    }
}

function showPickupMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.pickup-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `pickup-message ${type}`;
    messageElement.innerHTML = message;
    
    // Insert at the top of the modal content
    const modalContent = document.querySelector('#pickup-modal .modal-content');
    if (modalContent) {
        modalContent.insertBefore(messageElement, modalContent.firstChild);
        
        // Auto-hide success/error messages after 8 seconds
        if (type !== 'loading') {
            setTimeout(() => {
                messageElement.remove();
            }, 8000);
        }
    }
}

function showShipmentMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.shipment-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `shipment-message ${type}`;
    messageElement.innerHTML = message;
    
    // Insert at the top of the modal content
    const modalContent = document.querySelector('#shipment-modal .modal-content');
    if (modalContent) {
        modalContent.insertBefore(messageElement, modalContent.firstChild);
        
        // Auto-hide success/error messages after appropriate time
        if (type !== 'loading') {
            const delay = type === 'success' ? 10000 : 5000;
            setTimeout(() => {
                messageElement.remove();
            }, delay);
        }
    }
}

function closeCurrentModal() {
    if (currentModal) {
        currentModal.style.display = 'none';
        currentModal = null;
    }
}

// Utility function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentModal) {
        closeCurrentModal();
    }
});

function initializeContactForm() {
}

function initializePickupForm() {
}

function initializeShippingForm() {
}
