/**
 * WisdomAsia Website - Vanilla JavaScript Logic
 * Project: WisdomAsia Independent Research and Consulting
 * 
 * CORE FUNCTIONALITIES:
 * 1. Intersection Observer (Scrollspy) to track the active section and update navigation.
 * 2. Responsive mobile menu toggles and close-on-click interactions.
 * 3. Smooth scrolling interceptors with responsive offset calculators.
 * 4. Lucide icons instantiation and configurations.
 * 5. Elegant mockup handler for form submissions with developer instructions.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Initialise Lucide Icons ---
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // --- 2. Active Section Tracker (Scrollspy) ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observerOptions = {
    // Offset threshold to activate items comfortably when they occupy a fair portion of the screen
    root: null,
    rootMargin: "-25% 0px -55% 0px", 
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute("id");
        
        // Remove active class from all links
        navLinks.forEach((link) => {
          link.classList.remove("active");
          // Check if link matches either desktop or mobile navigation hooks
          if (link.getAttribute("href") === `#${activeId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => observer.observe(section));


  // --- 3. Responsive Mobile Menu Toggle ---
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const mobileNavLinks = document.querySelectorAll("#mobile-menu-overlay .nav-link");
  const menuIconOpen = document.getElementById("menu-icon-open");
  const menuIconClose = document.getElementById("menu-icon-close");

  const toggleMobileMenu = () => {
    const isExpanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";
    
    // Toggle state variables
    mobileMenuToggle.setAttribute("aria-expanded", !isExpanded);
    mobileMenuOverlay.classList.toggle("hidden");
    mobileMenuOverlay.classList.toggle("flex");
    
    // Toggle menu icons elegantly
    if (isExpanded) {
      // Menu was open, now closing
      menuIconOpen.classList.remove("hidden");
      menuIconClose.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    } else {
      // Menu was closed, now opening
      menuIconOpen.classList.add("hidden");
      menuIconClose.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    }
  };

  if (mobileMenuToggle && mobileMenuOverlay) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    // Auto-close overlay when clicking a navigation route
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuOverlay.classList.add("hidden");
        mobileMenuOverlay.classList.remove("flex");
        menuIconOpen.classList.remove("hidden");
        menuIconClose.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      });
    });
  }


  // --- 4. Smooth Scrolling Handler with Precise Offsets ---
  const allNavLinks = document.querySelectorAll('a[href^="#"]');
  allNavLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Compute offset spacing dynamically (e.g., sticky top offsets for small viewports)
        const isMobileHeaderSticky = window.innerWidth < 1024;
        const offset = isMobileHeaderSticky ? 80 : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
