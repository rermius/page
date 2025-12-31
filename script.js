// Rermius Landing Page - Interactive JavaScript

// ========================================
// OS Detection
// ========================================
function detectOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();

    if (userAgent.indexOf('win') !== -1 || platform.indexOf('win') !== -1) {
        return 'windows';
    } else if (userAgent.indexOf('mac') !== -1 || platform.indexOf('mac') !== -1) {
        return 'macos';
    } else if (userAgent.indexOf('linux') !== -1 || platform.indexOf('linux') !== -1) {
        return 'linux';
    }
    return 'windows'; // default
}

function displayDetectedOS() {
    const os = detectOS();
    const detectedOsElement = document.getElementById('detected-os');

    const osNames = {
        'windows': 'Windows',
        'macos': 'macOS',
        'linux': 'Linux'
    };

    if (detectedOsElement) {
        detectedOsElement.textContent = osNames[os];
    }

    // Highlight the matching download button
    const buttons = {
        'windows': document.getElementById('btn-windows'),
        'macos': document.getElementById('btn-macos'),
        'linux': document.getElementById('btn-linux')
    };

    if (buttons[os]) {
        buttons[os].classList.add('detected');
    }

    // Set the active platform tab
    const platformTabs = document.querySelectorAll('.platform-tab');
    platformTabs.forEach(tab => {
        if (tab.dataset.platform === os) {
            setTimeout(() => {
                tab.click(); // Automatically show the detected OS installation instructions
            }, 100);
        }
    });
}

// ========================================
// GitHub Star Count
// ========================================
async function fetchGitHubStars() {
    const starCountElement = document.getElementById('star-count');

    try {
        // Replace with actual GitHub repo URL
        const response = await fetch('https://api.github.com/repos/rermius/rermius');

        if (!response.ok) {
            throw new Error('Failed to fetch star count');
        }

        const data = await response.json();
        const stars = data.stargazers_count;

        if (starCountElement) {
            starCountElement.textContent = `${stars.toLocaleString()} stars`;
        }
    } catch (error) {
        console.error('Error fetching GitHub stars:', error);
        if (starCountElement) {
            starCountElement.textContent = 'Star on GitHub';
        }
    }
}

// ========================================
// Platform Tab Switching
// ========================================
function initPlatformTabs() {
    const tabs = document.querySelectorAll('.platform-tab');
    const panels = document.querySelectorAll('.platform-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.dataset.platform;

            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            const panel = document.getElementById(`${platform}-content`);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
}

// ========================================
// Smooth Scrolling for Anchor Links
// ========================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just '#'
            if (href === '#') {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for any fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Intersection Observer for Fade-in Animations
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Observe screenshot cards and feature cards
    const elementsToAnimate = document.querySelectorAll('.screenshot-card, .feature-card, .tech-badge');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-on-scroll');
        observer.observe(el);
    });
}

// ========================================
// Screenshot Lightbox (Optional)
// ========================================
function initLightbox() {
    const screenshotCards = document.querySelectorAll('.screenshot-card');

    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img src="" alt="Screenshot preview">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Add click handlers to screenshot cards
    screenshotCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
        });
    });

    // Close lightbox handlers
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// ========================================
// Download Button Click Handlers
// ========================================
function initDownloadButtons() {
    // All download buttons redirect to GitHub releases page
    const releasesURL = 'https://github.com/rermius/rermius/releases';

    const buttons = ['btn-windows', 'btn-macos', 'btn-linux'];

    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Redirect to GitHub releases page
                window.open(releasesURL, '_blank');
            });
        }
    });
}

// ========================================
// Lazy Loading Images
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.setAttribute('data-loading', 'false');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.setAttribute('data-loading', 'true');
        imageObserver.observe(img);
    });
}

// ========================================
// Handle reduced motion preference
// ========================================
function checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Disable animations
        document.body.classList.add('reduce-motion');
    }
}

// ========================================
// Form Submission (if any)
// ========================================
function initForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission
            console.log('Form submitted');
        });
    });
}

// ========================================
// Update Download Links Dynamically
// ========================================
function updateDownloadLinks() {
    // This function can be used to fetch the latest release info from GitHub API
    // and update all download links dynamically

    const os = detectOS();
    const mainDownloadButtons = document.querySelectorAll(`#${os}-content a[href="#"]`);

    // Update hrefs with actual download links
    // This is a placeholder - replace with actual logic
    mainDownloadButtons.forEach(btn => {
        // btn.href = actualDownloadLink;
    });
}

// ========================================
// Analytics (Optional)
// ========================================
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    // Example: Google Analytics, Plausible, etc.
    console.log('Event tracked:', category, action, label);
}

// Track download button clicks
function initAnalytics() {
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.id.replace('btn-', '');
            trackEvent('Download', 'Click', platform);
        });
    });
}

// ========================================
// Initialize Everything on DOM Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rermius Landing Page Loaded');

    // Core functionality
    displayDetectedOS();
    fetchGitHubStars();
    initPlatformTabs();
    initSmoothScrolling();
    initScrollAnimations();
    initDownloadButtons();
    checkReducedMotion();

    // Optional features
    initLightbox();
    initLazyLoading();
    initForms();
    initAnalytics();
    updateDownloadLinks();

    // Add visual feedback for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
    });
});

// ========================================
// Handle Window Resize
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Handle any resize-specific logic
        console.log('Window resized');
    }, 250);
});

// ========================================
// Service Worker Registration (Optional - for PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(err => console.log('SW registration failed:', err));
    });
}

// ========================================
// Keyboard Navigation Enhancements
// ========================================
document.addEventListener('keydown', (e) => {
    // Add keyboard shortcuts if needed
    // Example: Press '?' to show help
    if (e.key === '?' && !e.target.matches('input, textarea')) {
        // Show keyboard shortcuts help
        console.log('Keyboard shortcuts:', {
            'Arrow Up': 'Scroll to top',
            'Arrow Down': 'Scroll to bottom',
            'Escape': 'Close lightbox'
        });
    }
});

// ========================================
// Copy to Clipboard (for code snippets)
// ========================================
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Copied to clipboard');
                // Show toast notification
            })
            .catch(err => console.error('Failed to copy:', err));
    }
}

// Add copy buttons to code blocks
document.querySelectorAll('code').forEach(codeBlock => {
    // You can add a copy button next to each code block
    // codeBlock.parentElement.style.position = 'relative';
    // ... add button logic
});

// ========================================
// Performance Monitoring (Optional)
// ========================================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            console.log('Performance entry:', entry);
        });
    });

    // Uncomment to monitor specific metrics
    // perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
}

// ========================================
// Export functions for testing (if needed)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        detectOS,
        fetchGitHubStars,
        copyToClipboard
    };
}