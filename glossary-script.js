// Enhanced Financial Glossary Interactive Application
class GlossaryApp {
    constructor() {
        this.glossaryTerms = [
            {
                term: "Burn Rate",
                definition: "The rate at which a company spends its cash reserves, typically monthly, to fund operations before generating positive cash flow.",
                example: "A startup with $500,000 in cash spending $50,000 monthly has a burn rate of $50,000/month.",
                category: "Financial Metrics"
            },
            {
                term: "Cash Runway & Liquidity",
                definition: "Cash runway is the time a company can operate before running out of cash; liquidity is the ability to meet short-term obligations with available assets.",
                example: "A company with $1M in cash and a $100,000 monthly burn rate has a 10-month runway; liquid assets like cash ensure it can pay immediate bills.",
                category: "Financial Metrics"
            },
            {
                term: "DCF (Discounted Cash Flow)",
                definition: "A valuation method that estimates a company's value by discounting its future cash flows to present value.",
                example: "A firm projects $100,000 annual cash flow for 5 years; at a 10% discount rate, its present value is approximately $379,000.",
                category: "Valuation"
            },
            {
                term: "EBITDA",
                definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of a company's operating performance, excluding non-operating expenses.",
                example: "A company with $10M revenue, $6M operating expenses, and $1M depreciation has an EBITDA of $3M.",
                category: "Financial Metrics"
            },
            {
                term: "Insider Trends",
                definition: "Patterns of buying or selling company stock by insiders (e.g., executives), indicating their confidence in the company's future.",
                example: "If a CEO buys 10,000 shares of their company at $50 each, it may signal positive insider sentiment.",
                category: "Market Analysis"
            },
            {
                term: "M&A (Mergers and Acquisitions)",
                definition: "Transactions where companies combine (merge) or one acquires another to enhance growth or market share.",
                example: "Company A buys Company B for $500M to expand its product line, forming a larger entity.",
                category: "Corporate Actions"
            },
            {
                term: "MACD (Moving Average Convergence Divergence)",
                definition: "A technical indicator using moving averages to identify momentum and potential trend reversals in stock prices.",
                example: "If a stock's 12-day EMA crosses above its 26-day EMA, the MACD signals a bullish trend.",
                category: "Technical Analysis"
            },
            {
                term: "Resistance",
                definition: "A price level where a stock faces selling pressure, preventing further price increases.",
                example: "A stock repeatedly fails to break above $100, indicating $100 as a resistance level.",
                category: "Technical Analysis"
            },
            {
                term: "RSI (Relative Strength Index)",
                definition: "A momentum indicator measuring price movement speed and magnitude to assess overbought or oversold conditions.",
                example: "A stock with an RSI of 75 is considered overbought, suggesting a potential price correction.",
                category: "Technical Analysis"
            },
            {
                term: "Stop-Loss",
                definition: "An order to sell a security when it reaches a specified price to limit potential losses.",
                example: "An investor buys a stock at $50 and sets a stop-loss at $45 to cap losses at 10%.",
                category: "Risk Management"
            },
            {
                term: "Succession Plan",
                definition: "A strategy to ensure leadership continuity by identifying and preparing successors for key roles.",
                example: "A company grooms a VP to replace the retiring CEO, ensuring a smooth transition.",
                category: "Corporate Governance"
            },
            {
                term: "Support",
                definition: "A price level where a stock tends to find buying interest, preventing further price declines.",
                example: "A stock consistently bounces back from $20, indicating $20 as a support level.",
                category: "Technical Analysis"
            }
        ];
        
        this.filteredTerms = [...this.glossaryTerms];
        this.currentStudyIndex = 0;
        this.isStudyMode = false;
        this.studiedTerms = new Set();
        this.score = 0;
        this.streakCount = 0;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.renderFlashcards();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupAnimations();
    }

