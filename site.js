(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure all course sections are visible
    function ensureCoursesVisible() {
      const coursesGrid = document.querySelector('.courses-grid');
      const languagesGrid = document.querySelector('.languages-grid');
      const courseCards = document.querySelectorAll('.course-card');
      const languageCards = document.querySelectorAll('.language-course-card');
      
      if (coursesGrid) {
        coursesGrid.style.display = 'grid';
        coursesGrid.style.opacity = '1';
        coursesGrid.style.visibility = 'visible';
      }
      
      if (languagesGrid) {
        languagesGrid.style.display = 'grid';
        languagesGrid.style.opacity = '1';
        languagesGrid.style.visibility = 'visible';
      }
      
      courseCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.visibility = 'visible';
      });
      
      languageCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.visibility = 'visible';
      });
    }
    
    // Run immediately and after a short delay
    ensureCoursesVisible();
    setTimeout(ensureCoursesVisible, 100);
    setTimeout(ensureCoursesVisible, 500);

    // Create floating code elements for 3D background effect
    function createFloatingCode() {
      const codeElements = [
        'function hello() {', 'const app = () => {', 'import React from', 'def calculate():', 'class Main {',
        'public static void', 'SELECT * FROM', 'npm install', 'git commit -m', 'docker run',
        'console.log(', 'print("Hello")', 'return true;', 'if (condition)', 'for (let i = 0;',
        'while (true) {', 'try {', 'catch (error)', 'async function', 'await response',
        'document.getElementById', 'React.useState', 'async/await', 'Promise.then', 'fetch(api)',
        'JSON.parse(', 'localStorage', 'sessionStorage', 'addEventListener', 'querySelector',
        'createElement', 'appendChild', 'removeChild', 'setInterval', 'setTimeout'
      ];
      
      const container = document.body;
      
      // Create initial floating codes
      for (let i = 0; i < 10; i++) {
        setTimeout(() => createCodeElement(), i * 500);
      }
      
      // Continue creating new codes
      setInterval(() => {
        if (document.querySelectorAll('.floating-code').length < 25) {
          createCodeElement();
        }
      }, 1500);
      
      function createCodeElement() {
        const codeElement = document.createElement('div');
        codeElement.className = 'floating-code';
        codeElement.textContent = codeElements[Math.floor(Math.random() * codeElements.length)];
        codeElement.style.left = Math.random() * (window.innerWidth - 200) + 'px';
        codeElement.style.top = Math.random() * 100 + 'px';
        codeElement.style.animationDelay = Math.random() * 3 + 's';
        codeElement.style.animationDuration = (Math.random() * 8 + 12) + 's';
        container.appendChild(codeElement);
        
        // Remove element after animation completes
        setTimeout(() => {
          if (codeElement.parentNode) {
            codeElement.parentNode.removeChild(codeElement);
          }
        }, 25000);
      }
    }

    // Handle "country" tags - redirect to course pages
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('course-tag')) {
        const courseCard = e.target.closest('.course-card');
        const courseTitle = courseCard.querySelector('h3').textContent;
        
        openDialog({
          title: '🌍 Course Country',
          body: `Welcome to the ${courseTitle} country! This course will take you on a journey through the digital landscape of this technology.`,
          okText: 'Enter Country',
          cancelText: 'Cancel',
          onOk: () => {
            // Simulate navigation to course country page
            window.location.href = `#course-${courseTitle.toLowerCase().replace(/\s+/g, '-')}`;
          }
        });
      }
    });

    // Initialize floating code animation
    createFloatingCode();
    // Settings modal open/close and instant-apply controls
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsClose = document.getElementById('settingsClose');
    const settingsOverlay = settingsModal?.querySelector('.settings-overlay');
    const settingsSave = document.getElementById('settingsSave');
    const settingsReset = document.getElementById('settingsReset');
    const themeSelect = document.getElementById('themeSelect');
    const languageSelect = document.getElementById('languageSelect');
    const reduceMotionToggle = document.getElementById('reduceMotion');
    const fontSizeSelect = document.getElementById('fontSizeSelect');

    function openSettings() { settingsModal?.classList.add('active'); }
    function closeSettings() { settingsModal?.classList.remove('active'); }

    settingsBtn?.addEventListener('click', openSettings);
    settingsClose?.addEventListener('click', closeSettings);
    settingsOverlay?.addEventListener('click', closeSettings);

    // Persist + apply helpers
    function savePref(key, value) { try { localStorage.setItem(key, value); } catch(_){} }
    function getPref(key, def) { try { return localStorage.getItem(key) ?? def; } catch(_) { return def; } }

    function applyTheme(theme) {
      document.body.classList.toggle('light-theme', theme === 'light');
      savePref('pref_theme', theme);
    }

    function applyLanguage(lang) {
      document.body.setAttribute('data-lang', lang);
      // Update text from data attributes instantly
      document.querySelectorAll('[data-en], [data-ar]').forEach(el => {
        const txt = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
        if (txt !== null) el.textContent = txt;
      });
      // Placeholders
      document.querySelectorAll('[data-en-placeholder], [data-ar-placeholder]').forEach(el => {
        const ph = el.getAttribute(lang === 'ar' ? 'data-ar-placeholder' : 'data-en-placeholder');
        if (ph !== null) el.setAttribute('placeholder', ph);
      });
      savePref('pref_lang', lang);
    }

    function applyReduceMotion(enabled) {
      document.body.classList.toggle('reduce-motion', !!enabled);
      savePref('pref_reduce_motion', enabled ? '1' : '0');
    }

    function applyFontSize(size) {
      // size could be small|medium|large; map to px
      const map = { small: '14px', medium: '16px', large: '18px' };
      const px = map[size] || '16px';
      document.documentElement.style.setProperty('--base-font-size', px);
      document.body.style.fontSize = px;
      savePref('pref_font_size', size);
    }

    function applySettingsFromControls() {
      if (themeSelect) applyTheme(themeSelect.value);
      if (languageSelect) applyLanguage(languageSelect.value);
      if (reduceMotionToggle) applyReduceMotion(reduceMotionToggle.checked);
      if (fontSizeSelect) applyFontSize(fontSizeSelect.value);
    }

    // Load saved prefs on startup
    applyTheme(getPref('pref_theme', 'dark'));
    applyLanguage(getPref('pref_lang', 'en'));
    applyReduceMotion(getPref('pref_reduce_motion', '0') === '1');
    applyFontSize(getPref('pref_font_size', 'medium'));

    // Reflect saved prefs in controls
    if (themeSelect) themeSelect.value = getPref('pref_theme', 'dark');
    if (languageSelect) languageSelect.value = getPref('pref_lang', 'en');
    if (reduceMotionToggle) reduceMotionToggle.checked = getPref('pref_reduce_motion', '0') === '1';
    if (fontSizeSelect) fontSizeSelect.value = getPref('pref_font_size', 'medium');
    const accentSelect = document.getElementById('accentSelect');
    function setAccent(name){
      document.body.toggleAttribute('data-accent', false);
      if (name === 'purple') document.body.setAttribute('data-accent','purple');
      savePref('pref_accent', name);
    }
    setAccent(getPref('pref_accent','original'));
    if (accentSelect) accentSelect.value = getPref('pref_accent','original');
    accentSelect?.addEventListener('change', () => setAccent(accentSelect.value));

    // Instant apply on change
    themeSelect?.addEventListener('change', applySettingsFromControls);
    languageSelect?.addEventListener('change', applySettingsFromControls);
    reduceMotionToggle?.addEventListener('change', applySettingsFromControls);
    fontSizeSelect?.addEventListener('change', applySettingsFromControls);

    // Background theme chips
    const bgThemeOptions = document.getElementById('bgThemeOptions');
    function setBgTheme(name){
      if (!name) return;
      document.body.setAttribute('data-bg-theme', name);
      savePref('pref_bg_theme', name);
      // update active chip
      bgThemeOptions?.querySelectorAll('.bg-theme-chip').forEach(ch => ch.classList.toggle('active', ch.getAttribute('data-bg')===name));
    }
    setBgTheme(getPref('pref_bg_theme', 'galaxy'));
    bgThemeOptions?.addEventListener('click', (e) => {
      const chip = e.target.closest('.bg-theme-chip');
      if (!chip) return;
      setBgTheme(chip.getAttribute('data-bg'));
    });

    // Account: avatar upload + display name
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const displayNameInput = document.getElementById('displayName');
    function applyAccountFromStorage(){
      const name = getPref('account_display_name','');
      const avatar = getPref('account_avatar','');
      if (displayNameInput) displayNameInput.value = name;
      if (avatarPreview && avatar) avatarPreview.style.backgroundImage = `url(${avatar})`;
    }
    applyAccountFromStorage();
    displayNameInput?.addEventListener('input', () => savePref('account_display_name', displayNameInput.value));
    avatarInput?.addEventListener('change', () => {
      const file = avatarInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { savePref('account_avatar', reader.result); applyAccountFromStorage(); };
      reader.readAsDataURL(file);
    });

    // Save explicitly (also applies) and close
    settingsSave?.addEventListener('click', (e) => {
      e.preventDefault();
      applySettingsFromControls();
      closeSettings();
    });

    // Reset to defaults fast
    settingsReset?.addEventListener('click', (e) => {
      e.preventDefault();
      applyTheme('dark');
      applyLanguage('en');
      applyReduceMotion(false);
      applyFontSize('medium');
      if (themeSelect) themeSelect.value = 'dark';
      if (languageSelect) languageSelect.value = 'en';
      if (reduceMotionToggle) reduceMotionToggle.checked = false;
      if (fontSizeSelect) fontSizeSelect.value = 'medium';
    });
    // Unified dialog system (reusable simple alert/confirm)
    function ensureUnifiedDialog() {
      let dlg = document.querySelector('.unified-dialog');
      if (dlg) return dlg;
      dlg = document.createElement('div');
      dlg.className = 'unified-dialog';
      dlg.innerHTML = `
        <div class="unified-dialog-inner" role="dialog" aria-modal="true">
          <div class="unified-dialog-header">
            <div class="unified-dialog-title"></div>
            <button class="unified-dialog-close" aria-label="Close">✕</button>
          </div>
          <div class="unified-dialog-body"></div>
          <div class="unified-dialog-actions">
            <button class="btn btn-outline unified-cancel">Cancel</button>
            <button class="btn btn-primary unified-ok">OK</button>
          </div>
        </div>`;
      document.body.appendChild(dlg);
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.classList.remove('active'); });
      dlg.querySelector('.unified-dialog-close').addEventListener('click', () => dlg.classList.remove('active'));
      return dlg;
    }

    function openDialog({ title, body, okText = 'OK', cancelText = 'Cancel', onOk, onCancel }) {
      const dlg = ensureUnifiedDialog();
      dlg.querySelector('.unified-dialog-title').textContent = title || '';
      dlg.querySelector('.unified-dialog-body').textContent = body || '';
      const okBtn = dlg.querySelector('.unified-ok');
      const cancelBtn = dlg.querySelector('.unified-cancel');
      okBtn.textContent = okText;
      cancelBtn.textContent = cancelText;
      const cleanup = () => {
        okBtn.onclick = null;
        cancelBtn.onclick = null;
      };
      okBtn.onclick = () => { cleanup(); dlg.classList.remove('active'); onOk && onOk(); };
      cancelBtn.onclick = () => { cleanup(); dlg.classList.remove('active'); onCancel && onCancel(); };
      dlg.classList.add('active');
    }

    // Enhanced Registration System with Premium Features
    const registerForm = document.getElementById('registerFormContent');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openDialog({
          title: '🔒 Premium Registration Required',
          body: 'Join our premium learning platform! Choose your plan to access all courses and features.',
          okText: 'View Plans',
          cancelText: 'Cancel',
          onOk: () => {
            openDialog({
              title: '💎 Premium Plans',
              body: '🌟 FREE: Basic courses\n💜 PREMIUM ($29/mo): All courses + certificates\n🚀 PRO ($99/mo): Live sessions + mentorship',
              okText: 'Subscribe Now',
              cancelText: 'Learn More',
              onOk: () => {
                // In production, redirect to payment processor
                openDialog({
                  title: '🎉 Welcome!',
                  body: 'Redirecting to secure payment... You\'ll have access to all premium content!',
                  okText: 'Continue',
                  cancelText: null,
                  onOk: () => console.log('Redirecting to payment...')
                });
              }
            });
          }
        });
      });
    }

    // Enhanced Login with Security Features
    const loginForm = document.getElementById('loginFormContent');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (email && password) {
          openDialog({
            title: '🔐 Secure Authentication',
            body: 'Verifying credentials with enterprise-grade security...',
            okText: 'Authenticate',
            cancelText: 'Cancel',
            onOk: () => {
              // Simulate secure login process
              openDialog({
                title: '✅ Login Successful',
                body: 'Welcome back! You now have access to all your courses and progress.',
                okText: 'Enter Dashboard',
                cancelText: null,
                onOk: () => {
                  // Close auth modal and redirect to dashboard
                  const authModal = document.getElementById('authModal');
                  if (authModal) authModal.classList.remove('active');
                  console.log('Login successful - redirecting to dashboard');
                }
              });
            }
          });
        }
      });
    }
    // Video presets per course/language (replace IDs with your preferred videos)
    const courseVideoMap = {
      // Courses section
      'Full-Stack Web Development': ['fBNz5xF-Kx4','pKd0Rpw7O48','Ke90Tje7VS0'],
      'Mobile App Development': ['0-S5a0eXPoc','wIuVvCuiJhU','1hPgQWbWmEk'],
      'AI & Machine Learning': ['GwIo3gDZCVQ','aircAruvnKk','tPYj3fFJGjk'],
      'Cybersecurity Mastery': ['inWWhr5tnEA','bPVaOlJ6ln0','sSIhsd7Rr_c'],
      'Data Science & Analytics': ['ua-CiDNNj30','r-uOLxNrNk8','UjZ8FfW9QyU'],
      'Game Development': ['gB1F9G0JXOo','w9TgYbZ0Sgk','7iYWpzL9GkM'],
      // Languages section
      'python': ['rfscVS0vtbw','8DvywoWv6fI','WGJJIrtnfpk'],
      'javascript': ['PkZNo7MFNFg','W6NZfCO5SIk','jS4aFq5-91M'],
      'java': ['grEKMHGYyns','eIrMbAQSU34','xk4_1vDrzzo'],
      'cpp': ['vLnPwxZdW4Y','ZzaPdXTrSb8','8jLOx1hD3_o'],
      'csharp': ['GhQdlIFylQ8','wxznTygnRfQ','gfkTfcpWqAY']
    };

    // Resource downloads
    const resourceDownloads = document.querySelectorAll('.resource-download');
    resourceDownloads.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const resourceItem = btn.closest('.resource-item');
        const fileName = resourceItem.querySelector('span:first-of-type').textContent;
        
        // Show download notification
        openDialog({
          title: 'Download Resource',
          body: `Downloading: ${fileName}`,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            // In a real app, this would trigger the actual download
            console.log(`Downloading: ${fileName}`);
          }
        });
      });
    });

    // 1) Animated code background if not present
    if (!document.querySelector('.animated-background')) {
      const bg = document.createElement('div');
      bg.className = 'animated-background';
      bg.innerHTML = '<div class="code-rain"></div><div class="matrix-rain"></div>';
      document.body.appendChild(bg);
    }

    // 2) Add top banner if container exists/not exists
    if (!document.querySelector('.site-banner')) {
      const banner = document.createElement('div');
      banner.className = 'site-banner';
      banner.innerHTML = '<div class="site-banner-inner">Welcome! Explore courses and start learning today.</div>';
      const first = document.body.firstElementChild;
      if (first) {
        document.body.insertBefore(banner, first);
      } else {
        document.body.appendChild(banner);
      }
    }

    // Helper: url-safe param
    const enc = encodeURIComponent;

    // 3) Wire "Start Learning" button to languages page
    const startLearning = document.querySelector('.hero .btn.btn-primary');
    if (startLearning && !startLearning.hasAttribute('href')) {
      startLearning.setAttribute('href', '#languages');
    }
    if (startLearning) {
      startLearning.addEventListener('click', (e) => {
        // If it's an anchor, let it navigate; if it's a button, navigate programmatically
        if (startLearning.tagName !== 'A') {
          e.preventDefault();
          document.querySelector('#languages')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Create one reusable in-site course modal
    // Enhanced Course Modal with 3D Effects and Comprehensive Content
    let courseModal = document.querySelector('.course-modal');
    if (!courseModal) {
      courseModal = document.createElement('div');
      courseModal.className = 'course-modal';
      courseModal.innerHTML = `
        <div class="course-modal-overlay"></div>
        <div class="course-modal-inner">
          <button class="course-modal-close" aria-label="Close">✕</button>
          <div class="course-modal-header">
            <div class="course-modal-title"></div>
            <div class="course-modal-subtitle"></div>
          </div>
          <div class="course-modal-body">
            <div class="course-video-section">
              <h3>📺 Course Introduction</h3>
              <div class="course-modal-video-container">
                <iframe class="course-modal-video" src="" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
            <div class="course-content-section">
              <div class="course-modal-description"></div>
              <div class="course-modules"></div>
              <div class="course-resources"></div>
              <div class="course-additional-videos"></div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(courseModal);
    }

    const modalTitle = courseModal.querySelector('.course-modal-title');
    const modalSubtitle = courseModal.querySelector('.course-modal-subtitle');
    const modalDescription = courseModal.querySelector('.course-modal-description');
    const modalVideo = courseModal.querySelector('.course-modal-video');
    const modalModules = courseModal.querySelector('.course-modules');
    const modalResources = courseModal.querySelector('.course-resources');
    const modalAdditionalVideos = courseModal.querySelector('.course-additional-videos');
    const modalClose = courseModal.querySelector('.course-modal-close');

    // Comprehensive course data with YouTube videos and content
    const courseDatabase = {
      'Full-Stack Web Development': {
        subtitle: 'Master Modern Web Technologies',
        description: 'Learn to build complete web applications using HTML5, CSS3, JavaScript ES6+, React, Node.js, and databases. This comprehensive course covers both frontend and backend development.',
        videoId: 'PkZNo7MFNFg', // JavaScript Tutorial for Beginners
        modules: [
          { title: 'HTML5 Fundamentals', description: 'Modern HTML5 semantic elements and structure', duration: '2 hours' },
          { title: 'CSS3 & Responsive Design', description: 'Advanced CSS3 features and responsive layouts', duration: '3 hours' },
          { title: 'JavaScript ES6+', description: 'Modern JavaScript features and best practices', duration: '4 hours' },
          { title: 'React Development', description: 'Building dynamic user interfaces with React', duration: '5 hours' },
          { title: 'Node.js Backend', description: 'Server-side JavaScript development', duration: '4 hours' },
          { title: 'Database Integration', description: 'Working with MongoDB and SQL databases', duration: '3 hours' }
        ],
        resources: [
          { name: 'Complete Project Files', icon: 'fas fa-folder', type: 'download' },
          { name: 'Code Templates', icon: 'fas fa-code', type: 'download' },
          { name: 'Best Practices Guide', icon: 'fas fa-book', type: 'download' }
        ],
        additionalVideos: ['jS4aFq5-91M', 'W6NZfCO5SIk', 'DLX62G4lc44']
      },
      'Mobile App Development': {
        subtitle: 'Build Cross-Platform Mobile Apps',
        description: 'Create stunning mobile applications using React Native and Flutter. Learn to build apps that work on both iOS and Android platforms.',
        videoId: '0-S5a0eXPoc', // React Native Tutorial
        modules: [
          { title: 'React Native Basics', description: 'Setting up and understanding React Native', duration: '2 hours' },
          { title: 'Navigation & UI', description: 'Building intuitive user interfaces', duration: '3 hours' },
          { title: 'State Management', description: 'Managing app state with Redux', duration: '3 hours' },
          { title: 'API Integration', description: 'Connecting apps to backend services', duration: '2 hours' },
          { title: 'Testing & Deployment', description: 'Testing and publishing mobile apps', duration: '2 hours' }
        ],
        resources: [
          { name: 'Mobile App Templates', icon: 'fas fa-mobile-alt', type: 'download' },
          { name: 'UI Component Library', icon: 'fas fa-palette', type: 'download' },
          { name: 'Deployment Guide', icon: 'fas fa-rocket', type: 'download' }
        ],
        additionalVideos: ['m5Q2H8AZeG4', 'Y0ZqKpToTic', 'hPm0BQ2mP2U']
      },
      'AI & Machine Learning': {
        subtitle: 'Artificial Intelligence & Data Science',
        description: 'Dive into the world of artificial intelligence, machine learning, and data science. Learn to build intelligent systems and analyze data.',
        videoId: 'aircAruvnKk', // 3Blue1Brown Neural Networks
        modules: [
          { title: 'Python for AI', description: 'Python programming for data science', duration: '3 hours' },
          { title: 'Machine Learning Basics', description: 'Introduction to ML algorithms', duration: '4 hours' },
          { title: 'Deep Learning', description: 'Neural networks and deep learning', duration: '5 hours' },
          { title: 'Data Analysis', description: 'Pandas, NumPy, and data visualization', duration: '3 hours' },
          { title: 'AI Projects', description: 'Building real-world AI applications', duration: '4 hours' }
        ],
        resources: [
          { name: 'AI Project Datasets', icon: 'fas fa-database', type: 'download' },
          { name: 'ML Model Templates', icon: 'fas fa-brain', type: 'download' },
          { name: 'Python Notebooks', icon: 'fas fa-file-code', type: 'download' }
        ],
        additionalVideos: ['V1eYniJ0Rnk', 'Bxe2oD5Vw6U', 'tPYj3fFJGjk']
      },
      'Cybersecurity Mastery': {
        subtitle: 'Protect Digital Assets & Networks',
        description: 'Learn cybersecurity fundamentals, ethical hacking, and how to protect systems from threats. Master the art of digital security.',
        videoId: '3Kq1MIfTWCE', // Cybersecurity Basics
        modules: [
          { title: 'Security Fundamentals', description: 'Core cybersecurity concepts', duration: '2 hours' },
          { title: 'Network Security', description: 'Protecting network infrastructure', duration: '3 hours' },
          { title: 'Ethical Hacking', description: 'Penetration testing and vulnerability assessment', duration: '4 hours' },
          { title: 'Cryptography', description: 'Encryption and secure communications', duration: '3 hours' },
          { title: 'Incident Response', description: 'Handling security breaches', duration: '2 hours' }
        ],
        resources: [
          { name: 'Security Tools', icon: 'fas fa-shield-alt', type: 'download' },
          { name: 'Penetration Testing Lab', icon: 'fas fa-lock', type: 'download' },
          { name: 'Security Checklist', icon: 'fas fa-check-circle', type: 'download' }
        ],
        additionalVideos: ['inWWhr5tnEA', 'qiQR5rTSshw', 'LQ8GgX8tKQ0']
      },
      'Data Science & Analytics': {
        subtitle: 'Extract Insights from Data',
        description: 'Master data science techniques to extract meaningful insights from data. Learn statistical analysis, visualization, and machine learning.',
        videoId: 'ua-CiDNNj30', // Data Science Tutorial
        modules: [
          { title: 'Data Analysis with Python', description: 'Pandas, NumPy, and data manipulation', duration: '3 hours' },
          { title: 'Statistical Analysis', description: 'Statistical methods and hypothesis testing', duration: '3 hours' },
          { title: 'Data Visualization', description: 'Creating compelling data visualizations', duration: '2 hours' },
          { title: 'Machine Learning', description: 'Predictive modeling and algorithms', duration: '4 hours' },
          { title: 'Big Data Tools', description: 'Working with large datasets', duration: '3 hours' }
        ],
        resources: [
          { name: 'Dataset Collection', icon: 'fas fa-chart-bar', type: 'download' },
          { name: 'Analysis Templates', icon: 'fas fa-chart-line', type: 'download' },
          { name: 'Visualization Library', icon: 'fas fa-chart-pie', type: 'download' }
        ],
        additionalVideos: ['L3jt8fMhQKk', 'vmEHCJofslg', 'YH7Y7x5x1V4']
      },
      'Game Development': {
        subtitle: 'Create Interactive Games',
        description: 'Learn game development using Unity and C#. Build 2D and 3D games from concept to completion.',
        videoId: 'XtQMytORBmM', // Unity Game Development
        modules: [
          { title: 'Unity Basics', description: 'Getting started with Unity engine', duration: '2 hours' },
          { title: 'C# for Games', description: 'Programming game logic with C#', duration: '3 hours' },
          { title: '2D Game Development', description: 'Creating 2D games and mechanics', duration: '4 hours' },
          { title: '3D Game Development', description: 'Building 3D environments and characters', duration: '4 hours' },
          { title: 'Game Physics', description: 'Implementing realistic game physics', duration: '2 hours' }
        ],
        resources: [
          { name: 'Game Assets', icon: 'fas fa-gamepad', type: 'download' },
          { name: 'Script Templates', icon: 'fas fa-code', type: 'download' },
          { name: 'Build Settings', icon: 'fas fa-cog', type: 'download' }
        ],
        additionalVideos: ['XHh7nTj9wFE', 'pmiI8EPzx0c', 'vY2v5bwqT3Y']
      },
      'Python': {
        subtitle: 'Python Programming Mastery',
        description: 'Master Python programming from basics to advanced concepts. Learn web development, data science, and automation with Python.',
        videoId: 'kqtD5dpn9C8', // Python Tutorial for Beginners
        modules: [
          { title: 'Python Fundamentals', description: 'Variables, loops, and functions', duration: '2 hours' },
          { title: 'Object-Oriented Programming', description: 'Classes, objects, and inheritance', duration: '3 hours' },
          { title: 'Web Development', description: 'Django and Flask frameworks', duration: '4 hours' },
          { title: 'Data Science', description: 'Pandas, NumPy, and data analysis', duration: '3 hours' },
          { title: 'Automation', description: 'Scripting and automation tasks', duration: '2 hours' }
        ],
        resources: [
          { name: 'Python Projects', icon: 'fab fa-python', type: 'download' },
          { name: 'Code Examples', icon: 'fas fa-file-code', type: 'download' },
          { name: 'Best Practices', icon: 'fas fa-book', type: 'download' }
        ],
        additionalVideos: ['rfscVS0vtbw', 'f79MRyMsjrQ', 'B9fmr1TpKHE']
      },
      'JavaScript': {
        subtitle: 'Modern JavaScript Development',
        description: 'Master JavaScript ES6+, DOM manipulation, and modern web development. Build interactive websites and web applications.',
        videoId: 'PkZNo7MFNFg', // JavaScript Tutorial for Beginners
        modules: [
          { title: 'JavaScript Basics', description: 'Variables, functions, and control structures', duration: '2 hours' },
          { title: 'DOM Manipulation', description: 'Interacting with web page elements', duration: '3 hours' },
          { title: 'ES6+ Features', description: 'Modern JavaScript syntax and features', duration: '3 hours' },
          { title: 'Async Programming', description: 'Promises, async/await, and AJAX', duration: '2 hours' },
          { title: 'Node.js', description: 'Server-side JavaScript development', duration: '3 hours' }
        ],
        resources: [
          { name: 'JavaScript Projects', icon: 'fab fa-js-square', type: 'download' },
          { name: 'ES6+ Cheat Sheet', icon: 'fas fa-file-alt', type: 'download' },
          { name: 'API Integration Guide', icon: 'fas fa-link', type: 'download' }
        ],
        additionalVideos: ['W6NZfCO5SIk', 'DLX62G4lc44', 'hdI2bqOjy3c']
      },
      'Java': {
        subtitle: 'Enterprise Java Development',
        description: 'Master Java programming for enterprise applications. Learn Spring Framework, Hibernate, and advanced Java concepts.',
        videoId: 'eIrMbAQSU34', // Java Tutorial for Beginners
        modules: [
          { title: 'Java Fundamentals', description: 'Core Java concepts and syntax', duration: '3 hours' },
          { title: 'Object-Oriented Programming', description: 'Classes, inheritance, and polymorphism', duration: '3 hours' },
          { title: 'Spring Framework', description: 'Building enterprise applications', duration: '4 hours' },
          { title: 'Database Integration', description: 'Hibernate and JDBC', duration: '2 hours' },
          { title: 'Testing', description: 'Unit testing with JUnit', duration: '2 hours' }
        ],
        resources: [
          { name: 'Java Projects', icon: 'fab fa-java', type: 'download' },
          { name: 'Spring Templates', icon: 'fas fa-leaf', type: 'download' },
          { name: 'Enterprise Patterns', icon: 'fas fa-building', type: 'download' }
        ],
        additionalVideos: ['grEKMHGYyns', 'vn3tm0quoqE', 'Y4p6y7YQyMs']
      },
      'C++': {
        subtitle: 'System Programming with C++',
        description: 'Master C++ programming for system development, game programming, and high-performance applications.',
        videoId: 'vLnP7ZdR2RA', // C++ Tutorial for Beginners
        modules: [
          { title: 'C++ Basics', description: 'Variables, functions, and control structures', duration: '2 hours' },
          { title: 'Memory Management', description: 'Pointers, references, and dynamic allocation', duration: '3 hours' },
          { title: 'Object-Oriented Programming', description: 'Classes, inheritance, and polymorphism', duration: '3 hours' },
          { title: 'STL Library', description: 'Standard Template Library', duration: '2 hours' },
          { title: 'Game Development', description: 'Using SFML for game programming', duration: '3 hours' }
        ],
        resources: [
          { name: 'C++ Projects', icon: 'fas fa-code', type: 'download' },
          { name: 'STL Reference', icon: 'fas fa-book', type: 'download' },
          { name: 'Game Development Kit', icon: 'fas fa-gamepad', type: 'download' }
        ],
        additionalVideos: ['18c3MTX0PK0', 'Rub-JsjMhWY', '8jLOx1hD3_o']
      },
      'C#': {
        subtitle: 'Microsoft .NET Development',
        description: 'Master C# programming for Windows applications, web development, and game programming with Unity.',
        videoId: 'gfkTfcpWqAY', // C# Tutorial for Beginners
        modules: [
          { title: 'C# Fundamentals', description: 'Basic syntax and language features', duration: '2 hours' },
          { title: 'Object-Oriented Programming', description: 'Classes, interfaces, and inheritance', duration: '3 hours' },
          { title: '.NET Framework', description: 'Building Windows applications', duration: '3 hours' },
          { title: 'Web Development', description: 'ASP.NET MVC and Web API', duration: '3 hours' },
          { title: 'Unity Game Development', description: 'Creating games with C# and Unity', duration: '3 hours' }
        ],
        resources: [
          { name: 'C# Projects', icon: 'fas fa-hashtag', type: 'download' },
          { name: '.NET Templates', icon: 'fas fa-window-maximize', type: 'download' },
          { name: 'Unity Scripts', icon: 'fas fa-cube', type: 'download' }
        ],
        additionalVideos: ['gfkTfcpWqAY', 'p8I9p8XAiGg', 'GcFJjpMFJvI']
      }
    };

    function openCourseModal(title, desc, videosCsv) {
      const courseData = courseDatabase[title];
      
      if (courseData) {
        modalTitle.textContent = title;
        modalSubtitle.textContent = courseData.subtitle;
        modalDescription.innerHTML = `<p>${courseData.description}</p>`;
        
        if (courseData.videoId) {
          modalVideo.src = `https://www.youtube.com/embed/${courseData.videoId}`;
        }
        
        // Build modules section
        modalModules.innerHTML = '<h3>📚 Course Modules</h3>';
        courseData.modules.forEach((module, index) => {
          const moduleDiv = document.createElement('div');
          moduleDiv.className = 'module-item';
          moduleDiv.innerHTML = `
            <div class="module-number">${index + 1}</div>
            <div class="module-content">
              <h4>${module.title}</h4>
              <p>${module.description}</p>
              <div class="module-duration">⏱️ ${module.duration}</div>
            </div>
          `;
          modalModules.appendChild(moduleDiv);
        });
        
        // Build resources section
        modalResources.innerHTML = '<h3>📁 Course Resources</h3>';
        courseData.resources.forEach(resource => {
          const resourceDiv = document.createElement('div');
          resourceDiv.className = 'resource-item';
          resourceDiv.innerHTML = `
            <i class="${resource.icon}"></i>
            <span>${resource.name}</span>
            <button class="resource-download">📥 Download</button>
          `;
          modalResources.appendChild(resourceDiv);
        });
        
        // Build additional videos section
        if (courseData.additionalVideos && courseData.additionalVideos.length > 0) {
          modalAdditionalVideos.innerHTML = '<h3>🎥 Additional Learning Videos</h3>';
          courseData.additionalVideos.forEach(videoId => {
            const videoDiv = document.createElement('div');
            videoDiv.className = 'additional-video';
            videoDiv.innerHTML = `
              <iframe src="https://www.youtube.com/embed/${videoId}" 
                      frameborder="0" allowfullscreen></iframe>
            `;
            modalAdditionalVideos.appendChild(videoDiv);
          });
        }
      } else {
        // Fallback for courses not in database
        modalTitle.textContent = title || 'Course';
        modalSubtitle.textContent = 'Professional Development Course';
        modalDescription.innerHTML = `<p>${desc || 'Introduction to this course.'}</p>`;
        modalVideo.src = '';
      }
      
      // Add 3D effect to body
      document.body.classList.add('course-modal-open');
      courseModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCourseModal() {
      document.body.classList.remove('course-modal-open');
      courseModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeCourseModal);
    courseModal.addEventListener('click', (e) => {
      if (e.target === courseModal) closeCourseModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCourseModal(); });

    // 4) Ensure each course card has a working Start Course CTA (opens modal)
    const cards = document.querySelectorAll('.course-card, .language-course-card');
    cards.forEach(card => {
      // Prefer existing primary action button if present
      let btn = card.querySelector('.course-actions .btn.btn-primary');
      let actions = card.querySelector('.course-actions');

      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'course-actions';
        card.appendChild(actions);
      }

      if (!btn) {
        btn = document.createElement('a');
        btn.className = 'course-start-btn';
        btn.textContent = 'Start Course';
        actions.prepend(btn);
      } else {
        // Turn button into link if needed
        if (btn.tagName !== 'A') {
          const a = document.createElement('a');
          a.className = btn.className + ' course-start-btn';
          a.textContent = btn.textContent || 'Start Course';
          btn.replaceWith(a);
          btn = a;
        }
        btn.textContent = btn.textContent?.trim() || 'Start Course';
      }

      // derive title/desc for course detail page
      const title = (card.querySelector('.course-title, .module-title, h3, h4')?.textContent || 'Course').trim();
      const desc = (card.querySelector('.course-desc, .module-desc, p')?.textContent || 'Introduction to this course.')
        .replace(/\s+/g,' ').trim();
      // Prefer explicit data-yt="id1,id2" on the card; otherwise derive from presets
      let videos = card.getAttribute('data-yt') || '';
      if (!videos) {
        // Try exact title match
        if (courseVideoMap[title]) {
          videos = courseVideoMap[title].join(',');
        } else {
          // Try language id on languages cards
          const langKey = (card.getAttribute('data-lang') || '').toLowerCase();
          if (langKey && courseVideoMap[langKey]) {
            videos = courseVideoMap[langKey].join(',');
          }
        }
      }
      btn.setAttribute('href', '#');
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        openCourseModal(title, desc, videos);
      });

      // Add "Introduction" tag if not present
      if (!actions.querySelector('.course-tag')) {
        const tag = document.createElement('span');
        tag.className = 'course-tag tag-intro';
        tag.textContent = 'Introduction';
        tag.addEventListener('click', (ev) => {
          ev.preventDefault();
          openCourseModal(title, desc, videos);
        });
        actions.appendChild(tag);
      }
    });
  });
})();


