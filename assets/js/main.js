/* =====================================================================
   AB INITIO LEGAL — Option B main script
   ===================================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined" && !reduceMotion;
  if (animate) document.documentElement.classList.add("js-anim");
  const params = new URLSearchParams(location.search);

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d8 = (iso) => new Date(iso + "T00:00:00");
  const fmtDate = (iso) => { const d = d8(iso); return isNaN(d) ? iso : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const TYPE = { newsletter: "Newsletter", article: "Article", research: "Research Paper", update: "Legal Update" };
  const slugify = (s) => String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const pubs = () => (AIL.publications || []).map((p) => ({ ...p, id: p.id || slugify(p.title) })).sort((a, b) => (a.date < b.date ? 1 : -1));
  const practiceBySlug = (s) => AIL.practices.find((p) => p.slug === s);
  const memberBySlug = (s) => AIL.team.find((m) => m.slug === s);

  // Practice areas associated with each person (shown on profile pages)
  const MEMBER_PRACTICES = {
    "amit-manchanda": ["commercial-corporate-litigation", "arbitration", "insolvency-ibc", "contractual-disputes"],
    "abhay-chitravanshi": ["criminal-white-collar", "arbitration", "insolvency-ibc", "constitutional-matters"],
    "deepak-shankar": ["labour-employment", "criminal-white-collar", "consumer-disputes", "contractual-disputes"],
    "bhawna-nanda": ["banking-finance", "property-rera", "family-matrimonial", "consumer-disputes"],
    "riya-goel": ["arbitration", "commercial-corporate-litigation", "dispute-resolution", "contractual-disputes"],
    "narender-gupta": ["commercial-corporate-litigation", "administrative-service-law", "dispute-resolution", "contractual-disputes"],
    "ateev-kapoor": ["commercial-corporate-litigation", "dispute-resolution", "contractual-disputes", "banking-finance"]
  };

  /* ============================ TEMPLATES ============================ */
  const practiceTile = (p) => `
    <a class="practice-tile" href="practice.html?area=${p.slug}" data-anim>
      <div class="practice-tile__img"><img src="${esc(p.img)}" alt="${esc(p.title)}" loading="lazy"></div>
      <div class="practice-tile__title"><i class="bi bi-arrow-right"></i><h4>${esc(p.title)}</h4></div>
      <small>${esc(p.cat)}</small>
    </a>`;

  const teamCard = (m) => `
    <a class="team-card" href="profile.html?member=${m.slug}">
      <div class="team-card__img"><img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy"></div>
      <span class="team-card__li" data-href="${esc(m.linkedin)}" role="link" tabindex="0" aria-label="${esc(m.name)} on LinkedIn"><i class="bi bi-linkedin"></i></span>
      <div class="team-card__plate"><strong>${esc(m.name)}</strong><small>${esc(m.designation)}</small></div>
    </a>`;

  const leadCard = (m) => `
    <div class="lead-card" data-anim>
      <a class="lead-card__img" href="profile.html?member=${m.slug}"><img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy"></a>
      <div class="lead-card__body">
        <h3><a href="profile.html?member=${m.slug}">${esc(m.name)}</a></h3>
        <div class="lead-card__role">${esc(m.designation)}${m.practice ? " · " + esc(m.practice) : ""}</div>
        <p>${esc(firstSentences(m.bio[0], 260))}</p>
        <div class="lead-card__foot">
          <a class="read-more" href="profile.html?member=${m.slug}">Learn More <i class="bi bi-arrow-right"></i></a>
          <div class="social-sq"><a href="${esc(m.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a><a href="mailto:${esc(AIL.firm.emails[0])}" aria-label="Email"><i class="bi bi-envelope"></i></a></div>
        </div>
      </div>
    </div>`;

  function firstSentences(text, max) {
    const parts = (text || "").match(/[^.!?]+[.!?]+(\s|$)/g) || [text || ""];
    let out = "";
    for (const s of parts) { if ((out + s).length > max && out) break; out += s; }
    return out.trim();
  }

  const newsCard = (p) => {
    const d = d8(p.date);
    const href = `post.html?id=${p.id}`;
    return `
    <article class="news-card" data-anim>
      <a class="news-card__img" href="${href}">
        <img src="${esc(p.image || "assets/img/stock/books-coffee.jpg")}" alt="" loading="lazy">
        <span class="date-badge"><b>${d.getDate()}</b><span>${MONTHS[d.getMonth()].slice(0, 3)}</span></span>
        ${p.sample ? '<span class="sample-tag">Sample</span>' : ""}
      </a>
      <div class="news-card__cat">${esc(TYPE[p.type] || p.type)}</div>
      <h4><a href="${href}">${esc(p.title)}</a></h4>
      <p>${esc(p.summary || "")}</p>
      <a class="read-more" href="${href}">Read More <i class="bi bi-arrow-right"></i></a>
    </article>`;
  };

  const logoItem = (c) => `<div class="logo-item"><img src="${esc(c.logo)}" alt="${esc(c.name)}" loading="lazy"></div>`;

  /* ============================ RENDERERS ============================ */
  function renderBlocks() {
    $$("[data-render]").forEach((el) => {
      const kind = el.dataset.render;
      const limit = parseInt(el.dataset.limit || "0", 10);
      const excl = el.dataset.exclude;
      if (kind === "practice-tiles") {
        let list = AIL.practices.filter((p) => p.slug !== excl);
        if (el.dataset.slugs) list = el.dataset.slugs.split(",").map(practiceBySlug).filter(Boolean);
        el.innerHTML = (limit ? list.slice(0, limit) : list).map(practiceTile).join("");
      } else if (kind === "practice-carousel") {
        el.innerHTML = AIL.practices.filter((p) => p.slug !== excl).map((p) => `<div class="lb-carousel__item">${practiceTile(p).replace(" data-anim", "")}</div>`).join("");
      } else if (kind === "team-carousel") {
        el.innerHTML = AIL.team.map((m) => `<div class="lb-carousel__item">${teamCard(m)}</div>`).join("");
      } else if (kind === "team-grid") {
        const groups = (el.dataset.group || "").split(",");
        el.innerHTML = AIL.team.filter((m) => groups.includes(m.group)).map((m) => `<div data-anim>${teamCard(m)}</div>`).join("");
      } else if (kind === "lead-cards") {
        const groups = (el.dataset.group || "partners").split(",");
        el.innerHTML = AIL.team.filter((m) => groups.includes(m.group)).map(leadCard).join("");
      } else if (kind === "news") {
        const list = pubs();
        el.innerHTML = list.length ? list.slice(0, limit || 3).map(newsCard).join("") : `<div class="empty-state"><i class="bi bi-journal-text"></i><h4 class="mt-3">Publications coming soon</h4></div>`;
      } else if (kind === "logos-carousel") {
        el.innerHTML = AIL.clients.map((c) => `<div class="lb-carousel__item">${logoItem(c)}</div>`).join("");
      } else if (kind === "client-grid") {
        el.innerHTML = AIL.clients.map((c) => `<div class="client-cell" data-anim><div class="logo"><img src="${esc(c.logo)}" alt="${esc(c.name)}" loading="lazy"></div><h5>${esc(c.name)}</h5><small>${esc(c.sector)}</small></div>`).join("");
      } else if (kind === "testimonials") {
        if (!AIL.testimonials || !AIL.testimonials.length) { const sec = el.closest("[data-testimonials-section]"); sec ? sec.remove() : el.remove(); return; }
        el.innerHTML = AIL.testimonials.map((t) => `<div class="quote-box" data-anim><span class="q">“</span><div><p>${esc(t.quote)}</p></div><div class="who"><span class="av"><i class="bi bi-person"></i></span><div><strong>${esc(t.name)}</strong><small>${esc(t.role)}</small></div></div></div>`).join("");
      } else if (kind === "drafting") {
        el.innerHTML = AIL.drafting.map((d) => `<li>${esc(d)}</li>`).join("");
      }
    });
    // LinkedIn buttons inside team cards (cards themselves are links)
    document.addEventListener("click", (e) => {
      const li = e.target.closest(".team-card__li");
      if (!li) return;
      e.preventDefault(); e.stopPropagation();
      window.open(li.dataset.href, "_blank", "noopener");
    });
  }

  // ---- Team page "Meet Our Experts" block ----
  function renderExperts() {
    const top = $("#expertsTop"), grid = $("#expertsGrid");
    if (!top || !grid) return;
    const others = AIL.team.filter((m) => m.group !== "partners");
    top.insertAdjacentHTML("beforeend", others.slice(0, 2).map((m) => `<div data-anim>${teamCard(m)}</div>`).join(""));
    grid.innerHTML = others.slice(2).map((m) => `<div data-anim>${teamCard(m)}</div>`).join("");
  }

  // ---- Publications page ----
  function renderPublications() {
    const grid = $("#pubGrid"), filters = $("#pubFilters");
    if (!grid) return;
    const all = pubs();
    let type = params.get("type") || "all";
    const PLURAL = { newsletter: "Newsletters", article: "Articles", research: "Research Papers", update: "Legal Updates" };
    const present = Object.keys(PLURAL).filter((t) => all.some((p) => p.type === t));
    filters.innerHTML = [["all", "All"], ...present.map((t) => [t, PLURAL[t]])].map(([k, l]) => `<button class="${k === type ? "active" : ""}" data-type="${k}">${l}</button>`).join("");
    const draw = () => {
      const list = all.filter((p) => type === "all" || p.type === type);
      grid.innerHTML = list.length ? list.map(newsCard).join("") : `<div class="empty-state"><i class="bi bi-journal-text"></i><h4 class="mt-3">Nothing published here yet</h4></div>`;
      if (animate) gsap.fromTo($$("[data-anim]", grid), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: "power2.out" });
      else $$("[data-anim]", grid).forEach((e) => e.removeAttribute("data-anim"));
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      type = b.dataset.type;
      $$("button", filters).forEach((x) => x.classList.toggle("active", x === b));
      const u = new URL(location.href); type === "all" ? u.searchParams.delete("type") : u.searchParams.set("type", type); history.replaceState(null, "", u);
      draw();
    });
    draw();
  }

  // ---- Single publication page ----
  function renderPost() {
    const root = $("#postRoot");
    if (!root) return;
    const all = pubs();
    const p = all.find((x) => x.id === params.get("id")) || all[0];
    if (!p) { root.innerHTML = `<div class="empty-state my-5"><h4>Publication not found</h4><a class="read-more" href="publications.html">Back to publications <i class="bi bi-arrow-right"></i></a></div>`; return; }
    document.title = `${p.title} | Ab Initio Legal LLP`;
    const d = d8(p.date);
    const hasFile = p.file && p.file !== "#";
    root.innerHTML = `
      <div class="post-hero"><img src="${esc(p.image)}" alt=""></div>
      <div class="post-head">
        <span class="date-badge"><b>${d.getDate()}</b><span>${MONTHS[d.getMonth()].slice(0, 3)}</span></span>
        <div>
          <div class="cat">${esc(TYPE[p.type] || p.type)} · ${fmtDate(p.date)}</div>
          <h1>${esc(p.title)}</h1>
          <p class="mb-2">${esc(p.summary || "")}</p>
          <small>By Ab Initio Legal</small>
        </div>
      </div>
      <div class="post-body">
        ${p.sample ? `<p class="p-3" style="border:1px dashed var(--accent);background:var(--light)"><strong>Sample entry for design review.</strong> The full newsletter PDF will be linked here once uploaded.</p>` : ""}
        <p>${esc(p.summary || "")}</p>
        <div class="d-flex flex-wrap gap-3 my-4">
          ${hasFile ? `<a class="btn-lb sm" href="${esc(p.file)}" target="_blank" rel="noopener">Read PDF</a><a class="btn-lb sm outline" href="${esc(p.file)}" download>Download</a>` : `<span class="btn-lb sm" style="opacity:.55;pointer-events:none">PDF coming soon</span>`}
          ${p.link ? `<a class="btn-lb sm outline" href="${esc(p.link)}" target="_blank" rel="noopener">View Online</a>` : ""}
        </div>
        <p class="mb-2">${(p.tags || []).map((t) => `<span class="tag-lb me-1">${esc(t)}</span>`).join("")}</p>
        <div class="newsletter-box">
          <div class="newsletter-box__img" style="background-image:url('assets/img/stock/library-2.jpg')"></div>
          <div class="newsletter-box__body">
            <h4>Sign Up for Our Newsletter</h4>
            <p style="font-size:11px">Key judgments and legal updates, delivered to your inbox.</p>
            <form class="form-lb" data-lb-form data-success="#postSubOk" data-endpoint="/api/newsletter/subscribe" novalidate>
              <div class="field"><input class="form-control" type="email" name="email" placeholder="Your email address" required aria-label="Email"></div>
              <button class="btn-lb sm w-100" type="submit">Sign Up</button>
            </form>
            <div class="form-success" id="postSubOk"><p class="mb-0 accent">Thank you — you’re subscribed.</p></div>
            <small style="font-size:10px" class="mt-2">You can unsubscribe at any time.</small>
          </div>
        </div>
      </div>`;
    const rel = $("#relatedPosts");
    if (rel) rel.innerHTML = all.filter((x) => x.id !== p.id).slice(0, 3).map(newsCard).join("");
  }

  // ---- Team profile page ----
  function renderProfile() {
    const root = $("#profileRoot");
    if (!root) return;
    const m = memberBySlug(params.get("member")) || AIL.team[0];
    document.title = `${m.name} — ${m.designation} | Ab Initio Legal LLP`;
    const heads = ["Short Biography", "Experience", "Expertise", "Career Highlights"];
    const areas = (m.practices || MEMBER_PRACTICES[m.slug] || []).map(practiceBySlug).filter(Boolean);
    root.innerHTML = `
      <div class="profile-top" data-anim>
        <div class="profile-top__img"><img src="${esc(m.photo)}" alt="${esc(m.name)}"></div>
        <div class="profile-top__body">
          <h1>${esc(m.name)}</h1>
          <div class="role">${esc(m.designation)}${m.practice ? " · " + esc(m.practice) : ""}</div>
          <div class="profile-meta">
            <div><b>Qualifications:</b> ${esc(m.qualifications)}</div>
            <div><b>Office:</b> ${esc(AIL.firm.phone)}</div>
            <div><b>Email:</b> <a href="mailto:${esc(AIL.firm.emails[0])}">${esc(AIL.firm.emails[0])}</a></div>
          </div>
          <div class="social-sq"><a href="${esc(m.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a><a href="mailto:${esc(AIL.firm.emails[0])}" aria-label="Email"><i class="bi bi-envelope"></i></a></div>
          <a class="btn-lb sm mt-4" href="${esc(m.linkedin)}" target="_blank" rel="noopener"><i class="bi bi-linkedin"></i> View LinkedIn Profile</a>
        </div>
      </div>
      <div class="profile-layout">
        <aside>
          <div class="side-box" data-anim>
            <h5>Areas of Focus</h5>
            <div class="tags">${(m.focus || []).map((t) => `<span class="tag-lb">${esc(t)}</span>`).join("")}</div>
          </div>
          <div class="side-box text-start" data-anim>
            <h5 class="text-center">Book an Appointment:</h5>
            <form class="form-lb" id="apptForm" data-lb-form data-success="#apptOk" data-endpoint="/api/appointment" novalidate>
              <input type="hidden" name="with" value="${esc(m.name)}">
              <div class="field"><input class="form-control" name="name" placeholder="Your full name" required aria-label="Your full name"></div>
              <div class="field"><input class="form-control" name="phone" type="tel" placeholder="Your phone" required aria-label="Your phone"></div>
              <div class="field"><input class="form-control" name="email" type="email" placeholder="Your email" required aria-label="Your email"></div>
              <div class="field"><input class="form-control" name="date" type="date" required aria-label="Preferred date"></div>
              <button class="btn-lb sm w-100" type="submit">Book Online</button>
            </form>
            <div class="form-success" id="apptOk"><div class="tick"><i class="bi bi-check2"></i></div><p class="mb-0">Request received — we will confirm the appointment shortly.</p></div>
          </div>
        </aside>
        <div>
          ${m.bio.map((para, i) => `<div class="profile-section" data-anim><h3>${heads[i] || ""}</h3><p>${esc(para)}</p></div>`).join("")}
          ${areas.length ? `<div class="profile-section" data-anim><h3>Areas of Expertise</h3><div class="practice-grid cols-2">${areas.map(practiceTile).join("")}</div></div>` : ""}
        </div>
      </div>`;
  }

  // ---- Practice detail page ----
  function renderPractice() {
    const root = $("#practiceRoot");
    if (!root) return;
    const p = practiceBySlug(params.get("area")) || AIL.practices[0];
    document.title = `${p.title} | Ab Initio Legal LLP`;
    $("#pdBannerImg").style.backgroundImage = `url('${p.img}')`;
    $("#pdTitle").textContent = p.title;
    $("#pdLead").textContent = firstSentences(p.text, 170);
    $("#pdCrumb").textContent = p.title;
    const icons = ["bi-check2-circle", "bi-briefcase", "bi-file-earmark-text", "bi-bank2"];
    $("#pdItems").innerHTML = p.items.map((it, i) => `<div class="mini-feature" data-anim><div class="icon-circle"><i class="bi ${icons[i % 4]}"></i></div><h5>${esc(it)}</h5></div>`).join("");
    $("#pdHow").textContent = `Our ${p.title} Practice`;
    $("#pdText").textContent = p.text;
    $("#pdChecks").innerHTML = p.items.map((it) => `<li>${esc(it)}</li>`).join("") + `<li>Strategy, drafting &amp; representation</li>`;
    const sel = $("#pdSubject");
    if (sel) { AIL.practices.forEach((x) => sel.insertAdjacentHTML("beforeend", `<option ${x.slug === p.slug ? "selected" : ""}>${esc(x.title)}</option>`)); }
    const more = $("[data-render='practice-carousel']");
    if (more) more.innerHTML = AIL.practices.filter((x) => x.slug !== p.slug).map((x) => `<div class="lb-carousel__item">${practiceTile(x).replace(" data-anim", "")}</div>`).join("");
  }

  // ---- Careers ----
  function renderOpenings() {
    const el = $("#openings");
    if (!el) return;
    let kind = "job";
    const draw = () => {
      const items = AIL.openings.filter((o) => o.open && o.type === kind);
      el.innerHTML = items.length ? items.map((o) => `
        <div class="job-card">
          <div>
            <h4>${esc(o.title)}</h4>
            <div class="job-meta"><span><i class="bi bi-geo-alt"></i>${esc(o.location)}</span><span><i class="bi bi-mortarboard"></i>${esc(o.experience)}</span>${o.duration ? `<span><i class="bi bi-calendar3"></i>${esc(o.duration)}</span>` : ""}</div>
            <ul>${o.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          </div>
          <a class="btn-lb sm" href="#apply" data-apply="${esc(o.title)}">Apply Now</a>
        </div>`).join("") : `<div class="empty-state"><i class="bi bi-briefcase"></i><h4 class="mt-3">No open positions right now</h4><p class="mb-0">We are always glad to hear from outstanding candidates — use the form below.</p></div>`;
    };
    $("#careerTabs").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      kind = b.dataset.kind; $$("#careerTabs button").forEach((x) => x.classList.toggle("active", x === b)); draw();
    });
    el.addEventListener("click", (e) => {
      const a = e.target.closest("[data-apply]"); if (!a) return;
      const sel = $("#applyPosition"); if (sel) sel.value = a.dataset.apply;
    });
    const sel = $("#applyPosition");
    if (sel) { AIL.openings.filter((o) => o.open).forEach((o) => sel.insertAdjacentHTML("beforeend", `<option value="${esc(o.title)}">${esc(o.title)}</option>`)); sel.insertAdjacentHTML("beforeend", `<option value="General application">General application</option>`); }
    draw();
  }

  /* ============================ CAROUSELS ============================ */
  function initCarousels() {
    $$(".lb-carousel").forEach((car) => {
      const track = $(".lb-carousel__track", car);
      const items = () => $$(".lb-carousel__item", track);
      let index = 0;
      const per = () => {
        const w = innerWidth;
        const p = w < 576 ? car.dataset.perSm : w < 992 ? car.dataset.perMd : car.dataset.per;
        return parseInt(p || car.dataset.per || "4", 10);
      };
      const id = car.id;
      const prevs = [...$$("[data-prev]", car), ...(id ? $$(`[data-prev="#${id}"]`) : [])];
      const nexts = [...$$("[data-next]", car), ...(id ? $$(`[data-next="#${id}"]`) : [])];
      const update = () => {
        const n = per(), max = Math.max(0, items().length - n);
        car.style.setProperty("--per", n);
        index = Math.min(Math.max(0, index), max);
        track.style.transform = `translateX(${-(100 / n) * index}%)`;
        const loop = car.dataset.loop !== undefined;
        prevs.forEach((b) => (b.disabled = !loop && index === 0));
        nexts.forEach((b) => (b.disabled = !loop && index >= max));
      };
      const go = (d) => {
        const n = per(), max = Math.max(0, items().length - n);
        index += d;
        if (car.dataset.loop !== undefined) { if (index > max) index = 0; if (index < 0) index = max; }
        update();
      };
      prevs.forEach((b) => b.addEventListener("click", () => go(-1)));
      nexts.forEach((b) => b.addEventListener("click", () => go(1)));
      window.addEventListener("resize", update);
      // touch swipe
      let sx = null;
      car.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
      car.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
      if (car.dataset.autoplay && !reduceMotion) {
        let t = setInterval(() => go(1), +car.dataset.autoplay);
        car.addEventListener("mouseenter", () => clearInterval(t));
        car.addEventListener("mouseleave", () => (t = setInterval(() => go(1), +car.dataset.autoplay)));
      }
      update();
    });
  }

  /* ============================ HERO ============================ */
  function initHero() {
    const hero = $(".hero");
    if (!hero) return;
    const slides = $$(".hero__slide", hero);
    const label = $(".hero__label", hero);
    let i = 0, timer;
    const show = (n) => {
      slides[i].classList.remove("active");
      i = (n + slides.length) % slides.length;
      // restart CSS animations on the incoming slide
      const s = slides[i]; s.classList.remove("active"); void s.offsetWidth; s.classList.add("active");
      if (label) label.textContent = s.dataset.label || "";
      restart();
    };
    const restart = () => { clearTimeout(timer); if (!reduceMotion) timer = setTimeout(() => show(i + 1), 7000); };
    $(".lb-arrow.prev", hero).addEventListener("click", () => show(i - 1));
    $(".lb-arrow.next", hero).addEventListener("click", () => show(i + 1));
    document.addEventListener("visibilitychange", () => (document.hidden ? clearTimeout(timer) : restart()));
    let sx = null;
    hero.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    hero.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); sx = null; });
    if (label) label.textContent = slides[0].dataset.label || "";
    restart();
  }

  /* ============================ UI ============================ */
  const locks = new Set();
  function lockScroll(key, on) { on ? locks.add(key) : locks.delete(key); document.documentElement.classList.toggle("is-locked", locks.size > 0); }

  function initHeader() {
    const header = $("#siteHeader"), toTop = $("#toTop");
    const onScroll = () => {
      const y = scrollY;
      header && header.classList.toggle("is-stuck", y > 150);
      toTop && toTop.classList.toggle("show", y > 600);
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    toTop && toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    const menu = $("#mobileMenu"), toggle = $("#navToggle");
    const setMenu = (open) => {
      menu.classList.toggle("open", open); menu.setAttribute("aria-hidden", !open);
      toggle.setAttribute("aria-expanded", open); lockScroll("menu", open);
    };
    toggle && toggle.addEventListener("click", () => setMenu(true));
    $$("[data-close-menu]").forEach((b) => b.addEventListener("click", () => setMenu(false)));
    $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    addEventListener("resize", () => innerWidth >= 1200 && menu.classList.contains("open") && setMenu(false));

    // Search
    const ov = $("#searchOverlay"), input = $("#searchInput"), out = $("#searchResults");
    const idx = [
      ...AIL.practices.map((p) => ({ t: p.title, k: "Practice Area", u: `practice.html?area=${p.slug}`, s: (p.title + " " + p.text + " " + p.items.join(" ")).toLowerCase() })),
      ...AIL.team.map((m) => ({ t: m.name, k: m.designation, u: `profile.html?member=${m.slug}`, s: (m.name + " " + m.designation + " " + (m.focus || []).join(" ")).toLowerCase() })),
      ...pubs().map((p) => ({ t: p.title, k: TYPE[p.type] || "Publication", u: `post.html?id=${p.id}`, s: (p.title + " " + (p.summary || "") + " " + (p.tags || []).join(" ")).toLowerCase() })),
      ...[["About Us", "about.html"], ["Our Culture", "culture.html"], ["Our Clients", "clients.html"], ["Careers", "careers.html"], ["Contacts", "contact.html"], ["Disclaimer", "disclaimer.html"]].map(([t, u]) => ({ t, k: "Page", u, s: t.toLowerCase() }))
    ];
    const openSearch = (open) => { ov.classList.toggle("open", open); lockScroll("search", open); if (open) setTimeout(() => input.focus(), 50); };
    $("#openSearch") && $("#openSearch").addEventListener("click", () => openSearch(true));
    $("#closeSearch") && $("#closeSearch").addEventListener("click", () => openSearch(false));
    input && input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { out.innerHTML = ""; return; }
      const hits = idx.filter((x) => q.split(/\s+/).every((w) => x.s.includes(w))).slice(0, 12);
      out.innerHTML = hits.length ? hits.map((h) => `<a href="${h.u}">${esc(h.t)}<small>${esc(h.k)}</small></a>`).join("") : `<p>No results for “${esc(input.value)}”.</p>`;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (ov.classList.contains("open")) openSearch(false);
      if (menu.classList.contains("open")) setMenu(false);
    });
  }

  // Disclaimer
  const DISC_KEY = "ail_disclaimer_accepted", DISC_DAYS = 1;
  function initDisclaimer() {
    const d = $("#disclaimer");
    let ok = false;
    try { const v = +localStorage.getItem(DISC_KEY); ok = v && Date.now() - v < DISC_DAYS * 864e5; } catch (e) {}
    if (!d || ok || document.body.hasAttribute("data-no-disclaimer")) return;
    d.classList.add("show"); lockScroll("disclaimer", true);
    setTimeout(() => $("#discAgree").focus(), 200);
    $("#discAgree").addEventListener("click", () => {
      try { localStorage.setItem(DISC_KEY, String(Date.now())); } catch (e) {}
      d.classList.remove("show"); lockScroll("disclaimer", false);
    });
    $("#discDisagree").addEventListener("click", () => d.classList.add("declined"));
    $("#discReview").addEventListener("click", () => d.classList.remove("declined"));
  }

  // Anchors (native smooth scroll with header offset)
  function initAnchors() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2 || !$(id)) return;
      e.preventDefault();
      scrollTo({ top: $(id).getBoundingClientRect().top + scrollY - 100, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // Forms — front-end validation; backend to be connected later
  function initForms() {
    $$(".file-drop input[type=file]").forEach((inp) => {
      const out = $(".fname", inp.closest(".file-drop"));
      inp.addEventListener("change", () => (out.textContent = inp.files[0] ? `${inp.files[0].name} · ${(inp.files[0].size / 1048576).toFixed(2)} MB` : "PDF or Word, max 5 MB"));
    });
    document.addEventListener("submit", (e) => {
      const form = e.target.closest("form[data-lb-form]");
      if (!form) return;
      e.preventDefault();
      let ok = true;
      $$("[required]", form).forEach((f) => {
        let v = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
        if (v && f.type === "email") v = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim());
        if (v && f.type === "tel") v = /^[+\d][\d\s-]{7,}$/.test(f.value.trim());
        if (v && f.type === "file") { const x = f.files[0]; v = !!x && x.size <= 5 * 1048576 && /\.(pdf|docx?)$/i.test(x.name); }
        f.classList.toggle("is-invalid", !v); if (!v) ok = false;
      });
      if (!ok) { const first = $(".is-invalid", form); first && first.focus(); return; }
      /* BACKEND HOOK: POST new FormData(form) to form.dataset.endpoint, then show success. */
      const btn = $("button[type=submit]", form); const label = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = 'Sending… <span class="spinner-border spinner-border-sm"></span>';
      setTimeout(() => {
        form.style.display = "none"; const s = $(form.dataset.success); s && s.classList.add("show");
        form.reset(); btn.disabled = false; btn.innerHTML = label;
      }, 800);
    });
    document.addEventListener("input", (e) => e.target.classList && e.target.classList.remove("is-invalid"));
    const fs = $("#footerSub");
    fs && fs.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fs.email.value.trim());
      $("#footerSubMsg").textContent = ok ? "Thank you — you’re subscribed." : "Please enter a valid email address.";
      /* BACKEND HOOK: newsletter subscription */
      if (ok) fs.reset();
    });
  }

  /* ============================ MOTION ============================ */
  function initAnimations() {
    if (!animate) { $$("[data-anim]").forEach((e) => e.removeAttribute("data-anim")); return; }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const els = $$("[data-anim]").filter((e) => !e.closest("#pubGrid"));
    ScrollTrigger.batch(els, {
      start: "top 92%", once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: .9, ease: "power2.out", stagger: .08, overwrite: true })
    });
    // Counters
    $$("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count), o = { v: 0 };
      gsap.to(o, { v: end, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%", once: true }, onUpdate: () => (el.textContent = Math.round(o.v)) });
    });
    // Re-measure only when page height changes and scrolling is idle (prevents jumps)
    let t, last = 0, lastH = document.documentElement.scrollHeight;
    addEventListener("scroll", () => (last = performance.now()), { passive: true });
    const refresh = () => { clearTimeout(t); t = setTimeout(() => { if (performance.now() - last < 300) return refresh(); const h = document.documentElement.scrollHeight; if (h !== lastH) { lastH = h; ScrollTrigger.refresh(); } }, 200); };
    $$("img").forEach((img) => !img.complete && img.addEventListener("load", refresh, { once: true }));
    document.fonts && document.fonts.ready.then(refresh);
    addEventListener("load", refresh);
    // Safety net: anything visible but still hidden gets revealed
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((en) => en.forEach((x) => {
        if (!x.isIntersecting) return; io.unobserve(x.target);
        setTimeout(() => { if (parseFloat(getComputedStyle(x.target).opacity) < .5) gsap.to(x.target, { opacity: 1, y: 0, duration: .6 }); }, 1500);
      }), { threshold: .01 });
      $$("[data-anim]").forEach((e) => io.observe(e));
    }
  }

  /* ============================ BOOT ============================ */
  function boot() {
    renderBlocks(); renderExperts(); renderPublications(); renderPost(); renderProfile(); renderPractice(); renderOpenings();
    initCarousels(); initHero(); initHeader(); initAnchors(); initForms(); initDisclaimer(); initAnimations();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
