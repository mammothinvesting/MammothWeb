# Mammoth Investing Inc - HTML/CSS Version

A complete HTML/CSS/JavaScript conversion of the Mammoth Investing Inc React application. This is a modern, responsive website for an AI-powered stock market analysis platform.

## 🚀 Features

### Core Functionality
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Navigation**: Smooth scrolling navigation with mobile menu
- **Contact Form**: Functional contact form with EmailJS integration
- **Toast Notifications**: User-friendly notification system
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### Sections
1. **Hero Section**: Video background with call-to-action
2. **Features Section**: AI-powered features showcase
3. **About Section**: Company mission, values, and founder story
4. **Contact Section**: Contact form and company information
5. **Footer**: Social links and legal information

## 📁 File Structure

```
├── index.html          # Main HTML file
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- A modern web browser
- Basic understanding of HTML/CSS/JavaScript
- EmailJS account (for contact form functionality)

### Installation

1. **Clone or Download**
   ```bash
   # If using git
   git clone <repository-url>
   
   # Or simply download the files
   ```

2. **Open the Website**
   - Double-click `index.html` to open in your browser
   - Or serve using a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **EmailJS Setup** (Optional - for contact form)
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Create a service and template
   - Update the EmailJS configuration in `script.js`:
     ```javascript
     const EMAILJS_SERVICE_ID = "your_service_id";
     const EMAILJS_TEMPLATE_ID = "your_template_id";
     const EMAILJS_PUBLIC_KEY = "your_public_key";
     ```

## 🎨 Customization

### Colors
The website uses a modern color palette defined in CSS variables. You can customize colors by modifying the CSS:

```css
:root {
    --primary: #1f2937;
    --secondary: #6b7280;
    --accent: #374151;
    --background: #ffffff;
    --text: #333333;
}
```

### Content
- **Company Information**: Update text content in `index.html`
- **Images**: Replace image paths with your own assets
- **Contact Details**: Update contact information in the footer and contact section

### Styling
- **Typography**: Uses Space Grotesk font family
- **Layout**: CSS Grid and Flexbox for responsive layouts
- **Animations**: CSS transitions and keyframe animations

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+ (with some limitations)

## 🚀 Performance Features

- **Optimized Images**: Responsive images with proper sizing
- **Lazy Loading**: Images load as needed
- **Debounced Scroll**: Performance-optimized scroll handling
- **Minimal Dependencies**: Only EmailJS for contact form functionality

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators
- **Skip Links**: Skip to main content functionality
- **Color Contrast**: WCAG AA compliant color ratios

## 📧 Contact Form

The contact form includes:
- Form validation (client-side)
- EmailJS integration
- Loading states
- Success/error notifications
- Spam protection

## 🎯 SEO Features

- **Meta Tags**: Complete Open Graph and Twitter Card meta tags
- **Semantic HTML**: Proper heading hierarchy and structure
- **Alt Text**: Descriptive alt text for images
- **Structured Data**: Ready for schema markup implementation

## 🔒 Security Considerations

- **EmailJS**: Secure email handling through EmailJS service
- **Form Validation**: Client-side validation with server-side capability
- **XSS Protection**: Proper input sanitization
- **HTTPS Ready**: All external resources support HTTPS

## 📈 Analytics Ready

The website is prepared for analytics integration:
- Google Analytics
- Facebook Pixel
- Custom event tracking
- Conversion tracking

## 🛠️ Development

### Adding New Sections
1. Add HTML structure to `index.html`
2. Add CSS styles to `styles.css`
3. Add JavaScript functionality to `script.js` if needed

### Modifying Styles
- Use CSS custom properties for consistent theming
- Follow the existing naming conventions
- Test across all breakpoints

### Adding Functionality
- Follow the existing JavaScript patterns
- Use event delegation where appropriate
- Maintain accessibility standards

## 📄 License

This project is for educational and commercial use. Please ensure you have the rights to use any included assets.

## 🤝 Support

For questions or support:
- Check the code comments for implementation details
- Review the browser console for any errors
- Ensure all files are in the same directory
- Verify EmailJS configuration if using contact form

## 🔄 Updates

To keep the website current:
- Regularly update dependencies
- Monitor browser compatibility
- Test on various devices and browsers
- Update content and images as needed

---

**Mammoth Investing Inc** - Empowering investors with AI-powered stock market insights.
