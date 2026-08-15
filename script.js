/* ========================================
   BAĞIŞ YARIŞMASI — JAVASCRIPT
   ======================================== */

// ── REAL DATA ──
const participants = [
    { name: "Sevgi İlçin", cost: 1750, donation: 1530 },
    { name: "Gülperi Yıldırım", cost: 8890, donation: 3125 },
    { name: "Rabia Kılıç", cost: 24725, donation: 13550 },
    { name: "Havva Karaköse", cost: 3335, donation: 1000 },
    { name: "Ümmü Gülsüm Akdeniz", cost: 15635, donation: 6470 },
    { name: "Zeynep Hazal Çeten", cost: 54000, donation: 112940 },
    { name: "Nidanur Aksu", cost: 85285, donation: 100000 },
    { name: "Zeynep Şen", cost: 40280, donation: 49450 },
    { name: "Hatice Kübra Temizkan", cost: 13460, donation: 7365 },
    { name: "Fatmanur Altun", cost: 30000, donation: 30465 }
];

// Sort by donation descending
participants.sort((a, b) => b.donation - a.donation);

// ── FORMAT CURRENCY ──
function formatCurrency(amount) {
    return new Intl.NumberFormat("tr-TR").format(amount) + " ₺";
}

// ── ANIMATE COUNTER ──
function animateCounter(element, target, suffix = "", duration = 1800) {
    if (!element) return;
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = new Intl.NumberFormat("tr-TR").format(current) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// ── POPULATE HERO STATS ──
function populateStats() {
    const totalDonors = participants.length;
    const totalDonation = participants.reduce((sum, p) => sum + p.donation, 0);
    const totalCost = participants.reduce((sum, p) => sum + p.cost, 0);

    animateCounter(document.getElementById("totalDonors"), totalDonors, "");
    animateCounter(document.getElementById("totalDonation"), totalDonation, " ₺");
    animateCounter(document.getElementById("totalCost"), totalCost, " ₺");
}

// ── POPULATE SUMMARY CARDS ──
function populateSummaryCards() {
    const totalDonation = participants.reduce((sum, p) => sum + p.donation, 0);
    const totalCost = participants.reduce((sum, p) => sum + p.cost, 0);
    const totalProfit = totalDonation - totalCost;

    animateCounter(document.getElementById("summaryCost"), totalCost, " ₺");
    animateCounter(document.getElementById("summaryDonation"), totalDonation, " ₺");
    
    const profitEl = document.getElementById("summaryProfit");
    if (profitEl) {
        animateCounter(profitEl, Math.abs(totalProfit), " ₺");
        if (totalProfit < 0) {
            profitEl.classList.add("negative");
            profitEl.textContent = "-" + profitEl.textContent; // Handle sign after animation or just let it be handled by CSS if possible, but actually we need text update. Wait, animateCounter ignores negative. We'll adjust the text format.
        }
    }
}

// Custom animation for Profit to handle negative correctly
function animateProfit(element, target, duration = 1800) {
    if (!element) return;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = new Intl.NumberFormat("tr-TR").format(current) + " ₺";

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

function initSummaryCards() {
    const totalDonation = participants.reduce((sum, p) => sum + p.donation, 0);
    const totalCost = participants.reduce((sum, p) => sum + p.cost, 0);
    const totalProfit = totalDonation - totalCost;

    animateCounter(document.getElementById("summaryCost"), totalCost, " ₺");
    animateCounter(document.getElementById("summaryDonation"), totalDonation, " ₺");
    
    const profitEl = document.getElementById("summaryProfit");
    if (profitEl) {
        if (totalProfit < 0) profitEl.classList.add("negative");
        animateProfit(profitEl, totalProfit);
    }
}


// ── POPULATE BAR CHART ──
function populateBarChart() {
    const container = document.getElementById("barChartContainer");
    if (!container) return;

    container.innerHTML = "";
    
    const maxVal = Math.max(...participants.flatMap(p => [p.cost, p.donation]));

    participants.forEach((p) => {
        const donationPct = (p.donation / maxVal) * 100;
        const costPct = (p.cost / maxVal) * 100;

        const row = document.createElement("div");
        row.className = "chart-row";
        
        row.innerHTML = `
            <div class="chart-label">${p.name}</div>
            <div class="chart-bars">
                <div class="chart-bar-wrapper">
                    <div class="bar donation" style="width: 0" data-width="${donationPct}%"></div>
                    <div class="bar-value donation-val">${formatCurrency(p.donation)}</div>
                </div>
                <div class="chart-bar-wrapper">
                    <div class="bar cost" style="width: 0" data-width="${costPct}%"></div>
                    <div class="bar-value cost-val">${formatCurrency(p.cost)}</div>
                </div>
            </div>
        `;
        container.appendChild(row);
    });

    // Animate bars when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const rows = container.querySelectorAll('.chart-row');
    rows.forEach(row => observer.observe(row));
}


// ── POPULATE PODIUM ──
function populatePodium() {
    const medals = ["🥇", "🥈", "🥉", "🏅"];
    for (let i = 0; i < 4 && i < participants.length; i++) {
        const el = document.getElementById(`podium-${i + 1}`);
        if (!el) continue;
        const p = participants[i];
        const profit = p.donation - p.cost;
        
        el.querySelector(".podium-avatar").textContent = medals[i];
        el.querySelector(".podium-name").textContent = p.name;
        
        const details = el.querySelectorAll(".podium-detail span");
        if (details.length >= 3) {
            details[0].textContent = formatCurrency(p.donation);
            details[1].textContent = formatCurrency(p.cost);
            details[2].textContent = formatCurrency(profit);
            if (profit < 0) details[2].parentElement.classList.add("negative");
        }
    }
}

// ── POPULATE TABLE ──
function populateTable() {
    const tbody = document.getElementById("leaderboardBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    participants.forEach((p, idx) => {
        const rank = idx + 1;
        const tr = document.createElement("tr");

        let rankClass = "";
        if (rank === 1) rankClass = "rank-gold";
        else if (rank === 2) rankClass = "rank-silver";
        else if (rank === 3) rankClass = "rank-bronze";

        const rankBadge = rankClass
            ? `<span class="rank-badge ${rankClass}">${rank}</span>`
            : rank;

        tr.innerHTML = `
            <td class="td-rank">${rankBadge}</td>
            <td class="td-name">${p.name}</td>
            <td class="td-amount td-cost">${formatCurrency(p.cost)}</td>
            <td class="td-amount td-donation">${formatCurrency(p.donation)}</td>
        `;

        tbody.appendChild(tr);
    });
}

// ── NAVBAR SCROLL EFFECT ──
function initNavbar() {
    const navbar = document.getElementById("navbar");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            navToggle.classList.toggle("active");
        });
    }

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            navToggle.classList.remove("active");
        });
    });

    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                    link.classList.add("active");
                }
            }
        });
    });
}

// ── FAQ ACCORDION ──
function initFAQ() {
    const items = document.querySelectorAll(".faq-item");
    items.forEach(item => {
        const btn = item.querySelector(".faq-question");
        btn.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            items.forEach(i => i.classList.remove("active"));
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}

// ── SCROLL REVEAL ──
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".section-header, .podium-card, .sartname-block, .about-content, .value-item, .faq-item, .table-wrapper, .summary-card"
    );

    revealElements.forEach(el => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(el => observer.observe(el));
}

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
    populateStats();
    initSummaryCards();
    populateBarChart();
    populateTable();
    initNavbar();
    initScrollReveal();
});
