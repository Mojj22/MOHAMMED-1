// Settings System
class SettingsSystem {
    constructor() {
        this.defaultSettings = {
            theme: 'dark',
            language: 'en',
            notifications: true,
            autoSave: true,
            fontSize: 'medium',
            codeTheme: 'dark',
            soundEffects: true,
            animations: true,
            privacy: {
                showProfile: true,
                showProgress: true,
                allowAnalytics: true
            },
            accessibility: {
                highContrast: false,
                reducedMotion: false,
                screenReader: false
            }
        };
        
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.createSettingsModal();
        this.setupEventListeners();
        this.applySettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('codemaster_settings');
        if (saved) {
            return { ...this.defaultSettings, ...JSON.parse(saved) };
        }
        return { ...this.defaultSettings };
    }

    saveSettings() {
        localStorage.setItem('codemaster_settings', JSON.stringify(this.settings));
        this.applySettings();
    }

    createSettingsModal() {
        const settingsModal = document.createElement('div');
        settingsModal.id = 'settingsModal';
        settingsModal.className = 'settings-modal';
        
        settingsModal.innerHTML = `
            <div class="settings-overlay"></div>
            <div class="settings-container">
                <div class="settings-header">
                    <h2 data-en="Settings" data-ar="الإعدادات">Settings</h2>
                    <button class="settings-close" id="closeSettings">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="settings-content">
                    <div class="settings-sidebar">
                        <div class="settings-nav">
                            <button class="settings-nav-item active" data-tab="general">
                                <i class="fas fa-cog"></i>
                                <span data-en="General" data-ar="عام">General</span>
                            </button>
                            <button class="settings-nav-item" data-tab="appearance">
                                <i class="fas fa-palette"></i>
                                <span data-en="Appearance" data-ar="المظهر">Appearance</span>
                            </button>
                            <button class="settings-nav-item" data-tab="notifications">
                                <i class="fas fa-bell"></i>
                                <span data-en="Notifications" data-ar="الإشعارات">Notifications</span>
                            </button>
                            <button class="settings-nav-item" data-tab="privacy">
                                <i class="fas fa-shield-alt"></i>
                                <span data-en="Privacy" data-ar="الخصوصية">Privacy</span>
                            </button>
                            <button class="settings-nav-item" data-tab="accessibility">
                                <i class="fas fa-universal-access"></i>
                                <span data-en="Accessibility" data-ar="إمكانية الوصول">Accessibility</span>
                            </button>
                            <button class="settings-nav-item" data-tab="account">
                                <i class="fas fa-user-cog"></i>
                                <span data-en="Account" data-ar="الحساب">Account</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="settings-main">
                        <!-- General Settings -->
                        <div class="settings-tab active" id="general-tab">
                            <h3 data-en="General Settings" data-ar="الإعدادات العامة">General Settings</h3>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Language" data-ar="اللغة">Language</span>
                                    <select id="languageSetting" class="setting-select">
                                        <option value="en">English</option>
                                        <option value="ar">العربية</option>
                                    </select>
                                </label>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Auto Save" data-ar="الحفظ التلقائي">Auto Save</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="autoSaveSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Automatically save your progress" data-ar="احفظ تقدمك تلقائياً">Automatically save your progress</p>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Sound Effects" data-ar="المؤثرات الصوتية">Sound Effects</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="soundEffectsSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Play sound effects for interactions" data-ar="تشغيل المؤثرات الصوتية للتفاعلات">Play sound effects for interactions</p>
                            </div>
                        </div>
                        
                        <!-- Appearance Settings -->
                        <div class="settings-tab" id="appearance-tab">
                            <h3 data-en="Appearance Settings" data-ar="إعدادات المظهر">Appearance Settings</h3>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Theme" data-ar="السمة">Theme</span>
                                    <select id="themeSetting" class="setting-select">
                                        <option value="dark">Dark</option>
                                        <option value="light">Light</option>
                                        <option value="auto">Auto</option>
                                    </select>
                                </label>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Font Size" data-ar="حجم الخط">Font Size</span>
                                    <select id="fontSizeSetting" class="setting-select">
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                        <option value="extra-large">Extra Large</option>
                                    </select>
                                </label>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Code Theme" data-ar="سمة الكود">Code Theme</span>
                                    <select id="codeThemeSetting" class="setting-select">
                                        <option value="dark">Dark</option>
                                        <option value="light">Light</option>
                                        <option value="monokai">Monokai</option>
                                        <option value="github">GitHub</option>
                                    </select>
                                </label>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Animations" data-ar="الرسوم المتحركة">Animations</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="animationsSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Enable smooth animations and transitions" data-ar="تمكين الرسوم المتحركة والانتقالات السلسة">Enable smooth animations and transitions</p>
                            </div>
                        </div>
                        
                        <!-- Notifications Settings -->
                        <div class="settings-tab" id="notifications-tab">
                            <h3 data-en="Notification Settings" data-ar="إعدادات الإشعارات">Notification Settings</h3>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Enable Notifications" data-ar="تمكين الإشعارات">Enable Notifications</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="notificationsSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Receive notifications about course updates and achievements" data-ar="تلقي إشعارات حول تحديثات الدورات والإنجازات">Receive notifications about course updates and achievements</p>
                            </div>
                        </div>
                        
                        <!-- Privacy Settings -->
                        <div class="settings-tab" id="privacy-tab">
                            <h3 data-en="Privacy Settings" data-ar="إعدادات الخصوصية">Privacy Settings</h3>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Show Profile" data-ar="إظهار الملف الشخصي">Show Profile</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="showProfileSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Make your profile visible to other users" data-ar="اجعل ملفك الشخصي مرئياً للمستخدمين الآخرين">Make your profile visible to other users</p>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Show Progress" data-ar="إظهار التقدم">Show Progress</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="showProgressSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Allow others to see your learning progress" data-ar="السماح للآخرين برؤية تقدمك في التعلم">Allow others to see your learning progress</p>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Analytics" data-ar="التحليلات">Analytics</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="allowAnalyticsSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Help improve the platform by sharing anonymous usage data" data-ar="ساعد في تحسين المنصة من خلال مشاركة بيانات الاستخدام المجهولة">Help improve the platform by sharing anonymous usage data</p>
                            </div>
                        </div>
                        
                        <!-- Accessibility Settings -->
                        <div class="settings-tab" id="accessibility-tab">
                            <h3 data-en="Accessibility Settings" data-ar="إعدادات إمكانية الوصول">Accessibility Settings</h3>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="High Contrast" data-ar="التباين العالي">High Contrast</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="highContrastSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Increase contrast for better visibility" data-ar="زيادة التباين لرؤية أفضل">Increase contrast for better visibility</p>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Reduced Motion" data-ar="تقليل الحركة">Reduced Motion</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="reducedMotionSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Minimize animations and motion effects" data-ar="تقليل الرسوم المتحركة وتأثيرات الحركة">Minimize animations and motion effects</p>
                            </div>
                            
                            <div class="setting-group">
                                <label class="setting-label">
                                    <span data-en="Screen Reader Support" data-ar="دعم قارئ الشاشة">Screen Reader Support</span>
                                    <div class="setting-toggle">
                                        <input type="checkbox" id="screenReaderSetting" class="toggle-input">
                                        <span class="toggle-slider"></span>
                                    </div>
                                </label>
                                <p class="setting-description" data-en="Optimize interface for screen readers" data-ar="تحسين الواجهة لقارئات الشاشة">Optimize interface for screen readers</p>
                            </div>
                        </div>
                        
                        <!-- Account Settings -->
                        <div class="settings-tab" id="account-tab">
                            <h3 data-en="Account Settings" data-ar="إعدادات الحساب">Account Settings</h3>
                            
                            <div class="setting-group">
                                <button class="setting-button primary" onclick="authSystem.openProfile()">
                                    <i class="fas fa-user-edit"></i>
                                    <span data-en="Edit Profile" data-ar="تعديل الملف الشخصي">Edit Profile</span>
                                </button>
                            </div>
                            
                            <div class="setting-group">
                                <button class="setting-button" onclick="settingsSystem.changePassword()">
                                    <i class="fas fa-key"></i>
                                    <span data-en="Change Password" data-ar="تغيير كلمة المرور">Change Password</span>
                                </button>
                            </div>
                            
                            <div class="setting-group">
                                <button class="setting-button" onclick="settingsSystem.exportData()">
                                    <i class="fas fa-download"></i>
                                    <span data-en="Export Data" data-ar="تصدير البيانات">Export Data</span>
                                </button>
                            </div>
                            
                            <div class="setting-group danger">
                                <button class="setting-button danger" onclick="settingsSystem.deleteAccount()">
                                    <i class="fas fa-trash-alt"></i>
                                    <span data-en="Delete Account" data-ar="حذف الحساب">Delete Account</span>
                                </button>
                                <p class="setting-description" data-en="Permanently delete your account and all data" data-ar="حذف حسابك وجميع البيانات نهائياً">Permanently delete your account and all data</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="settings-footer">
                    <button class="btn secondary" id="resetSettings">
                        <span data-en="Reset to Defaults" data-ar="إعادة تعيين للافتراضي">Reset to Defaults</span>
                    </button>
                    <button class="btn primary" id="saveSettings">
                        <span data-en="Save Changes" data-ar="حفظ التغييرات">Save Changes</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(settingsModal);
    }

    setupEventListeners() {
        // Settings modal controls
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.querySelector('.settings-overlay').addEventListener('click', () => this.closeSettings());
        
        // Tab navigation
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Setting controls
        this.setupSettingControls();
        
        // Footer buttons
        document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('settingsModal').classList.contains('active')) {
                this.closeSettings();
            }
        });
    }

    setupSettingControls() {
        // Language setting
        const languageSetting = document.getElementById('languageSetting');
        languageSetting.value = this.settings.language;
        languageSetting.addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            this.applyLanguage();
        });
        
        // Theme setting
        const themeSetting = document.getElementById('themeSetting');
        themeSetting.value = this.settings.theme;
        themeSetting.addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applyTheme();
        });
        
        // Font size setting
        const fontSizeSetting = document.getElementById('fontSizeSetting');
        fontSizeSetting.value = this.settings.fontSize;
        fontSizeSetting.addEventListener('change', (e) => {
            this.settings.fontSize = e.target.value;
            this.applyFontSize();
        });
        
        // Code theme setting
        const codeThemeSetting = document.getElementById('codeThemeSetting');
        codeThemeSetting.value = this.settings.codeTheme;
        codeThemeSetting.addEventListener('change', (e) => {
            this.settings.codeTheme = e.target.value;
            this.applyCodeTheme();
        });
        
        // Toggle settings
        this.setupToggleSetting('autoSaveSetting', 'autoSave');
        this.setupToggleSetting('soundEffectsSetting', 'soundEffects');
        this.setupToggleSetting('animationsSetting', 'animations');
        this.setupToggleSetting('notificationsSetting', 'notifications');
        this.setupToggleSetting('showProfileSetting', 'privacy.showProfile');
        this.setupToggleSetting('showProgressSetting', 'privacy.showProgress');
        this.setupToggleSetting('allowAnalyticsSetting', 'privacy.allowAnalytics');
        this.setupToggleSetting('highContrastSetting', 'accessibility.highContrast');
        this.setupToggleSetting('reducedMotionSetting', 'accessibility.reducedMotion');
        this.setupToggleSetting('screenReaderSetting', 'accessibility.screenReader');
    }

    setupToggleSetting(elementId, settingPath) {
        const element = document.getElementById(elementId);
        const value = this.getNestedSetting(settingPath);
        element.checked = value;
        
        element.addEventListener('change', (e) => {
            this.setNestedSetting(settingPath, e.target.checked);
            this.applySettings();
        });
    }

    getNestedSetting(path) {
        return path.split('.').reduce((obj, key) => obj && obj[key], this.settings);
    }

    setNestedSetting(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.settings);
        target[lastKey] = value;
    }

    switchTab(tabName) {
        // Update nav items
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    openSettings() {
        const settingsModal = document.getElementById('settingsModal');
        settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeSettings() {
        const settingsModal = document.getElementById('settingsModal');
        settingsModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    applySettings() {
        this.applyTheme();
        this.applyLanguage();
        this.applyFontSize();
        this.applyCodeTheme();
        this.applyAccessibility();
    }

    applyTheme() {
        const body = document.body;
        body.className = body.className.replace(/\b(light|dark)-theme\b/g, '');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const effective = this.settings.theme === 'auto' ? (prefersDark ? 'dark' : 'light') : this.settings.theme;
        body.classList.add(`${effective}-theme`);
        // Sync with global app if available
        try {
            if (window.CodeMaster && typeof window.CodeMaster.switchTheme === 'function') {
                window.CodeMaster.switchTheme(effective);
            }
        } catch {}
        // Persist for other modules
        try { localStorage.setItem('theme', effective); } catch {}
    }

    applyLanguage() {
        document.body.setAttribute('data-lang', this.settings.language);
        document.documentElement.setAttribute('dir', this.settings.language === 'ar' ? 'rtl' : 'ltr');
        // Sync with global app if available
        try {
            if (window.CodeMaster && typeof window.CodeMaster.switchLanguage === 'function') {
                window.CodeMaster.switchLanguage(this.settings.language);
            }
        } catch {}
        // Persist for other modules
        try { localStorage.setItem('language', this.settings.language); } catch {}
    }

    applyFontSize() {
        document.body.setAttribute('data-font-size', this.settings.fontSize);
    }

    applyCodeTheme() {
        document.body.setAttribute('data-code-theme', this.settings.codeTheme);
    }

    applyAccessibility() {
        const body = document.body;
        
        body.classList.toggle('high-contrast', this.settings.accessibility.highContrast);
        body.classList.toggle('reduced-motion', this.settings.accessibility.reducedMotion);
        body.classList.toggle('screen-reader', this.settings.accessibility.screenReader);
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            this.settings = { ...this.defaultSettings };
            this.saveSettings();
            this.updateSettingsUI();
            this.showNotification('Settings have been reset to defaults', 'success');
        }
    }

    updateSettingsUI() {
        // Update all form controls to match current settings
        document.getElementById('languageSetting').value = this.settings.language;
        document.getElementById('themeSetting').value = this.settings.theme;
        document.getElementById('fontSizeSetting').value = this.settings.fontSize;
        document.getElementById('codeThemeSetting').value = this.settings.codeTheme;
        
        // Update toggles
        document.getElementById('autoSaveSetting').checked = this.settings.autoSave;
        document.getElementById('soundEffectsSetting').checked = this.settings.soundEffects;
        document.getElementById('animationsSetting').checked = this.settings.animations;
        document.getElementById('notificationsSetting').checked = this.settings.notifications;
        document.getElementById('showProfileSetting').checked = this.settings.privacy.showProfile;
        document.getElementById('showProgressSetting').checked = this.settings.privacy.showProgress;
        document.getElementById('allowAnalyticsSetting').checked = this.settings.privacy.allowAnalytics;
        document.getElementById('highContrastSetting').checked = this.settings.accessibility.highContrast;
        document.getElementById('reducedMotionSetting').checked = this.settings.accessibility.reducedMotion;
        document.getElementById('screenReaderSetting').checked = this.settings.accessibility.screenReader;
    }

    changePassword() {
        // This would open a password change modal
        console.log('Opening password change dialog...');
    }

    exportData() {
        const userData = {
            settings: this.settings,
            user: authSystem?.currentUser,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `codemaster-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Data exported successfully', 'success');
    }

    deleteAccount() {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:');
        if (confirmation === 'DELETE') {
            // Clear all user data
            localStorage.removeItem('codemaster_users');
            localStorage.removeItem('codemaster_current_user');
            localStorage.removeItem('codemaster_settings');
            localStorage.removeItem('codemaster_session_expires');
            sessionStorage.clear();
            
            this.showNotification('Account deleted successfully', 'success');
            
            // Reload page after a delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    showNotification(message, type = 'info') {
        // Use the same notification system as auth
        if (typeof authSystem !== 'undefined' && authSystem.showNotification) {
            authSystem.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize settings system
let settingsSystem;
document.addEventListener('DOMContentLoaded', () => {
    settingsSystem = new SettingsSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsSystem;
}