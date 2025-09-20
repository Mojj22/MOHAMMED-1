// Real Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('codemaster_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('codemaster_current_user') || 'null');
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.maxLoginAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkSession();
        this.updateUI();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-btn, .logout-btn *')) {
                this.logout();
            }
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        const nameInputs = document.querySelectorAll('input[name="name"]');

        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        passwordInputs.forEach(input => {
            input.addEventListener('blur', () => this.validatePassword(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        nameInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateName(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(input, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        }
        
        this.showFieldSuccess(input);
        return true;
    }

    validatePassword(input) {
        const password = input.value;
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (!password) {
            this.showFieldError(input, 'Password is required');
            return false;
        }
        
        if (password.length < minLength) {
            this.showFieldError(input, `Password must be at least ${minLength} characters long`);
            return false;
        }
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            this.showFieldError(input, 'Password must contain uppercase, lowercase, number, and special character');
            return false;
        }
        
        this.showFieldSuccess(input);
        return true;
    }

    validateName(input) {
        const name = input.value.trim();
        
        if (!name) {
            this.showFieldError(input, 'Name is required');
            return false;
        }
        
        if (name.length < 2) {
            this.showFieldError(input, 'Name must be at least 2 characters long');
            return false;
        }
        
        this.showFieldSuccess(input);
        return true;
    }

    showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error') || document.createElement('div');
        
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        if (!formGroup.querySelector('.field-error')) {
            formGroup.appendChild(errorElement);
        }
        
        input.classList.add('error');
        input.classList.remove('success');
    }

    showFieldSuccess(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.add('success');
        input.classList.remove('error');
    }

    clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('error', 'success');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value.trim();
        const password = form.querySelector('input[type="password"]').value;
        const rememberMe = form.querySelector('input[name="remember"]')?.checked || false;
        
        // Check rate limiting
        if (this.isAccountLocked(email)) {
            this.showError('Account temporarily locked due to too many failed attempts. Please try again later.');
            return;
        }
        
        // Show loading state
        this.showLoading(form);
        
        try {
            // Simulate API delay
            await this.delay(1000);
            
            const user = this.users.find(u => u.email === email);
            
            if (!user || !this.verifyPassword(password, user.password)) {
                this.recordFailedAttempt(email);
                throw new Error('Invalid email or password');
            }
            
            // Successful login
            this.clearFailedAttempts(email);
            this.setCurrentUser(user, rememberMe);
            this.closeAuthModal();
            this.showWelcomeMessage(user.name);
            this.updateUI();
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading(form);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const name = form.querySelector('input[name="name"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const password = form.querySelector('input[type="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]')?.value;
        
        // Validate all fields
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[type="email"]');
        const passwordInput = form.querySelector('input[type="password"]');
        
        const isNameValid = this.validateName(nameInput);
        const isEmailValid = this.validateEmail(emailInput);
        const isPasswordValid = this.validatePassword(passwordInput);
        
        if (!isNameValid || !isEmailValid || !isPasswordValid) {
            return;
        }
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }
        
        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            this.showError('An account with this email already exists');
            return;
        }
        
        // Show loading state
        this.showLoading(form);
        
        try {
            // Simulate API delay
            await this.delay(1500);
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                lastLogin: null,
                preferences: {
                    theme: 'dark',
                    language: 'en',
                    notifications: true
                }
            };
            
            this.users.push(newUser);
            this.saveUsers();
            
            // Auto login after registration
            this.setCurrentUser(newUser, false);
            this.closeAuthModal();
            this.showWelcomeMessage(newUser.name, true);
            this.updateUI();
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading(form);
        }
    }

    hashPassword(password) {
        // Simple hash for demo - in production use bcrypt or similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    setCurrentUser(user, rememberMe) {
        user.lastLogin = new Date().toISOString();
        this.currentUser = user;
        
        if (rememberMe) {
            localStorage.setItem('codemaster_current_user', JSON.stringify(user));
            localStorage.setItem('codemaster_session_expires', (Date.now() + (30 * 24 * 60 * 60 * 1000)).toString()); // 30 days
        } else {
            sessionStorage.setItem('codemaster_current_user', JSON.stringify(user));
            localStorage.setItem('codemaster_session_expires', (Date.now() + this.sessionTimeout).toString());
        }
        
        this.saveUsers();
    }

    checkSession() {
        const sessionExpires = localStorage.getItem('codemaster_session_expires');
        
        if (sessionExpires && Date.now() > parseInt(sessionExpires)) {
            this.logout(true);
            return;
        }
        
        // Check if user exists in sessionStorage (for non-remember sessions)
        const sessionUser = sessionStorage.getItem('codemaster_current_user');
        if (sessionUser && !this.currentUser) {
            this.currentUser = JSON.parse(sessionUser);
        }
    }

    logout(sessionExpired = false) {
        this.currentUser = null;
        localStorage.removeItem('codemaster_current_user');
        localStorage.removeItem('codemaster_session_expires');
        sessionStorage.removeItem('codemaster_current_user');
        
        this.updateUI();
        
        if (sessionExpired) {
            this.showError('Your session has expired. Please log in again.');
        } else {
            this.showSuccess('You have been logged out successfully.');
        }
    }

    updateUI() {
        const authBtn = document.getElementById('authBtn');
        const userMenu = document.getElementById('userMenu');
        
        if (this.currentUser) {
            // User is logged in
            if (authBtn) {
                authBtn.innerHTML = `
                    <i class="fas fa-user-circle"></i>
                    <span>${this.currentUser.name}</span>
                    <i class="fas fa-chevron-down"></i>
                `;
                authBtn.classList.add('logged-in');
            }
            
            // Show user menu
            this.createUserMenu();
        } else {
            // User is not logged in
            if (authBtn) {
                authBtn.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span data-en="Login" data-ar="تسجيل الدخول">Login</span>
                `;
                authBtn.classList.remove('logged-in');
            }
            
            // Hide user menu
            if (userMenu) {
                userMenu.remove();
            }
        }
    }

    createUserMenu() {
        let userMenu = document.getElementById('userMenu');
        
        if (!userMenu) {
            userMenu = document.createElement('div');
            userMenu.id = 'userMenu';
            userMenu.className = 'user-menu';
            document.body.appendChild(userMenu);
        }
        
        userMenu.innerHTML = `
            <div class="user-menu-header">
                <div class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="user-info">
                    <h4>${this.currentUser.name}</h4>
                    <p>${this.currentUser.email}</p>
                </div>
            </div>
            <div class="user-menu-items">
                <a href="#" class="menu-item" onclick="settingsSystem.openSettings()">
                    <i class="fas fa-cog"></i>
                    <span data-en="Settings" data-ar="الإعدادات">Settings</span>
                </a>
                <a href="#" class="menu-item" onclick="authSystem.openProfile()">
                    <i class="fas fa-user-edit"></i>
                    <span data-en="Edit Profile" data-ar="تعديل الملف الشخصي">Edit Profile</span>
                </a>
                <a href="#" class="menu-item" onclick="authSystem.viewProgress()">
                    <i class="fas fa-chart-line"></i>
                    <span data-en="My Progress" data-ar="تقدمي">My Progress</span>
                </a>
                <div class="menu-divider"></div>
                <a href="#" class="menu-item logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span data-en="Logout" data-ar="تسجيل الخروج">Logout</span>
                </a>
            </div>
        `;
        
        // Position user menu
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            const rect = authBtn.getBoundingClientRect();
            userMenu.style.top = (rect.bottom + 10) + 'px';
            userMenu.style.right = (window.innerWidth - rect.right) + 'px';
        }
    }

    openProfile() {
        console.log('Opening profile editor...');
    }

    viewProgress() {
        console.log('Viewing progress...');
    }

    isAccountLocked(email) {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
        const userAttempts = attempts[email];
        
        if (!userAttempts) return false;
        
        const { count, lastAttempt } = userAttempts;
        const timeSinceLastAttempt = Date.now() - lastAttempt;
        
        return count >= this.maxLoginAttempts && timeSinceLastAttempt < this.lockoutTime;
    }

    recordFailedAttempt(email) {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
        
        if (!attempts[email]) {
            attempts[email] = { count: 0, lastAttempt: 0 };
        }
        
        attempts[email].count++;
        attempts[email].lastAttempt = Date.now();
        
        localStorage.setItem('login_attempts', JSON.stringify(attempts));
    }

    clearFailedAttempts(email) {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
        delete attempts[email];
        localStorage.setItem('login_attempts', JSON.stringify(attempts));
    }

    saveUsers() {
        localStorage.setItem('codemaster_users', JSON.stringify(this.users));
    }

    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            const isLogin = form.id === 'loginForm';
            submitBtn.innerHTML = isLogin ? 'Login' : 'Register';
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showWelcomeMessage(name, isNewUser = false) {
        const message = isNewUser 
            ? `Welcome to CodeMaster Pro, ${name}! Your account has been created successfully.`
            : `Welcome back, ${name}!`;
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    closeAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('active');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize authentication system
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}