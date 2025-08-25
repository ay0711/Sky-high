// Simple tracking functionality
document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('tracking-form');
    
    if (trackingForm) {
        trackingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const trackingId = document.getElementById('trackingId').value.trim();
            console.log('Tracking ID:', trackingId);
            
            const resultDiv = document.getElementById('tracking-result');
            console.log('Result div found:', resultDiv);
            
            if (!trackingId) {
                resultDiv.innerHTML = '<div style="color: red;">Please enter a tracking ID</div>';
                return;
            }
            
            resultDiv.innerHTML = '<div>Searching for your package...</div>';
            
            try {
                console.log('Making API request...');
                const response = await fetch('https://sky-high-zcxt.onrender.com/api/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ trackingId: trackingId }),
                });
                
                console.log('Response received:', response.status);
                
                const result = await response.json();
                console.log('Result:', result);
                
                if (result.success && result.tracking) {
                    const tracking = result.tracking;
                    resultDiv.innerHTML = `
                        <div style="border: 1px solid #28a745; padding: 20px; border-radius: 5px; background: #f8fff8;">
                            <h3>Package Found!</h3>
                            <p><strong>Tracking ID:</strong> ${tracking.id}</p>
                            <p><strong>Status:</strong> ${tracking.status}</p>
                            <p><strong>Location:</strong> ${tracking.location}</p>
                            <p><strong>Estimated Delivery:</strong> ${tracking.estimatedDelivery}</p>
                            <p><strong>Last Updated:</strong> ${tracking.lastUpdated}</p>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div style="border: 1px solid #dc3545; padding: 20px; border-radius: 5px; background: #fff8f8;">
                            <h3>Package Not Found</h3>
                            <p>${result.message || 'Please check your tracking ID and try again.'}</p>
                        </div>
                    `;
                }
                
            } catch (error) {
                console.error('Error:', error);
                resultDiv.innerHTML = `
                    <div style="border: 1px solid #dc3545; padding: 20px; border-radius: 5px; background: #fff8f8;">
                        <h3>Error</h3>
                        <p>Unable to connect to tracking service. Please try again later.</p>
                    </div>
                `;
            }
        });
    } else {
        console.error('Tracking form not found!');
    }
});
