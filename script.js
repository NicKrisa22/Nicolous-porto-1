document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const scrollLinks = document.querySelectorAll(".navbar a, .btn-box a");
  const sections = document.querySelectorAll("section[id]");
  const contactForm = document.querySelector(".contact-form");
  const formMessage = document.getElementById("form-message");
  const openModalBtn = document.getElementById("open-confirm-modal");
  const modalOverlay = document.getElementById("contact-modal");
  const modalText = document.getElementById("modal-text");
  const modalActions = document.getElementById("modal-actions");

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
  // if (contactForm) {
  //   contactForm.addEventListener("submit", function (event) {
  //     event.preventDefault();

  //     if (formMessage) {
  //       formMessage.classList.remove("hidden");
  //       formMessage.textContent =
  //         "Thank you for your message! I'll get back to you soon.";

  //       setTimeout(() => {
  //         contactForm.reset();
  //         formMessage.classList.add("hidden");
  //       }, 3000);
  //     }
  //   });
  // }

  // --- 3. MODAL LOGIC (Confirmation and Success) ---

  // Function to close the modal
  const closeModal = () => {
    modalOverlay.classList.add("hidden-modal");
    modalOverlay.style.visibility = "hidden";
  };

  // Function to show success message and clear form
  const showSuccessModal = () => {
    modalOverlay.style.visibility = "visible";
    modalOverlay.classList.remove("hidden-modal");
    modalText.innerHTML = `<h4>Success!</h4><p>Your message has been securely sent. I'll review it and get back to you soon.</p>`;
    modalActions.innerHTML = `<button class="modal-btn yes" id="modal-close">Close</button>`;
    document
      .getElementById("modal-close")
      .addEventListener("click", closeModal);
    contactForm.reset();
    window.history.pushState(null, "", "/#contact");
  };

  // Function to handle the final Netlify submission via secure fetch
  const handleNetlifySubmission = () => {
    const formData = new FormData(contactForm);
    const encodedData = new URLSearchParams(formData).toString();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodedData,
    })
      .then(() => {
        showSuccessModal();
      })
      .catch((error) => {
        modalOverlay.style.visibility = "visible";
        modalOverlay.classList.remove("hidden-modal");
        modalText.innerHTML = `<h4>Error!</h4><p>Failed to send message. Please try again or email me directly.</p>`;
        modalActions.innerHTML = `<button class="modal-btn yes" id="modal-close">Close</button>`;
        document
          .getElementById("modal-close")
          .addEventListener("click", closeModal);
        console.error("Submission error:", error);
      });
  };

  const openConfirmationModal = () => {
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    modalOverlay.style.visibility = "visible";
    modalOverlay.classList.remove("hidden-modal");
    modalText.innerHTML = `
            <h4>Confirm Submission</h4>
            <p>Are you sure you want to send this message to Nicolous Krisandry?</p>
        `;
    modalActions.innerHTML = `
            <button class="modal-btn yes" id="modal-send">Yes, Send</button>
            <button class="modal-btn no" id="modal-cancel">No, Review</button>
        `;

    document.getElementById("modal-send").addEventListener("click", () => {
      closeModal();
      handleNetlifySubmission();
    });

    document
      .getElementById("modal-cancel")
      .addEventListener("click", closeModal);
  };

  if (openModalBtn) {
    openModalBtn.addEventListener("click", openConfirmationModal);
  }
});
