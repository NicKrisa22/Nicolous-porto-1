document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const scrollLinks = document.querySelectorAll(".navbar a, .btn-box a");
  const sections = document.querySelectorAll("section[id]");
  const contactForm = document.querySelector(".contact-form");
  const formMessage = document.getElementById("form-message");

  // --- 1. SCROLL SPY & HEADER BACKGROUND ---
  const setActiveLink = () => {
    let currentSectionId = "";
    const scrollThreshold = window.scrollY + 150;

    sections.forEach((section) => {
      if (
        scrollThreshold >= section.offsetTop &&
        scrollThreshold < section.offsetTop + section.offsetHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Highlight the correct link in the NAVBAR only
    document.querySelectorAll(".navbar a").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });

    // Handle sticky header background change
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  if (header) {
    window.addEventListener("scroll", setActiveLink);
    setActiveLink();
  } else {
    console.error("Header element not found. Scroll effect disabled.");
  }

  // --- 2. SMOOTH SCROLLING FOR ALL BUTTONS/LINKS ---
  scrollLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      // Check if the link has an internal hash starting with #
      const targetId = this.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      event.preventDefault();

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // If it's a navbar link, handle the active class immediately
        if (this.closest(".navbar")) {
          document
            .querySelectorAll(".navbar a")
            .forEach((l) => l.classList.remove("active"));
          this.classList.add("active");
        }

        // Use smooth scroll
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // --- 3. CONTACT FORM SUBMISSION HANDLING ---
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (formMessage) {
        formMessage.classList.remove("hidden");
        formMessage.textContent =
          "Thank you for your message! I'll get back to you soon.";

        setTimeout(() => {
          contactForm.reset();
          formMessage.classList.add("hidden");
        }, 3000);
      }
    });
  }
});
