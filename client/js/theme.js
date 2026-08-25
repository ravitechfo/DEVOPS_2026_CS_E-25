// Smart Campus Theme Manager (Light / Dark Mode)
const ThemeManager = {
  STORAGE_KEY: 'smart_campus_theme',

  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    this.applyTheme(currentTheme);
    
    // Listen for system theme changes if user hasn't explicitly set preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Attach listeners on DOM ready to update any toggle buttons
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.updateUI());
    } else {
      this.updateUI();
    }
  },

  getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateUI();
  },

  toggle() {
    const current = this.getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    if (typeof showToast === 'function') {
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    }
  },

  updateUI() {
    const isDark = this.getTheme() === 'dark';
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    
    buttons.forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.innerHTML = isDark 
        ? `<span class="theme-icon">☀️</span> <span class="theme-label">Light</span>`
        : `<span class="theme-icon">🌙</span> <span class="theme-label">Dark</span>`;
    });
  }
};

// Immediate initialization before paint to prevent flashing
ThemeManager.init();
