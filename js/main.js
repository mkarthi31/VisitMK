
document.addEventListener("DOMContentLoaded", function () {
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  // DARK MODE
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark");

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }

  // MODIFIED NAVIGATION MENU FOR LOGGED IN USERS
  const nav = document.querySelector("nav");
  if (loggedIn && nav) {
    
    const signInLink = document.querySelector(".signin-btn");
    if (signInLink) {
      signInLink.textContent = "Log Out";
      signInLink.href = "#";
      signInLink.addEventListener("click", () => {
        localStorage.removeItem("loggedIn");
        location.reload();
      });
    }

    document.querySelectorAll(".logged-in-only").forEach(el => el.style.display = "inline-block");
  }

  // LOGIN FORM
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      let valid = true;

      document.getElementById("emailError").textContent = "";
      document.getElementById("passwordError").textContent = "";
      document.getElementById("loginSuccess").textContent = "";

      if (!email.includes("@")) {
        document.getElementById("emailError").textContent = "Invalid email.";
        valid = false;
      }

      if (password.length < 6) {
        document.getElementById("passwordError").textContent = "Password must be at least 6 characters.";
        valid = false;
      }

      if (valid) {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("loginSuccess").textContent = "Login successful (simulated)";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      }
    });
  }

  // SIGNUP FORM
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const fname = document.getElementById("fname").value.trim();
      const lname = document.getElementById("lname").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
      const confirm = document.getElementById("confirmPassword").value.trim();

      let valid = true;

      ["fnameError", "lnameError", "signupEmailError", "signupPasswordError", "confirmPasswordError", "signupSuccess"]
        .forEach(id => document.getElementById(id).textContent = "");

      if (fname === "") {
        document.getElementById("fnameError").textContent = "First name is required.";
        valid = false;
      }

      if (lname === "") {
        document.getElementById("lnameError").textContent = "Last name is required.";
        valid = false;
      }

      if (!email.includes("@")) {
        document.getElementById("signupEmailError").textContent = "Invalid email address.";
        valid = false;
      }

      if (password.length < 6) {
        document.getElementById("signupPasswordError").textContent = "Password must be at least 6 characters.";
        valid = false;
      }

      if (password !== confirm) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        valid = false;
      }

      if (valid) {
        document.getElementById("signupSuccess").textContent = "Signup successful (simulated)";
      }
    });
  }

  // PLAN MY TOUR
  const planForm = document.getElementById("planForm");
  if (planForm) {
    planForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const arrivalDate = document.getElementById("arrivalDate").value;
      const days = parseInt(document.getElementById("days").value);
      const withKids = document.getElementById("withKids").value;
      const eventType = document.getElementById("eventType").value;
      const planBox = document.getElementById("planResult");
      const generatedPlan = document.getElementById("generatedPlan");

      document.getElementById("arrivalError").textContent = "";

      if (!arrivalDate) {
        document.getElementById("arrivalError").textContent = "Please select a valid arrival date.";
        return;
      }

      let planHTML = "";
      const baseDate = new Date(arrivalDate);

      for (let i = 0; i < days; i++) {
        const dayDate = new Date(baseDate);
        dayDate.setDate(baseDate.getDate() + i);
        const ddmmyy = `${dayDate.getDate().toString().padStart(2, "0")}/${(dayDate.getMonth() + 1).toString().padStart(2, "0")}/${dayDate.getFullYear()}`;

        planHTML += `
          <div class="plan-day">
            <strong>Day ${i + 1} - ${ddmmyy}</strong>
            <ul>
              <li>Morning: Visit ${eventType} location</li>
              <li>Afternoon: Free local event in MK</li>
              ${withKids === "yes" ? "<li>Evening: Family friendly show</li>" : "<li>Evening: Live music or pub visit</li>"}
            </ul>
          </div>
        `;
      }

      generatedPlan.innerHTML = planHTML;
      planBox.style.display = "block";
    });
  }

  // EDIT BOOKINGS
  const editForm = document.getElementById("editForm");
  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newDate = document.getElementById("editDate").value;
      const newTickets = document.getElementById("editTickets").value;

      if (!newDate || newTickets < 1) return;

      const card = document.getElementById(currentBookingId);
      const pTags = card.getElementsByTagName("p");
      pTags[0].innerHTML = `<strong>Date:</strong> ${newDate}`;
      pTags[1].innerHTML = `<strong>Tickets:</strong> ${newTickets}`;

      document.getElementById("editSuccess").textContent = "Changes saved (simulated)";
    });
  }

  // CAROUSEL LOGIC
  const carouselImages = document.querySelectorAll(".carousel-image");
  const dotsContainer = document.querySelector(".carousel-dots");
  let carouselIndex = 0;

  if (carouselImages.length && dotsContainer) {
    carouselImages.forEach((img, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => showSlide(i));
      dotsContainer.appendChild(dot);
    });

    function showSlide(index) {
      carouselImages.forEach((img, i) => img.style.display = i === index ? "block" : "none");
      document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
      carouselIndex = index;
    }

    showSlide(carouselIndex);
    setInterval(() => {
      carouselIndex = (carouselIndex + 1) % carouselImages.length;
      showSlide(carouselIndex);
    }, 3000);
  }
});

// GLOBAL BOOKING STATE
let isPaidEvent = false;
let currentBookingId = "";

// BOOKING MODAL
function openBooking(eventName, paid = false) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  if (!isLoggedIn) {
    alert("Please sign in to book events.");
    return;
  }

  isPaidEvent = paid;
  document.getElementById("eventTitle").textContent = `Book: ${eventName}`;
  document.getElementById("bookingModal").style.display = "block";

  const paymentSection = document.getElementById("paymentFields");
  if (paymentSection) {
    paymentSection.style.display = isPaidEvent ? "block" : "none";
  }
}

function closeBooking() {
  document.getElementById("bookingModal").style.display = "none";
  document.getElementById("bookingForm").reset();
  ["dateError", "ticketError", "cardError", "bookingSuccess"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

function editBooking(bookingId) {
  currentBookingId = bookingId;
  document.getElementById("editModal").style.display = "block";
  document.getElementById("editForm").reset();
  document.getElementById("editSuccess").textContent = "";
}

function closeEdit() {
  document.getElementById("editModal").style.display = "none";
}

function cancelBooking(bookingId) {
  const card = document.getElementById(bookingId);
  card.innerHTML = `<p>Your booking has been cancelled and a refund will be processed within 72 hours.</p>`;
}
