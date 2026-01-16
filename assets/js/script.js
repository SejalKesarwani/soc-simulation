// SOC Login System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Basic validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Simulate login process
            console.log('Login attempt:', {
                username: username,
                timestamp: new Date().toISOString()
            });

            // Simulate successful login
            alert(`Welcome, ${username}! Login successful.`);
            
            // Reset form
            loginForm.reset();
        });
    }

    // Add password visibility toggle (optional enhancement)
    const passwordToggle = document.createElement('button');
    passwordToggle.type = 'button';
    passwordToggle.textContent = '👁';
    passwordToggle.style.cssText = `
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #00ff88;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
    `;
});
