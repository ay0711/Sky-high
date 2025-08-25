const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Email configuration
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email settings
const EMAIL_CONFIG = {
    targetEmail: process.env.TARGET_EMAIL,
    fromEmail: process.env.EMAIL_USER
};

// Function to send email
async function sendContactEmail(contactData) {
    try {
        const mailOptions = {
            from: `"Sky High Logistics" <${EMAIL_CONFIG.fromEmail}>`,
            to: EMAIL_CONFIG.targetEmail,
            subject: `New Contact Form Message from ${contactData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #13032e; color: white; padding: 20px; text-align: center;">
                        <h2>Sky High Logistics</h2>
                        <h3>New Contact Form Message</h3>
                    </div>
                    
                    <div style="padding: 20px; background: #f9f9f9;">
                        <h3 style="color: #13032e;">Contact Details:</h3>
                        <p><strong>Name:</strong> ${contactData.name}</p>
                        <p><strong>Email:</strong> ${contactData.email}</p>
                        <p><strong>Date:</strong> ${new Date(contactData.timestamp).toLocaleString()}</p>
                        
                        <h3 style="color: #13032e; margin-top: 30px;">Message:</h3>
                        <div style="background: white; padding: 15px; border-left: 4px solid #ff7200; border-radius: 5px;">
                            ${contactData.message.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div style="margin-top: 30px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
                            <p style="margin: 0; font-size: 14px; color: #666;">
                                <strong>Reply to:</strong> ${contactData.email}<br>
                                <strong>Message ID:</strong> ${contactData.id}
                            </p>
                        </div>
                    </div>
                    
                    <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        This message was sent from the Sky High Logistics website contact form.
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', EMAIL_CONFIG.targetEmail);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}

// Enhanced Mock database for tracking information (30 packages)
const trackingDatabase = {
    'SKH001001': {
        id: 'SKH001001',
        status: 'Delivered',
        location: 'Lagos',
        estimatedDelivery: '2025-08-05',
        lastUpdated: '2025-08-05 15:30',
        timeline: [
            { date: '2025-08-03 09:00', description: 'Package picked up', location: 'Abuja' },
            { date: '2025-08-03 18:00', description: 'Departed origin facility', location: 'Abuja Distribution Center' },
            { date: '2025-08-04 12:00', description: 'Arrived at destination facility', location: 'Lagos Distribution Center' },
            { date: '2025-08-05 15:30', description: 'Package delivered successfully', location: 'Lagos' }
        ]
    },
    'SKH001002': {
        id: 'SKH001002',
        status: 'In Transit',
        location: 'Port Harcourt Distribution Center',
        estimatedDelivery: '2025-08-10',
        lastUpdated: '2025-08-09 08:00',
        timeline: [
            { date: '2025-08-07 10:30', description: 'Package picked up', location: 'Lagos' },
            { date: '2025-08-07 19:45', description: 'Departed origin facility', location: 'Lagos Distribution Center' },
            { date: '2025-08-09 08:00', description: 'Arrived at destination facility', location: 'Port Harcourt Distribution Center' }
        ]
    },
    'SKH001003': {
        id: 'SKH001003',
        status: 'Out for Delivery',
        location: 'Kano',
        estimatedDelivery: '2025-08-09',
        lastUpdated: '2025-08-09 07:30',
        timeline: [
            { date: '2025-08-06 11:00', description: 'Package picked up', location: 'Kaduna' },
            { date: '2025-08-07 14:20', description: 'Arrived at destination facility', location: 'Kano Distribution Center' },
            { date: '2025-08-09 07:30', description: 'Out for delivery', location: 'Kano' }
        ]
    },
    'SKH001004': {
        id: 'SKH001004',
        status: 'Package Registered',
        location: 'Ibadan',
        estimatedDelivery: '2025-08-12',
        lastUpdated: '2025-08-09 14:00',
        timeline: [
            { date: '2025-08-09 14:00', description: 'Package registered and awaiting pickup', location: 'Ibadan' }
        ]
    },
    'SKH001005': {
        id: 'SKH001005',
        status: 'Delivered',
        location: 'Enugu',
        estimatedDelivery: '2025-08-07',
        lastUpdated: '2025-08-07 16:15',
        timeline: [
            { date: '2025-08-05 08:45', description: 'Package picked up', location: 'Lagos' },
            { date: '2025-08-05 20:30', description: 'Departed origin facility', location: 'Lagos Distribution Center' },
            { date: '2025-08-06 15:00', description: 'Arrived at destination facility', location: 'Enugu Distribution Center' },
            { date: '2025-08-07 16:15', description: 'Package delivered successfully', location: 'Enugu' }
        ]
    },
    'SKH001006': {
        id: 'SKH001006',
        status: 'In Transit',
        location: 'En route to Benin City',
        estimatedDelivery: '2025-08-11',
        lastUpdated: '2025-08-09 12:45',
        timeline: [
            { date: '2025-08-08 09:15', description: 'Package picked up', location: 'Lagos' },
            { date: '2025-08-09 12:45', description: 'In transit to destination', location: 'En route to Benin City' }
        ]
    },
    'SKH001007': {
        id: 'SKH001007',
        status: 'Processing',
        location: 'Lagos Sorting Facility',
        estimatedDelivery: '2025-08-13',
        lastUpdated: '2025-08-09 10:20',
        timeline: [
            { date: '2025-08-08 16:30', description: 'Package picked up', location: 'Ikeja' },
            { date: '2025-08-09 10:20', description: 'Package being processed', location: 'Lagos Sorting Facility' }
        ]
    },
    'SKH001008': {
        id: 'SKH001008',
        status: 'Delivered',
        location: 'Warri',
        estimatedDelivery: '2025-08-08',
        lastUpdated: '2025-08-08 14:30',
        timeline: [
            { date: '2025-08-06 07:00', description: 'Package picked up', location: 'Port Harcourt' },
            { date: '2025-08-06 17:45', description: 'Departed origin facility', location: 'Port Harcourt Distribution Center' },
            { date: '2025-08-07 13:20', description: 'Arrived at destination facility', location: 'Warri Local Hub' },
            { date: '2025-08-08 14:30', description: 'Package delivered successfully', location: 'Warri' }
        ]
    },
    'SKH001009': {
        id: 'SKH001009',
        status: 'Out for Delivery',
        location: 'Jos',
        estimatedDelivery: '2025-08-09',
        lastUpdated: '2025-08-09 08:45',
        timeline: [
            { date: '2025-08-07 12:00', description: 'Package picked up', location: 'Abuja' },
            { date: '2025-08-08 09:30', description: 'Arrived at destination facility', location: 'Jos Distribution Center' },
            { date: '2025-08-09 08:45', description: 'Out for delivery', location: 'Jos' }
        ]
    },
    'SKH001010': {
        id: 'SKH001010',
        status: 'In Transit',
        location: 'Ilorin Distribution Center',
        estimatedDelivery: '2025-08-10',
        lastUpdated: '2025-08-09 11:00',
        timeline: [
            { date: '2025-08-08 14:15', description: 'Package picked up', location: 'Lagos' },
            { date: '2025-08-09 11:00', description: 'Arrived at destination facility', location: 'Ilorin Distribution Center' }
        ]
    },
    'SKH001011': {
        id: 'SKH001011',
        status: 'Delivered',
        location: 'Aba',
        estimatedDelivery: '2025-08-06',
        lastUpdated: '2025-08-06 17:20',
        timeline: [
            { date: '2025-08-04 10:00', description: 'Package picked up', location: 'Lagos' },
            { date: '2025-08-04 21:30', description: 'Departed origin facility', location: 'Lagos Distribution Center' },
            { date: '2025-08-05 16:45', description: 'Arrived at destination facility', location: 'Aba Local Hub' },
            { date: '2025-08-06 17:20', description: 'Package delivered successfully', location: 'Aba' }
        ]
    },
    'SKH001012': {
        id: 'SKH001012',
        status: 'Package Registered',
        location: 'Abeokuta',
        estimatedDelivery: '2025-08-14',
        lastUpdated: '2025-08-09 16:30',
        timeline: [
            { date: '2025-08-09 16:30', description: 'Package registered and awaiting pickup', location: 'Abeokuta' }
        ]
    },
    'SKH001013': {
        id: 'SKH001013',
        status: 'In Transit',
        location: 'En route to Calabar',
        estimatedDelivery: '2025-08-11',
        lastUpdated: '2025-08-09 13:15',
        timeline: [
            { date: '2025-08-08 08:30', description: 'Package picked up', location: 'Port Harcourt' },
            { date: '2025-08-09 13:15', description: 'In transit to destination', location: 'En route to Calabar' }
        ]
    },
    'SKH001014': {
        id: 'SKH001014',
        status: 'Out for Delivery',
        location: 'Maiduguri',
        estimatedDelivery: '2025-08-09',
        lastUpdated: '2025-08-09 09:00',
        timeline: [
            { date: '2025-08-06 15:45', description: 'Package picked up', location: 'Kano' },
            { date: '2025-08-07 20:00', description: 'Departed origin facility', location: 'Kano Distribution Center' },
            { date: '2025-08-08 14:30', description: 'Arrived at destination facility', location: 'Maiduguri Local Hub' },
            { date: '2025-08-09 09:00', description: 'Out for delivery', location: 'Maiduguri' }
        ]
    },
    'SKH001015': {
        id: 'SKH001015',
        status: 'Processing',
        location: 'Abuja Sorting Facility',
        estimatedDelivery: '2025-08-12',
        lastUpdated: '2025-08-09 14:45',
        timeline: [
            { date: '2025-08-09 11:20', description: 'Package picked up', location: 'Lokoja' },
            { date: '2025-08-09 14:45', description: 'Package being processed', location: 'Abuja Sorting Facility' }
        ]
    },
    'SKH001016': {
        id: 'SKH001016',
        status: 'Delivered',
        location: 'Akure',
        estimatedDelivery: '2025-08-08',
        lastUpdated: '2025-08-08 13:45',
        timeline: [
            { date: '2025-08-06 09:30', description: 'Package picked up', location: 'Lagos' },
            { date: '2025-08-06 18:15', description: 'Departed origin facility', location: 'Lagos Distribution Center' },
            { date: '2025-08-07 11:30', description: 'Arrived at destination facility', location: 'Akure Distribution Center' },
            { date: '2025-08-08 13:45', description: 'Package delivered successfully', location: 'Akure' }
        ]
    },
    'SKH001017': {
        id: 'SKH001017',
        status: 'In Transit',
        location: 'Sokoto Distribution Center',
        estimatedDelivery: '2025-08-11',
        lastUpdated: '2025-08-09 15:20',
        timeline: [
            { date: '2025-08-08 12:00', description: 'Package picked up', location: 'Kano' },
            { date: '2025-08-09 15:20', description: 'Arrived at destination facility', location: 'Sokoto Distribution Center' }
        ]
    },
    'SKH001018': {
        id: 'SKH001018',
        status: 'Out for Delivery',
        location: 'Uyo',
        estimatedDelivery: '2025-08-09',
        lastUpdated: '2025-08-09 08:15',
        timeline: [
            { date: '2025-08-07 14:00', description: 'Package picked up', location: 'Calabar' },
            { date: '2025-08-08 10:45', description: 'Arrived at destination facility', location: 'Uyo Local Hub' },
            { date: '2025-08-09 08:15', description: 'Out for delivery', location: 'Uyo' }
        ]
    },
    'SKH001019': {
        id: 'SKH001019',
        status: 'Package Registered',
        location: 'Osogbo',
        estimatedDelivery: '2025-08-13',
        lastUpdated: '2025-08-09 17:00',
        timeline: [
            { date: '2025-08-09 17:00', description: 'Package registered and awaiting pickup', location: 'Osogbo' }
        ]
    },
    'SKH001020': {
        id: 'SKH001020',
        status: 'Delivered',
        location: 'Yola',
        estimatedDelivery: '2025-08-07',
        lastUpdated: '2025-08-07 15:30',
        timeline: [
            { date: '2025-08-05 13:20', description: 'Package picked up', location: 'Abuja' },
            { date: '2025-08-05 22:00', description: 'Departed origin facility', location: 'Abuja Distribution Center' },
            { date: '2025-08-06 18:45', description: 'Arrived at destination facility', location: 'Yola Distribution Center' },
            { date: '2025-08-07 15:30', description: 'Package delivered successfully', location: 'Yola' }
        ]
    },
    'SKH001021': {
        id: 'SKH001021',
        status: 'In Transit',
        location: 'En route to Gombe',
        estimatedDelivery: '2025-08-10',
        lastUpdated: '2025-08-09 16:00',
        timeline: [
            { date: '2025-08-08 10:15', description: 'Package picked up', location: 'Jos' },
            { date: '2025-08-09 16:00', description: 'In transit to destination', location: 'En route to Gombe' }
        ]
    },
    'SKH001022': {
        id: 'SKH001022',
        status: 'Processing',
        location: 'Port Harcourt Sorting Facility',
        estimatedDelivery: '2025-08-12',
        lastUpdated: '2025-08-09 12:30',
        timeline: [
            { date: '2025-08-09 09:45', description: 'Package picked up', location: 'Owerri' },
            { date: '2025-08-09 12:30', description: 'Package being processed', location: 'Port Harcourt Sorting Facility' }
        ]
    },
    'SKH001023': {
        id: 'SKH001023',
        status: 'Out for Delivery',
        location: 'Bauchi',
        estimatedDelivery: '2025-08-09',
        lastUpdated: '2025-08-09 07:45',
        timeline: [
            { date: '2025-08-07 11:30', description: 'Package picked up', location: 'Jos' },
            { date: '2025-08-08 09:15', description: 'Arrived at destination facility', location: 'Bauchi Distribution Center' },
            { date: '2025-08-09 07:45', description: 'Out for delivery', location: 'Bauchi' }
        ]
    },
    'SKH001024': {
        id: 'SKH001024',
        status: 'Delivered',
        location: 'Makurdi',
        estimatedDelivery: '2025-08-08',
        lastUpdated: '2025-08-08 16:00',
        timeline: [
            { date: '2025-08-06 08:00', description: 'Package picked up', location: 'Abuja' },
            { date: '2025-08-06 16:30', description: 'Departed origin facility', location: 'Abuja Distribution Center' },
            { date: '2025-08-07 12:15', description: 'Arrived at destination facility', location: 'Makurdi Local Hub' },
            { date: '2025-08-08 16:00', description: 'Package delivered successfully', location: 'Makurdi' }
        ]
    },
    'SKH001025': {
        id: 'SKH001025',
        status: 'In Transit',
        location: 'Lafia Distribution Center',
        estimatedDelivery: '2025-08-10',
        lastUpdated: '2025-08-09 14:20',
        timeline: [
            { date: '2025-08-08 15:45', description: 'Package picked up', location: 'Abuja' },
            { date: '2025-08-09 14:20', description: 'Arrived at destination facility', location: 'Lafia Distribution Center' }
        ]
    },
    'SKH001026': {
        id: 'SKH001026',
        status: 'Package Registered',
        location: 'Ado-Ekiti',
        estimatedDelivery: '2025-08-14',
        lastUpdated: '2025-08-09 18:15',
        timeline: [
            { date: '2025-08-09 18:15', description: 'Package registered and awaiting pickup', location: 'Ado-Ekiti' }
        ]
    },
    'SKH001027': {
        id: 'SKH001027',
        status: 'Out for Delivery',
        location: 'Gusau',
        estimatedDelivery: '2025-08-09',
        lastUpdated: '2025-08-09 08:30',
        timeline: [
            { date: '2025-08-07 13:15', description: 'Package picked up', location: 'Kano' },
            { date: '2025-08-08 11:00', description: 'Arrived at destination facility', location: 'Gusau Local Hub' },
            { date: '2025-08-09 08:30', description: 'Out for delivery', location: 'Gusau' }
        ]
    },
    'SKH001028': {
        id: 'SKH001028',
        status: 'Delivered',
        location: 'Birnin Kebbi',
        estimatedDelivery: '2025-08-07',
        lastUpdated: '2025-08-07 14:45',
        timeline: [
            { date: '2025-08-05 11:00', description: 'Package picked up', location: 'Sokoto' },
            { date: '2025-08-05 19:30', description: 'Departed origin facility', location: 'Sokoto Distribution Center' },
            { date: '2025-08-06 14:20', description: 'Arrived at destination facility', location: 'Birnin Kebbi Local Hub' },
            { date: '2025-08-07 14:45', description: 'Package delivered successfully', location: 'Birnin Kebbi' }
        ]
    },
    'SKH001029': {
        id: 'SKH001029',
        status: 'Processing',
        location: 'Kano Sorting Facility',
        estimatedDelivery: '2025-08-11',
        lastUpdated: '2025-08-09 13:45',
        timeline: [
            { date: '2025-08-09 10:30', description: 'Package picked up', location: 'Zaria' },
            { date: '2025-08-09 13:45', description: 'Package being processed', location: 'Kano Sorting Facility' }
        ]
    },
    'SKH001030': {
        id: 'SKH001030',
        status: 'In Transit',
        location: 'En route to Asaba',
        estimatedDelivery: '2025-08-10',
        lastUpdated: '2025-08-09 15:45',
        timeline: [
            { date: '2025-08-08 16:20', description: 'Package picked up', location: 'Benin City' },
            { date: '2025-08-09 15:45', description: 'In transit to destination', location: 'En route to Asaba' }
        ]
    }
};

// Storage arrays
let contactMessages = [];
let pickupRequests = [];
let shipments = [];
let packageCounter = 1000; // Starting package counter

// Function to generate tracking ID
function generateTrackingId() {
    packageCounter++;
    return `SKH${packageCounter.toString().padStart(6, '0')}`;
}

// Function to calculate shipping cost
function calculateShippingCost(packageDetails) {
    const { packageType, weight, dimensions, pickupLocation, deliveryLocation, serviceType } = packageDetails;
    
    let basePrice = 1000; // Base price in Naira
    
    // Package type multipliers
    const typeMultipliers = {
        'document': 1.0,
        'small-package': 1.2,
        'medium-package': 1.5,
        'large-package': 2.0,
        'fragile': 1.8,
        'electronics': 2.2,
        'clothing': 1.1,
        'food': 1.3
    };
    
    basePrice *= typeMultipliers[packageType] || 1.0;
    
    // Weight-based pricing (per kg)
    if (weight) {
        basePrice += Math.max(0, weight - 1) * 300;
    }
    
    // Dimension-based pricing (if oversized)
    if (dimensions) {
        const volume = dimensions.length * dimensions.width * dimensions.height;
        if (volume > 50000) { // 50x50x20 cm threshold
            basePrice += 500;
        }
    }
    
    // Service type multipliers
    const serviceMultipliers = {
        'standard': 1.0,
        'express': 1.5,
        'same-day': 2.5,
        'next-day': 2.0,
        'international': 3.0
    };
    
    basePrice *= serviceMultipliers[serviceType] || 1.0;
    
    // Distance-based calculation (simplified)
    const distanceMultiplier = Math.random() * 0.8 + 1.0; // 1.0 - 1.8
    const finalPrice = Math.round(basePrice * distanceMultiplier);
    
    // Estimated delivery time
    let estimatedDays;
    switch(serviceType) {
        case 'same-day': estimatedDays = 1; break;
        case 'next-day': estimatedDays = 1; break;
        case 'express': estimatedDays = 2; break;
        case 'international': estimatedDays = 7; break;
        default: estimatedDays = 3;
    }
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
    
    return {
        basePrice,
        finalPrice,
        estimatedDelivery: deliveryDate.toISOString().split('T')[0],
        estimatedDays,
        currency: 'NGN'
    };
}

// Function to create shipment
function createShipment(shipmentData) {
    const trackingId = generateTrackingId();
    const cost = calculateShippingCost(shipmentData);
    
    const shipment = {
        id: trackingId,
        ...shipmentData,
        cost: cost.finalPrice,
        estimatedDelivery: cost.estimatedDelivery,
        status: 'Package Registered',
        currentLocation: shipmentData.pickupLocation,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        timeline: [
            {
                date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
                description: 'Package registered and awaiting pickup',
                location: shipmentData.pickupLocation,
                status: 'Package Registered'
            }
        ],
        paymentStatus: 'pending',
        customerEmail: shipmentData.senderEmail
    };
    
    shipments.push(shipment);
    
    // Add to tracking database for compatibility
    trackingDatabase[trackingId] = {
        id: trackingId,
        status: shipment.status,
        location: shipment.currentLocation,
        estimatedDelivery: shipment.estimatedDelivery,
        lastUpdated: shipment.lastUpdated,
        timeline: shipment.timeline
    };
    
    return shipment;
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sky High Logistics API is running',
        timestamp: new Date().toISOString()
    });
});

// Track package endpoint (using mock database only)
app.post('/api/track', (req, res) => {
    try {
        const { trackingId } = req.body;
        
        if (!trackingId) {
            return res.status(400).json({
                success: false,
                message: 'Tracking ID is required'
            });
        }
        
        const cleanTrackingId = trackingId.trim().toUpperCase();
        
        // Check our mock database
        const tracking = trackingDatabase[cleanTrackingId];
        
        if (!tracking) {
            return res.json({
                success: false,
                message: `Tracking ID "${cleanTrackingId}" not found. Please check the tracking ID and try again. Sky High tracking IDs start with "SKH" followed by 6 digits (e.g., SKH001001).`
            });
        }
        
        console.log(`Tracking request for: ${cleanTrackingId} - Status: ${tracking.status}`);
        
        res.json({
            success: true,
            tracking: tracking
        });
        
    } catch (error) {
        console.error('Error tracking package:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while tracking package'
        });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Store message
        const contactMessage = {
            id: generateUniqueId(),
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
            status: 'new'
        };
        
        contactMessages.push(contactMessage);
        
        // Send email notification
        const emailResult = await sendContactEmail(contactMessage);
        
        if (emailResult.success) {
            console.log('New contact message received and email sent:', contactMessage.id);
            res.json({
                success: true,
                message: 'Message sent successfully! We will get back to you soon.',
                messageId: contactMessage.id
            });
        } else {
            // Even if email fails, we still confirm the message was received
            console.error('Email sending failed, but message stored:', emailResult.error);
            res.json({
                success: true,
                message: 'Message received successfully! We will get back to you soon.',
                messageId: contactMessage.id,
                note: 'Email notification may be delayed'
            });
        }
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Create shipment endpoint
app.post('/api/create-shipment', async (req, res) => {
    try {
        const {
            senderName, senderEmail, senderPhone, senderAddress,
            receiverName, receiverEmail, receiverPhone, receiverAddress,
            packageType, packageDescription, weight, dimensions,
            serviceType, pickupLocation, deliveryLocation, specialInstructions
        } = req.body;
        
        // Validate required fields
        if (!senderName || !senderEmail || !senderPhone || !senderAddress ||
            !receiverName || !receiverPhone || !receiverAddress ||
            !packageType || !serviceType || !pickupLocation || !deliveryLocation) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sender email format'
            });
        }
        
        if (receiverEmail && !emailRegex.test(receiverEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid receiver email format'
            });
        }
        
        // Create shipment
        const shipmentData = {
            senderName, senderEmail, senderPhone, senderAddress,
            receiverName, receiverEmail, receiverPhone, receiverAddress,
            packageType, packageDescription, weight, dimensions,
            serviceType, pickupLocation, deliveryLocation, specialInstructions
        };
        
        const newShipment = createShipment(shipmentData);
        
        // Send confirmation email to sender
        const emailData = {
            id: newShipment.id,
            name: newShipment.senderName,
            email: newShipment.senderEmail,
            message: `Your shipment has been created successfully!\n\nTracking ID: ${newShipment.id}\nReceiver: ${newShipment.receiverName}\nEstimated Delivery: ${newShipment.estimatedDelivery}\nCost: ₦${newShipment.cost}`,
            timestamp: newShipment.createdAt
        };
        
        await sendContactEmail(emailData);
        
        res.json({
            success: true,
            message: 'Shipment created successfully!',
            trackingId: newShipment.id,
            cost: newShipment.cost,
            estimatedDelivery: newShipment.estimatedDelivery,
            shipment: newShipment
        });
        
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create shipment. Please try again later.'
        });
    }
});

// Testimonials data generator
function generateTestimonials() {
    const testimonials = [
        {
            id: 1,
            name: "Adebayo Johnson",
            company: "Tech Solutions Ltd",
            location: "Lagos",
            rating: 5,
            text: "Sky High Logistics has been our go-to delivery partner for over 2 years. Their reliability and speed are unmatched!",
            service: "Express Delivery",
            date: "2025-07-15"
        },
        {
            id: 2,
            name: "Fatima Mohammed",
            company: "Fashion Forward",
            location: "Abuja",
            rating: 5,
            text: "Amazing service! They delivered my urgent documents the same day I requested pickup. Highly professional team.",
            service: "Same-Day Delivery",
            date: "2025-07-28"
        },
        {
            id: 3,
            name: "Chinedu Okafor",
            company: "Okafor Enterprises",
            location: "Port Harcourt",
            rating: 4,
            text: "Excellent tracking system and customer service. My packages always arrive safely and on time.",
            service: "Standard Delivery",
            date: "2025-08-02"
        },
        {
            id: 4,
            name: "Sarah Williams",
            company: "International Traders",
            location: "Kano",
            rating: 5,
            text: "Their international shipping service is fantastic. Competitive rates and reliable delivery times.",
            service: "International Shipping",
            date: "2025-07-20"
        },
        {
            id: 5,
            name: "Emmanuel Udoh",
            company: "Small Business Owner",
            location: "Enugu",
            rating: 5,
            text: "As a small business owner, I need affordable and reliable logistics. Sky High delivers exactly that!",
            service: "Local Delivery",
            date: "2025-08-05"
        },
        {
            id: 6,
            name: "Kemi Adebola",
            company: "E-commerce Store",
            location: "Ibadan",
            rating: 4,
            text: "Great integration with our online store. Their API makes shipping management so much easier.",
            service: "E-commerce Integration",
            date: "2025-07-10"
        },
        {
            id: 7,
            name: "Dr. Ibrahim Hassan",
            company: "Medical Supplies Co.",
            location: "Kaduna",
            rating: 5,
            text: "Critical medical supplies delivered with care and precision. Trust Sky High with our most important shipments.",
            service: "Express Delivery",
            date: "2025-07-25"
        },
        {
            id: 8,
            name: "Grace Nwosu",
            company: "Personal Customer",
            location: "Warri",
            rating: 5,
            text: "Sent a surprise gift to my family in Lagos. It arrived perfectly packaged and ahead of schedule!",
            service: "Gift Delivery",
            date: "2025-08-01"
        }
    ];
    
    // Return a random selection of testimonials
    const shuffled = testimonials.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6); // Return 6 random testimonials
}

// Get testimonials endpoint
app.get('/api/testimonials', (req, res) => {
    try {
        const testimonials = generateTestimonials();
        
        res.json({
            success: true,
            testimonials: testimonials,
            count: testimonials.length
        });
        
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials'
        });
    }
});

// Get shipping quote endpoint
app.post('/api/shipping-quote', (req, res) => {
    try {
        const { packageType, weight, dimensions, pickupLocation, deliveryLocation, serviceType } = req.body;
        
        if (!packageType || !pickupLocation || !deliveryLocation || !serviceType) {
            return res.status(400).json({
                success: false,
                message: 'Package type, locations, and service type are required'
            });
        }
        
        const quote = calculateShippingCost({
            packageType, weight, dimensions, pickupLocation, deliveryLocation, serviceType
        });
        
        res.json({
            success: true,
            quote: {
                ...quote,
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
        });
        
    } catch (error) {
        console.error('Error generating quote:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate quote'
        });
    }
});

// Pickup request endpoint (enhanced)
app.post('/api/pickup-request', (req, res) => {
    try {
        const { 
            name, phone, email, pickupAddress, deliveryAddress, 
            packageType, packageDescription, weight, preferredDate, 
            serviceType, specialInstructions 
        } = req.body;
        
        // Validate input
        if (!name || !phone || !pickupAddress || !deliveryAddress || !packageType || !preferredDate) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled'
            });
        }
        
        // Generate reference ID
        const referenceId = 'REQ' + Date.now();
        
        // Calculate estimated cost
        const estimatedCost = calculateShippingCost({
            packageType,
            weight,
            pickupLocation: pickupAddress,
            deliveryLocation: deliveryAddress,
            serviceType: serviceType || 'standard'
        });
        
        // Store pickup request
        const pickupRequest = {
            referenceId,
            name,
            phone,
            email,
            pickupAddress,
            deliveryAddress,
            packageType,
            packageDescription,
            weight,
            preferredDate,
            serviceType: serviceType || 'standard',
            specialInstructions,
            estimatedCost: estimatedCost.finalPrice,
            status: 'pending',
            requestDate: new Date().toISOString()
        };
        
        pickupRequests.push(pickupRequest);
        
        console.log('New pickup request:', pickupRequest);
        
        res.json({
            success: true,
            message: 'Pickup request submitted successfully!',
            referenceId: referenceId,
            estimatedCost: estimatedCost.finalPrice,
            estimatedDelivery: estimatedCost.estimatedDelivery
        });
        
    } catch (error) {
        console.error('Error processing pickup request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit pickup request. Please try again later.'
        });
    }
});

// Update shipment status endpoint (for admin/courier use)
app.post('/api/update-shipment-status', (req, res) => {
    try {
        const { trackingId, status, location, description } = req.body;
        
        if (!trackingId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Tracking ID and status are required'
            });
        }
        
        const shipment = shipments.find(s => s.id === trackingId.toUpperCase());
        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }
        
        // Update shipment
        shipment.status = status;
        if (location) shipment.currentLocation = location;
        shipment.lastUpdated = new Date().toISOString();
        
        // Add to timeline
        const timelineEntry = {
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
            description: description || status,
            location: location || shipment.currentLocation,
            status: status
        };
        
        shipment.timeline.push(timelineEntry);
        
        // Update tracking database
        if (trackingDatabase[trackingId.toUpperCase()]) {
            trackingDatabase[trackingId.toUpperCase()].status = status;
            trackingDatabase[trackingId.toUpperCase()].location = location || shipment.currentLocation;
            trackingDatabase[trackingId.toUpperCase()].lastUpdated = shipment.lastUpdated;
            trackingDatabase[trackingId.toUpperCase()].timeline = shipment.timeline;
        }
        
        res.json({
            success: true,
            message: 'Shipment status updated successfully',
            shipment: shipment
        });
        
    } catch (error) {
        console.error('Error updating shipment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update shipment status'
        });
    }
});

// Get all contact messages (admin endpoint)
app.get('/api/admin/messages', (req, res) => {
    try {
        res.json({
            success: true,
            messages: contactMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

// Get all pickup requests (admin endpoint)
app.get('/api/admin/pickup-requests', (req, res) => {
    try {
        res.json({
            success: true,
            requests: pickupRequests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
        });
    } catch (error) {
        console.error('Error fetching pickup requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pickup requests'
        });
    }
});

// Get all shipments (admin endpoint)
app.get('/api/admin/shipments', (req, res) => {
    try {
        res.json({
            success: true,
            shipments: shipments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch shipments'
        });
    }
});

// Get shipment by tracking ID
app.get('/api/shipment/:trackingId', (req, res) => {
    try {
        const { trackingId } = req.params;
        const shipment = shipments.find(s => s.id === trackingId.toUpperCase());
        
        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }
        
        res.json({
            success: true,
            shipment: shipment
        });
        
    } catch (error) {
        console.error('Error fetching shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch shipment details'
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Test email endpoint (for development only)
app.post('/api/test-email', async (req, res) => {
    try {
        const testMessage = {
            id: 'TEST-' + Date.now(),
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test email to verify the email configuration is working correctly.',
            timestamp: new Date().toISOString()
        };

        const emailResult = await sendContactEmail(testMessage);

        if (emailResult.success) {
            res.json({
                success: true,
                message: 'Test email sent successfully!',
                targetEmail: EMAIL_CONFIG.targetEmail
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: emailResult.error
            });
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
});

// Utility function to generate unique IDs
function generateUniqueId() {
    return 'MSG' + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Sky High Logistics server running on http://localhost:${PORT}`);
    
    // Check if email is properly configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log(`✅ Email configuration loaded from environment variables`);
    } else {
        console.log(`⚠️  Email configuration using default values - update .env file for production`);
    }
});
