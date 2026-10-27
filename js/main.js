// ===== Company details — edit these once, they update on every page =====
const COMPANY = {
  name: "Maslom International",                            // Short name shown next to the logo
  nameSuffix: "PTY LTD",                                   // Small line under the name
  fullName: "Maslom International Pty Ltd",                // Full legal name used in page text
  abn: "19 128 284 864",                                   // Australian Business Number
  acn: "128 284 864",                                      // Australian Company Number
  companyType: "Australian proprietary company",
  registeredDate: "1 November 2007",
  state: "Victoria (VIC)",
  logo: "images/logo-mark.png",                            // Shield mark (header, footer, favicon). Full lockup: images/logo.png
  email: "info@maslominternational.com",
  address: "123 Sample Street, Suite 100, Sample City, ST 00000" // SAMPLE: replace with the real address
};
// Fine print shown under the footer description
const nb = s => s.replace(/ /g, String.fromCharCode(160)); // keep ABN/ACN numbers on one line
COMPANY.registration = `${COMPANY.fullName} · ABN ${nb(COMPANY.abn)} · ACN ${nb(COMPANY.acn)}. ${COMPANY.companyType}, registered in ${COMPANY.state} on ${COMPANY.registeredDate}.`;

const NAV = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About Us" },
  { href: "services.html", label: "Services" },
  { href: "contact.html", label: "Contact" }
];

const currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();

const brandHtml = `
  <a class="brand" href="index.html">
    <img class="brand-mark" src="${COMPANY.logo}" alt="" width="38" height="38">
    <div class="brand-text">
      <span class="brand-name">${COMPANY.name}</span>
      ${COMPANY.nameSuffix ? `<span class="brand-sub">${COMPANY.nameSuffix}</span>` : ""}
    </div>
  </a>`;

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.className = "site-header";
  el.innerHTML = `
    <div class="container nav">
      ${brandHtml}
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      <nav class="nav-links">
        ${NAV.map(n => `<a href="${n.href}" class="${n.href === currentPage ? "active" : ""}">${n.label}</a>`).join("")}
        <a class="btn btn-primary btn-sm" href="contact.html">Start an Enquiry <i class="fa-solid fa-arrow-right"></i></a>
      </nav>
    </div>`;

  const toggle = el.querySelector(".nav-toggle");
  const links = el.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = `<i class="fa-solid ${open ? "fa-xmark" : "fa-bars"}"></i>`;
  });

  const onScroll = () => el.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.className = "site-footer";
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          ${brandHtml}
          <p>${COMPANY.fullName} provides professional escrow services for businesses, buyers, sellers, and transaction partners. We help protect funds and documents until agreed conditions are met, giving every party clearer, safer completion.</p>
          ${COMPANY.registration ? `<p class="fine">${COMPANY.registration}</p>` : ""}
        </div>
        <div>
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="services.html#business">Business Escrow</a></li>
            <li><a href="services.html#payment">Payment Escrow</a></li>
            <li><a href="services.html#document">Document Escrow</a></li>
            <li><a href="services.html#milestone">Milestone Escrow</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Us</h4>
          <ul class="footer-contact">
            <li><i class="fa-solid fa-location-dot"></i><span>${COMPANY.address}</span></li>
            <li><i class="fa-solid fa-envelope"></i><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${COMPANY.fullName}. All rights reserved.</span>
        <nav aria-label="Legal">
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms &amp; Conditions</a>
        </nav>
      </div>
    </div>`;
}

// Fill any element marked with data-company="<any COMPANY key>", e.g. email, address, fullName, abn, acn
function fillCompanyDetails() {
  document.querySelectorAll("[data-company]").forEach(el => {
    const value = COMPANY[el.dataset.company];
    if (!value) {
      const wrapper = el.closest("[data-optional]");
      if (wrapper) wrapper.remove();
      return;
    }
    el.textContent = value;
    if (el.tagName === "A" && el.dataset.company === "email") el.href = `mailto:${value}`;
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(i => i.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("visible");
        // Drop the stagger delay once revealed so hover effects respond instantly
        setTimeout(() => { el.style.transitionDelay = ""; }, 1200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(i => {
    // Stagger siblings (e.g. cards in a grid) so they cascade in
    const siblings = [...i.parentElement.children].filter(c => c.classList.contains("reveal"));
    i.style.transitionDelay = `${Math.min(siblings.indexOf(i), 5) * 80}ms`;
    observer.observe(i);
  });
}

// Contact form: opens the visitor's email app with the enquiry pre-filled.
// Swap this for a form backend (e.g. Formspree, your own API) when you go live.
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = `Enquiry: ${data.get("service")} — ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "-"}`,
      `Service: ${data.get("service")}`,
      "",
      data.get("message")
    ].join("\n");
    location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById("form-status").classList.add("show");
  });
}

renderHeader();
renderFooter();
fillCompanyDetails();
initReveal();
initContactForm();
