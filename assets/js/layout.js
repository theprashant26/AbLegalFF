/* =====================================================================
   Shared layout: top bar, header, mobile menu, search, footer,
   disclaimer and floating buttons — rendered on every page.
   ===================================================================== */
(function () {
  const F = AIL.firm;
  const page = document.body.dataset.page || "";
  const on = (p) => (Array.isArray(p) ? p.includes(page) : p === page) ? "active" : "";

  const TOP = `
  <div class="topbar">
    <div class="lb-container">
      <div class="topbar__info">
        <span><i class="bi bi-phone"></i>Call us: <a href="tel:${F.phoneHref}">${F.phone}</a></span>
        <span class="hide-sm"><i class="bi bi-envelope"></i><a href="mailto:${F.emails[0]}">${F.emails[0]}</a></span>
      </div>
      <div class="topbar__social">
        <a href="${F.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
        <a href="https://wa.me/${F.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
        <a href="mailto:${F.emails[0]}" aria-label="Email"><i class="bi bi-envelope-fill"></i></a>
      </div>
    </div>
  </div>
  <header class="site-header" id="siteHeader">
    <div class="lb-container">
      <a class="brand" href="index.html" aria-label="Ab Initio Legal — Home"><img src="assets/img/brand/logo-dark.png" alt="Ab Initio Legal — Advocates &amp; Solicitors" width="200" height="52"></a>
      <div class="d-flex align-items-center h-100">
        <nav class="h-100" aria-label="Main">
          <ul class="main-nav">
            <li><a class="${on("home")}" href="index.html">Home</a></li>
            <li><a class="${on(["about", "culture", "clients"])}" href="about.html">The Firm <i class="bi bi-chevron-down caret"></i></a>
              <ul class="subnav">
                <li><a class="${on("about")}" href="about.html">About Us</a></li>
                <li><a class="${on("culture")}" href="culture.html">Our Culture</a></li>
                <li><a class="${on("clients")}" href="clients.html">Our Clients</a></li>
              </ul>
            </li>
            <li><a class="${on(["practice", "practice-detail"])}" href="practice-areas.html">Practice Areas <i class="bi bi-chevron-down caret"></i></a>
              <ul class="subnav" id="navPractices"></ul>
            </li>
            <li><a class="${on(["team", "profile"])}" href="team.html">Our Team</a></li>
            <li><a class="${on(["publications", "post"])}" href="publications.html">Publications</a></li>
            <li><a class="${on("careers")}" href="careers.html">Careers</a></li>
            <li><a class="${on("contact")}" href="contact.html">Contacts</a></li>
          </ul>
        </nav>
        <button class="nav-search" id="openSearch" aria-label="Search"><i class="bi bi-search"></i></button>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false"><i class="bi bi-list"></i></button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    <div class="mobile-menu__backdrop" data-close-menu></div>
    <div class="mobile-menu__panel">
      <button class="mobile-menu__close" data-close-menu aria-label="Close menu"><i class="bi bi-x-lg"></i></button>
      <img src="assets/img/brand/logo-dark.png" alt="Ab Initio Legal" style="height:40px">
      <ul>
        <li><a class="${on("home")}" href="index.html">Home</a></li>
        <li><a class="${on("about")}" href="about.html">About Us</a></li>
        <li class="sub"><a class="${on("culture")}" href="culture.html">Our Culture</a></li>
        <li class="sub"><a class="${on("clients")}" href="clients.html">Our Clients</a></li>
        <li><a class="${on(["practice", "practice-detail"])}" href="practice-areas.html">Practice Areas</a></li>
        <li><a class="${on(["team", "profile"])}" href="team.html">Our Team</a></li>
        <li><a class="${on(["publications", "post"])}" href="publications.html">Publications</a></li>
        <li><a class="${on("careers")}" href="careers.html">Careers</a></li>
        <li><a class="${on("contact")}" href="contact.html">Contacts</a></li>
      </ul>
      <div class="mobile-menu__info">
        <p class="mb-1"><a href="tel:${F.phoneHref}">${F.phone}</a> · <a href="tel:${F.mobileHref}">${F.mobile}</a></p>
        <p class="mb-1"><a href="mailto:${F.emails[0]}">${F.emails[0]}</a></p>
        <p><a href="${F.social.linkedin}" target="_blank" rel="noopener"><i class="bi bi-linkedin"></i> LinkedIn</a></p>
      </div>
    </div>
  </div>
  <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Search">
    <button class="search-overlay__close" id="closeSearch" aria-label="Close search"><i class="bi bi-x-lg"></i></button>
    <div class="search-overlay__inner">
      <input type="search" id="searchInput" placeholder="Search the site…" autocomplete="off" aria-label="Search the site">
      <p class="search-hint">Search practice areas, team members and publications.</p>
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>`;

  const year = new Date().getFullYear();
  const FOOT = `
  <footer class="site-footer">
    <div class="lb-container">
      <div class="footer-cta">
        <h3>Committed to Helping Our Clients Succeed. Let’s Talk!</h3>
        <a class="btn-lb sm" href="contact.html">Contact Us</a>
      </div>
      <div class="footer-cols">
        <div>
          <img class="footer-logo" src="assets/img/brand/logo-light.png" alt="Ab Initio Legal" loading="lazy">
          <p>A full-service, litigation-driven law firm in New Delhi, established in ${F.established}. Trust, Timely &amp; Prompt Execution and Transparency.</p>
          <div class="social-sq">
            <a href="${F.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
            <a href="https://wa.me/${F.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
            <a href="mailto:${F.emails[0]}" aria-label="Email"><i class="bi bi-envelope"></i></a>
            <a href="tel:${F.phoneHref}" aria-label="Call"><i class="bi bi-telephone"></i></a>
          </div>
        </div>
        <div>
          <h5>Practice Areas</h5>
          <ul class="footer-links">${AIL.practices.slice(0, 7).map((p) => `<li><a href="practice.html?area=${p.slug}">${p.title}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h5>The Firm</h5>
          <ul class="footer-links">
            <li><a href="about.html">About Us</a></li>
            <li><a href="team.html">Our Team</a></li>
            <li><a href="culture.html">Our Culture</a></li>
            <li><a href="clients.html">Our Clients</a></li>
            <li><a href="publications.html">Publications</a></li>
            <li><a href="careers.html">Careers</a></li>
            <li><a href="disclaimer.html">Disclaimer</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h5>Contact</h5>
          <p>${F.address.join(" ")}</p>
          <p><i class="bi bi-phone"></i><a href="tel:${F.phoneHref}">${F.phone}</a> / <a href="tel:${F.mobileHref}">${F.mobile}</a></p>
          <p><i class="bi bi-envelope"></i><a href="mailto:${F.emails[0]}">${F.emails[0]}</a></p>
          <form class="footer-sub" id="footerSub" novalidate>
            <input type="email" name="email" placeholder="Subscribe to our newsletter" aria-label="Email address">
            <button type="submit" aria-label="Subscribe"><i class="bi bi-arrow-right"></i></button>
          </form>
          <div class="footer-sub-msg" id="footerSubMsg" aria-live="polite"></div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="lb-container">
        <span class="brand-name">Ab Initio Legal LLP</span> &nbsp;©${year} — All Rights Reserved · <a href="disclaimer.html">Disclaimer</a> · <a href="privacy-policy.html">Privacy Policy</a>
        <p class="footer-note">As per the rules of the Bar Council of India, law firms are not permitted to solicit work or advertise. This website is for information only and does not constitute legal advice. Photographs: Supreme Court of India — Wikimedia Commons (CC BY-SA 4.0); High Court of Delhi — official photo gallery; other photographs are CC0 (StockSnap / Wikimedia Commons).</p>
      </div>
    </div>
  </footer>
  <div class="fab-stack">
    <a class="fab fab-wa" href="https://wa.me/${F.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="bi bi-whatsapp"></i></a>
    <button class="fab fab-top" id="toTop" aria-label="Back to top"><i class="bi bi-chevron-up"></i></button>
  </div>`;

  const DISC = `
  <div class="disclaimer" id="disclaimer" role="dialog" aria-modal="true" aria-labelledby="discTitle">
    <div class="disclaimer__box">
      <div class="disclaimer__head">
        <img src="assets/img/brand/mark-dark.png" alt="">
        <div><small>Bar Council of India Rules</small><h2 id="discTitle">Disclaimer</h2></div>
      </div>
      <div class="disclaimer__body">
        <p>The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner. By accessing this website, <strong>${F.website}</strong>, you acknowledge and confirm that:</p>
        <ul>
          <li>You are seeking information relating to ${F.name} (“Ab Initio Legal”) of your own accord and there has been no form of solicitation, advertisement, personal communication, invitation or inducement of any sort whatsoever from Ab Initio Legal or any of its members to solicit any work through this website.</li>
          <li>The information on this website is provided solely for informational purposes and should not be construed as legal advice or an opinion. It does not create an advocate–client relationship.</li>
          <li>Ab Initio Legal shall not be liable for any consequence of any action taken by you relying on the material or information provided on this website. You should seek independent legal advice for your specific situation.</li>
          <li>Any information you share with us through this website will not be treated as confidential until an advocate–client relationship is formally established.</li>
          <li>The contents of this website, including text, logos and graphics, are the intellectual property of Ab Initio Legal.</li>
        </ul>
      </div>
      <div class="disclaimer__foot">
        <button class="btn-lb sm outline" id="discDisagree" type="button">I Disagree</button>
        <button class="btn-lb sm" id="discAgree" type="button">I Agree</button>
      </div>
      <div class="disclaimer__declined">
        <img src="assets/img/brand/mark-dark.png" alt="" style="height:64px;margin:0 auto 20px">
        <h2 class="mb-3">Thank you for visiting.</h2>
        <p>Access to this website requires acceptance of the disclaimer, in keeping with the rules of the Bar Council of India.</p>
        <button class="btn-lb sm" id="discReview" type="button">Review Disclaimer Again</button>
      </div>
    </div>
  </div>`;

  const h = document.getElementById("ail-header");
  const f = document.getElementById("ail-footer");
  if (h) h.outerHTML = TOP;
  if (f) f.outerHTML = FOOT;
  document.body.insertAdjacentHTML("beforeend", DISC);
  const np = document.getElementById("navPractices");
  if (np) np.innerHTML = AIL.practices.slice(0, 10).map((p) => `<li><a href="practice.html?area=${p.slug}">${p.title}</a></li>`).join("") +
    `<li><a href="practice-areas.html"><em>View all practice areas →</em></a></li>`;
})();