    setupNavigation() {
        // Mobile menu functionality
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        const navbar = document.getElementById('navbar');
        
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav && mobileMenuToggle && 
                !mobileMenuToggle.contains(e.target) && 
                !mobileNav.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });

        // Handle navigation links - allow all external navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link, .logo-text, .home-button').forEach(link => {
            const href = link.getAttribute('href');
            
            // Only prevent navigation for current glossary page
            if (href === 'glossary.html') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Scroll to top of glossary page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            
            // Close mobile menu when navigating away
            if (link.classList.contains('mobile-nav-link') && href !== 'glossary.html') {
                link.addEventListener('click', () => {
                    if (mobileMenuToggle && mobileNav) {
                        mobileMenuToggle.classList.remove('active');
                        mobileNav.classList.remove('active');
                    }
                });
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for card animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe flashcards for animation
        const cards = document.querySelectorAll('.flashcard');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    renderFlashcards() {
        const flashcardsGrid = document.getElementById('flashcardsGrid');
        if (!flashcardsGrid) return;
        
        flashcardsGrid.innerHTML = '';
        
        this.filteredTerms.forEach((term, index) => {
            const flashcard = document.createElement('div');
            flashcard.className = 'flashcard';
            flashcard.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <h3 class="flashcard-term">${term.term}</h3>
                        <span class="flashcard-category">${term.category}</span>
                    </div>
                    <div class="flashcard-back">
                        <h3 class="flashcard-term">${term.term}</h3>
                        <p class="flashcard-definition">${term.definition}</p>
                        <p class="flashcard-example"><strong>Example:</strong> ${term.example}</p>
                        <span class="flashcard-category">${term.category}</span>
                    </div>
                </div>
            `;
            
            // Add click event with animation
            flashcard.addEventListener('click', () => {
                flashcard.classList.toggle('flipped');
                this.playFlipSound();
            });
            
            flashcardsGrid.appendChild(flashcard);
        });

        // Re-setup animations for new cards
        this.setupAnimations();
    }

    setupEventListeners() {
        // Search functionality with debouncing
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterTerms(e.target.value, document.getElementById('categoryFilter')?.value || '');
                }, 300);
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterTerms(document.getElementById('searchInput')?.value || '', e.target.value);
            });
        }
        
        // Study mode controls
        const studyModeBtn = document.getElementById('studyModeBtn');
        const resetBtn = document.getElementById('resetBtn');
        const exitStudyBtn = document.getElementById('exitStudyBtn');
        
        studyModeBtn?.addEventListener('click', () => this.startStudyMode());
        resetBtn?.addEventListener('click', () => this.resetStudySession());
        exitStudyBtn?.addEventListener('click', () => this.exitStudyMode());
        
        // Study card controls
        const flipCardBtn = document.getElementById('flipCardBtn');
        const nextCardBtn = document.getElementById('nextCardBtn');
        const prevCardBtn = document.getElementById('prevCardBtn');
        const studyCard = document.getElementById('studyCard');
        
        flipCardBtn?.addEventListener('click', () => this.flipStudyCard());
        nextCardBtn?.addEventListener('click', () => this.nextStudyCard());
        prevCardBtn?.addEventListener('click', () => this.prevStudyCard());
        studyCard?.addEventListener('click', () => this.flipStudyCard());
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isStudyMode) return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.flipStudyCard();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextStudyCard();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevStudyCard();
                    break;
                case 'Escape':
                    this.exitStudyMode();
                    break;
                case 'KeyR':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.resetStudySession();
                    }
                    break;
            }
        });
    }

    filterTerms(searchTerm, category) {
        this.filteredTerms = this.glossaryTerms.filter(term => {
            const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                term.definition.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !category || term.category === category;
            return matchesSearch && matchesCategory;
        });
        
        this.renderFlashcards();
    }

    startStudyMode() {
        this.isStudyMode = true;
        this.currentStudyIndex = 0;
        this.studiedTerms.clear();
        this.score = 0;
        this.streakCount = 0;
        
        // Shuffle terms for random order
        this.shuffleArray(this.filteredTerms);
        
        // Show study mode UI
        document.getElementById('flashcardsGrid').style.display = 'none';
        document.getElementById('studyMode').style.display = 'block';
        document.getElementById('progressContainer').style.display = 'block';
        document.getElementById('studyModeBtn').style.display = 'none';
        document.getElementById('resetBtn').style.display = 'inline-block';
        
        this.updateStudyCard();
        this.updateProgress();
        this.showToast('🎯 Study mode activated! Use keyboard shortcuts for faster navigation.', 'info');
    }

    exitStudyMode() {
        this.isStudyMode = false;
        
        // Show completion stats if any terms were studied
        if (this.studiedTerms.size > 0) {
            this.showCompletionStats();
        }
        
        // Show grid UI
        document.getElementById('flashcardsGrid').style.display = 'grid';
        document.getElementById('studyMode').style.display = 'none';
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('studyModeBtn').style.display = 'inline-block';
        document.getElementById('resetBtn').style.display = 'none';
    }

    resetStudySession() {
        this.currentStudyIndex = 0;
        this.studiedTerms.clear();
        this.score = 0;
        this.streakCount = 0;
        this.shuffleArray(this.filteredTerms);
        this.updateStudyCard();
        this.updateProgress();
        this.showToast('🔄 Session reset! Starting fresh.', 'info');
    }

    updateStudyCard() {
        if (this.filteredTerms.length === 0) return;
        
        const currentTerm = this.filteredTerms[this.currentStudyIndex];
        const studyCard = document.getElementById('studyCard');
        
        if (!studyCard) return;
        
        // Reset flip state
        studyCard.classList.remove('flipped');
        
        // Update content
        const frontTerm = studyCard.querySelector('.study-card-front .study-term');
        const backTerm = studyCard.querySelector('.study-card-back .study-term');
        const definition = studyCard.querySelector('.study-definition');
        const example = studyCard.querySelector('.study-example');
        const category = studyCard.querySelector('.study-category');
        
        if (frontTerm) frontTerm.textContent = currentTerm.term;
        if (backTerm) backTerm.textContent = currentTerm.term;
        if (definition) definition.textContent = currentTerm.definition;
        if (example) example.innerHTML = `<strong>Example:</strong> ${currentTerm.example}`;
        if (category) category.textContent = currentTerm.category;
        
        // Update button states
        const prevBtn = document.getElementById('prevCardBtn');
        const nextBtn = document.getElementById('nextCardBtn');
        if (prevBtn) prevBtn.disabled = this.currentStudyIndex === 0;
        if (nextBtn) nextBtn.disabled = this.currentStudyIndex === this.filteredTerms.length - 1;
    }

    flipStudyCard() {
        const studyCard = document.getElementById('studyCard');
        if (!studyCard) return;
        
        const wasFlipped = studyCard.classList.contains('flipped');
        studyCard.classList.toggle('flipped');
        
        // Play sound and update score when flipped to see definition
        if (!wasFlipped) {
            this.playFlipSound();
            this.studiedTerms.add(this.currentStudyIndex);
            this.updateScore();
            this.updateProgress();
        }
    }

    nextStudyCard() {
        if (this.currentStudyIndex < this.filteredTerms.length - 1) {
            this.currentStudyIndex++;
            this.updateStudyCard();
            this.updateProgress();
            this.playNavigationSound();
        } else {
            this.showToast('🎉 You\'ve reached the last card!', 'success');
        }
    }

    prevStudyCard() {
        if (this.currentStudyIndex > 0) {
            this.currentStudyIndex--;
            this.updateStudyCard();
            this.updateProgress();
            this.playNavigationSound();
        }
    }

    updateProgress() {
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');
        const studyStats = document.getElementById('studyStats');
        
        if (!progressText || !progressFill || !studyStats) return;
        
        const currentCard = this.currentStudyIndex + 1;
        const totalCards = this.filteredTerms.length;
        const studiedCount = this.studiedTerms.size;
        
        progressText.textContent = `Card: ${currentCard}/${totalCards}`;
        studyStats.innerHTML = `Studied: ${studiedCount}/${totalCards} | Score: ${this.score} | Streak: ${this.streakCount}`;
        
        const progressPercentage = totalCards > 0 ? (studiedCount / totalCards) * 100 : 0;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Check for achievements
        this.checkAchievements(studiedCount, totalCards);
    }

    updateScore() {
        this.score += 10;
        this.streakCount++;
        
        if (this.streakCount % 5 === 0) {
            this.showAchievement(`🔥 ${this.streakCount} Card Streak!`);
        }
    }

    checkAchievements(studiedCount, totalCards) {
        const percentage = (studiedCount / totalCards) * 100;
        
        if (percentage === 25 && !this.achievements?.quarter) {
            this.showAchievement('🏆 Quarter Master!');
            this.achievements = { ...this.achievements, quarter: true };
        } else if (percentage === 50 && !this.achievements?.half) {
            this.showAchievement('🎯 Halfway Hero!');
            this.achievements = { ...this.achievements, half: true };
        } else if (percentage === 75 && !this.achievements?.three_quarter) {
            this.showAchievement('⭐ Almost There!');
            this.achievements = { ...this.achievements, three_quarter: true };
        } else if (percentage === 100 && !this.achievements?.complete) {
            this.showAchievement('🎉 Master Completed!');
            this.achievements = { ...this.achievements, complete: true };
        }
    }

    showAchievement(message) {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.textContent = message;
        
        document.body.appendChild(badge);
        
        // Position the badge
        badge.style.position = 'fixed';
        badge.style.top = '50%';
        badge.style.left = '50%';
        badge.style.transform = 'translate(-50%, -50%)';
        badge.style.zIndex = '10000';
        
        setTimeout(() => {
            badge.remove();
        }, 3000);
    }

    showCompletionStats() {
        const studiedCount = this.studiedTerms.size;
        const totalCards = this.filteredTerms.length;
        const percentage = Math.round((studiedCount / totalCards) * 100);
        
        this.showToast(
            `📊 Session Complete! You studied ${studiedCount}/${totalCards} cards (${percentage}%). Final score: ${this.score}`,
            'success',
            5000
        );
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Sound effects (using Web Audio API)
    playFlipSound() {
        this.playTone(800, 0.1, 'sine');
    }

    playNavigationSound() {
        this.playTone(600, 0.05, 'square');
    }

    playTone(frequency, duration, type = 'sine') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Fail silently if audio context is not supported
        }
    }

    // Toast notification system
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
}

// Initialize the glossary application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GlossaryApp();
    
    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
