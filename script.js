// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
  });

  function updateThemeButton(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
});

// Smooth Scroll (for modern browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
  
  // Change navbar background on scroll
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

// Project Category Filtering
document.addEventListener('DOMContentLoaded', () => {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const projectItems = document.querySelectorAll('.project-item');
  const firstProject = document.querySelector('.project-list li:first-child');
  const remainingProjects = document.querySelectorAll('.remaining-projects .project-item');

  // Show all projects initially
  projectItems.forEach(item => item.classList.add('show'));

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const category = button.getAttribute('data-category');

      // Handle the first project (Egypt Climate Change) separately
      if (category === 'all' || firstProject.classList.contains(category)) {
        firstProject.classList.add('show');
      } else {
        firstProject.classList.remove('show');
      }

      // Handle remaining projects
      remainingProjects.forEach(item => {
        if (category === 'all') {
          item.classList.add('show');
        } else {
          if (item.classList.contains(category)) {
            item.classList.add('show');
          } else {
            item.classList.remove('show');
          }
        }
      });
    });
  });
});

// Image Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(slider => {
    const slides = slider.querySelector('.slides');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const images = slides.querySelectorAll('img');
    let currentSlide = 0;

    // Set initial position
    updateSlidePosition();

    function updateSlidePosition() {
      slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % images.length;
      updateSlidePosition();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + images.length) % images.length;
      updateSlidePosition();
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  });
});

// Neural Network Animation
class Neuron {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Initialize with random velocity for movement
    this.vx = (Math.random() - 0.5) * 1.5; // Reduced from 1.8 to 1.5
    this.vy = (Math.random() - 0.5) * 1.5; // Reduced from 1.8 to 1.5
    this.connections = [];
    this.maxSpeed = 1.0; // Reduced from 1.3 to 1.0
    this.size = Math.random() * 2 + 2; // Reduced from 4+4 to 2+2 (half size)
    this.pulseSize = 0;
    this.pulseSpeed = 0.03 + Math.random() * 0.02;
    this.hue = Math.random() * 60 - 30; // Wider color variation
    this.glowSize = Math.random() * 3 + 2.5; // Reduced from 6+5 to 3+2.5 (half glow size)
    this.directionChange = 0;
    this.directionChangeTimer = 0;
    this.currentDirection = Math.floor(Math.random() * 4);
    this.connectionColor = `hsl(${200 + this.hue}, 70%, 60%)`; // Blue-based colors
  }

  update(width, height) {
    // Update position with velocity
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounce off edges
    if (this.x <= 0 || this.x >= width) {
      this.vx = -this.vx;
      this.x = Math.max(0, Math.min(width, this.x));
    }
    if (this.y <= 0 || this.y >= height) {
      this.vy = -this.vy;
      this.y = Math.max(0, Math.min(height, this.y));
    }
    
    // Add some random movement
    this.vx += (Math.random() - 0.5) * 0.05; // Reduced from 0.08 to 0.05
    this.vy += (Math.random() - 0.5) * 0.05; // Reduced from 0.08 to 0.05
    
    // Limit speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
    
    // Update pulse
    this.pulseSize += this.pulseSpeed;
    if (this.pulseSize > Math.PI * 2) {
      this.pulseSize = 0;
    }
  }

  connect(neuron) {
    this.connections.push(neuron);
  }
}

class NeuralNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.neurons = [];
    this.visitCount = 0;
    this.lastVisitTime = 0;
    
    this.init();
    this.setupEventListeners();
    this.animate();
    this.initVisitCounter();
  }

  initVisitCounter() {
    // Load existing visit count from localStorage
    const storedCount = localStorage.getItem('visitCount');
    this.visitCount = storedCount ? parseInt(storedCount) : 0;
    
    // Check if this is a new session (not just a page refresh)
    const lastVisit = localStorage.getItem('lastVisitTime');
    const now = Date.now();
    
    // If it's been more than 30 minutes since last visit, count as new visit
    if (!lastVisit || (now - parseInt(lastVisit)) > 30 * 60 * 1000) {
      this.visitCount++;
      localStorage.setItem('visitCount', this.visitCount.toString());
    }
    
    // Update last visit time
    localStorage.setItem('lastVisitTime', now.toString());
    
    // Update display
    this.updateVisitDisplay();
  }

  updateVisitDisplay() {
    const visitCountElement = document.getElementById('visitCount');
    if (visitCountElement) {
      visitCountElement.textContent = this.visitCount.toLocaleString();
      
      // Add a subtle animation when the count updates
      visitCountElement.style.transform = 'scale(1.1)';
      setTimeout(() => {
        visitCountElement.style.transform = 'scale(1)';
      }, 200);
    }
  }

  getVisitCount() {
    return this.visitCount;
  }

  init() {
    this.resize();
    this.createNeurons();
    this.updateVisitDisplay();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createNeurons() {
    this.neurons = [];
    const numNeurons = Math.floor((this.canvas.width * this.canvas.height) / 50000);
    
    for (let i = 0; i < numNeurons; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.neurons.push(new Neuron(x, y));
    }
    
    // Create connections between nearby neurons
    for (let i = 0; i < this.neurons.length; i++) {
      for (let j = i + 1; j < this.neurons.length; j++) {
        const distance = Math.sqrt(
          Math.pow(this.neurons[i].x - this.neurons[j].x, 2) +
          Math.pow(this.neurons[i].y - this.neurons[j].y, 2)
        );
        
        if (distance < 150) { // Connection distance
          this.neurons[i].connect(this.neurons[j]);
        }
      }
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createNeurons();
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections with increased opacity and colors
    this.ctx.lineWidth = 2.5; // Increased from 1.5 to 2.5 (thicker lines)
    this.ctx.globalAlpha = 0.8; // Increased from 0.7 to 0.8
    
    for (let neuron of this.neurons) {
      for (let connection of neuron.connections) {
        const distance = Math.sqrt(
          Math.pow(neuron.x - connection.x, 2) +
          Math.pow(neuron.y - connection.y, 2)
        );
        
        const opacity = Math.max(0.2, 1 - distance / 150); // Increased minimum opacity from 0.1 to 0.2
        this.ctx.strokeStyle = neuron.connectionColor;
        this.ctx.globalAlpha = opacity * 1.0; // Increased to full opacity
        
        this.ctx.beginPath();
        this.ctx.moveTo(neuron.x, neuron.y);
        this.ctx.lineTo(connection.x, connection.y);
        this.ctx.stroke();
      }
    }
    
    // Draw neurons with maximum visibility
    this.ctx.globalAlpha = 1.0; // Full opacity
    
    for (let neuron of this.neurons) {
      // Draw outer glow effect (larger and brighter)
      const outerGlowGradient = this.ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, neuron.glowSize * 3
      );
      outerGlowGradient.addColorStop(0, `hsla(${200 + neuron.hue}, 70%, 70%, 0.8)`); // Brighter and more opaque
      outerGlowGradient.addColorStop(0.5, `hsla(${200 + neuron.hue}, 70%, 60%, 0.4)`);
      outerGlowGradient.addColorStop(1, `hsla(${200 + neuron.hue}, 70%, 60%, 0)`);
      
      this.ctx.fillStyle = outerGlowGradient;
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, neuron.glowSize * 3, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw inner glow effect
      const glowGradient = this.ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, neuron.glowSize * 2
      );
      glowGradient.addColorStop(0, `hsla(${200 + neuron.hue}, 70%, 80%, 1.0)`); // Maximum brightness
      glowGradient.addColorStop(1, `hsla(${200 + neuron.hue}, 70%, 60%, 0)`);
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, neuron.glowSize * 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw neuron core (larger and brighter)
      const pulseEffect = Math.sin(neuron.pulseSize) * 0.8 + 1.2; // Increased pulse effect
      const currentSize = neuron.size * pulseEffect;
      
      this.ctx.fillStyle = `hsl(${200 + neuron.hue}, 70%, 80%)`; // Brighter color
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, currentSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw inner core (brightest part)
      this.ctx.fillStyle = `hsl(${200 + neuron.hue}, 70%, 95%)`; // Almost white center
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, currentSize * 0.7, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw highlight
      this.ctx.fillStyle = `hsla(${200 + neuron.hue}, 70%, 100%, 0.9)`; // White highlight
      this.ctx.beginPath();
      this.ctx.arc(neuron.x - currentSize * 0.3, neuron.y - currentSize * 0.3, currentSize * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  animate() {
    // Update neuron positions
    for (let neuron of this.neurons) {
      neuron.update(this.canvas.width, this.canvas.height);
    }
    
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize Neural Network
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('neuralCanvas');
  new NeuralNetwork(canvas);
});

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  // Form validation and submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Reset error states
    resetErrors();
    
    // Validate fields
    let hasErrors = false;
    
    if (name === '') {
      showError(nameInput, nameError);
      hasErrors = true;
    }
    
    if (email === '') {
      showError(emailInput, emailError);
      hasErrors = true;
    }
    
    if (message === '') {
      showError(messageInput, messageError);
      hasErrors = true;
    }
    
    // If no errors, send email
    if (!hasErrors) {
      sendEmail(name, email, message);
    }
  });

  // Real-time validation
  nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim() === '') {
      showError(nameInput, nameError);
    } else {
      hideError(nameInput, nameError);
    }
  });

  emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim() === '') {
      showError(emailInput, emailError);
    } else {
      hideError(emailInput, emailError);
    }
  });

  messageInput.addEventListener('blur', () => {
    if (messageInput.value.trim() === '') {
      showError(messageInput, messageError);
    } else {
      hideError(messageInput, messageError);
    }
  });

  // Clear errors on input
  nameInput.addEventListener('input', () => hideError(nameInput, nameError));
  emailInput.addEventListener('input', () => hideError(emailInput, emailError));
  messageInput.addEventListener('input', () => hideError(messageInput, messageError));

  function showError(input, errorElement) {
    input.classList.add('error');
    errorElement.classList.add('show');
  }

  function hideError(input, errorElement) {
    input.classList.remove('error');
    errorElement.classList.remove('show');
  }

  function resetErrors() {
    hideError(nameInput, nameError);
    hideError(emailInput, emailError);
    hideError(messageInput, messageError);
  }

  function sendEmail(name, email, message) {
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    const templateParams = {
      to_email: 'ahmed.a.a.labib@gmail.com',
      from_name: name,
      from_email: email,
      message: message,
      reply_to: email
    };

    // Send email using EmailJS
     emailjs.send('service_7m9j37q', 'template_q6n6h9s', templateParams, 'iFFCXxiXnui-bGUbE')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        
        // Show success message
        showSuccessMessage();
        
        // Clear form
        contactForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      })
      .catch((error) => {
        console.log('FAILED...', error);
        
        // Show error message
        showErrorMessage();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  }

  function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>Message sent successfully! I'll get back to you soon.</span>
    `;
    
    contactForm.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  function showErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-global';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>Failed to send message. Please try again or contact me directly.</span>
    `;
    
    contactForm.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
});

// You can add JavaScript functionality here
console.log("Portfolio script loaded");
