<template>
  <section class="features-section">
    <div class="container mx-auto px-6 lg:px-12">

      <!-- Header -->
      <div class="section-header">
        <div class="section-eyebrow">Capabilities</div>
        <h2 class="section-heading">
          Everything your team<br/>
          <em>actually needs</em>
        </h2>
      </div>

      <!-- Feature bento grid -->
      <div class="bento-grid">

        <!-- Feature: NL Analysis — wide card -->
        <div class="bento-card bento-wide bento-dark">
          <div class="feat-eyebrow feat-eyebrow-indigo">Natural Language Analysis</div>
          <h3 class="feat-title feat-title-light">No more interpreting metrics.<br/>We explain them.</h3>
          <p class="feat-desc feat-desc-light">
            Instead of CTR graphs and ROAS tables, DManalyzer delivers a narrative: what changed, why it changed, and exactly what to do about it — in plain English you can share with any stakeholder.
          </p>
          <!-- NL sample -->
          <div class="nl-card">
            <div class="nl-header">
              <div class="nl-dot"></div>
              <span>Weekly Campaign Summary</span>
            </div>
            <p class="nl-body">
              Your retargeting campaign had its best week yet — 23% lower CPA driven by the new audience segment you added. However, your branded search keywords are showing signs of fatigue; 3 headlines haven't been rotated in 47 days. Swap them out and you should recover 8–12% CTR.
            </p>
          </div>
        </div>

        <!-- Feature: Prompt to campaign -->
        <div class="bento-card bento-accent">
          <div class="feat-eyebrow feat-eyebrow-white">Prompt-to-Campaign</div>
          <h3 class="feat-title feat-title-light">Describe it.<br/>We build it.</h3>
          <p class="feat-desc feat-desc-light">
            One sentence is all it takes. Our LLM generates a complete, publish-ready Google Ads campaign with keywords, ad copy, bidding and schedule.
          </p>
          <div class="prompt-box">
            <span class="pb-icon">›</span>
            <span class="pb-text">"Search campaign for SaaS HR tool, SMB audience, $80/day"</span>
          </div>
          <div class="arrow-row">
            <div class="arrow-line"></div>
            <span class="arrow-label">Generated in 4 seconds</span>
          </div>
          <div class="generated-chips">
            <span class="gen-chip">10 headlines</span>
            <span class="gen-chip">4 descriptions</span>
            <span class="gen-chip">18 keywords</span>
            <span class="gen-chip">Ad schedule</span>
          </div>
        </div>

        <!-- Feature: One-click suggestions -->
        <div class="bento-card">
          <div class="feat-eyebrow feat-eyebrow-emerald">One-Click Optimization</div>
          <h3 class="feat-title">Apply suggestions<br/>instantly</h3>
          <p class="feat-desc">
            AI continuously reviews live campaigns and surfaces prioritized suggestions. Click Apply and changes push directly to Google Ads — no login, no CSV exports.
          </p>
          <div class="suggestion-stack">
            <div class="sug-item sug-high">
              <span class="sug-badge badge-red">High impact</span>
              <span class="sug-text">Raise mobile bid adjustment +25%</span>
              <button class="sug-apply">Apply</button>
            </div>
            <div class="sug-item sug-med">
              <span class="sug-badge badge-amber">Medium</span>
              <span class="sug-text">Add 6 negative keywords</span>
              <button class="sug-apply">Apply</button>
            </div>
          </div>
        </div>

        <!-- Feature: Cross-platform -->
        <div class="bento-card">
          <div class="feat-eyebrow feat-eyebrow-indigo">Cross-Platform</div>
          <h3 class="feat-title">All channels,<br/>one view</h3>
          <p class="feat-desc">
            Google Search, Display, Shopping — unified into a single intelligent dashboard with cross-channel narrative analysis.
          </p>
          <div class="platform-row">
            <div class="platform-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4285F4" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/></svg>
              Google Ads
            </div>
            <div class="platform-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#1877F2" stroke-width="2"/><path d="M16 8h-2a2 2 0 00-2 2v2h4l-1 4h-3v6h-4v-6H6v-4h2v-2a6 6 0 016-6h2v4z" stroke="#1877F2" stroke-width="1.5" stroke-linejoin="round"/></svg>
              Meta Ads
            </div>
            <div class="platform-badge platform-soon">
              More soon
            </div>
          </div>
        </div>

        <!-- Feature: Stats wide card -->
        <div class="bento-card bento-wide bento-stats">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-num">38%</div>
              <div class="stat-label">avg CPA reduction</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-num">2,500+</div>
              <div class="stat-label">active campaigns</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-num">$5.2M+</div>
              <div class="stat-label">ad spend optimized monthly</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-num">&lt;4s</div>
              <div class="stat-label">analysis generation time</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

.features-section {
  background: #f9fafb;
  padding: 7rem 0;
  font-family: 'DM Sans', sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #6366f1;
  margin-bottom: 1rem;
}
.section-heading {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 400;
  color: #0a0a0a;
  line-height: 1.12;
  letter-spacing: -0.02em;
}
.section-heading em { font-style: italic; color: #6366f1; }

/* Bento grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.25rem;
}

.bento-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  grid-column: span 6;
  transition: box-shadow 0.25s, transform 0.25s;
}
.bento-card:hover {
  box-shadow: 0 16px 40px rgba(0,0,0,0.07);
  transform: translateY(-2px);
}
.bento-wide { grid-column: span 12; }
.bento-dark { background: #0a0a0a; border-color: #1f2937; }
.bento-accent { background: #4f46e5; border-color: #4338ca; }
.bento-stats { background: #0a0a0a; border-color: #1f2937; padding: 2.5rem 2rem; }

/* Responsive */
@media (max-width: 900px) {
  .bento-card, .bento-wide { grid-column: span 12; }
}
@media (min-width: 901px) and (max-width: 1200px) {
  .bento-card { grid-column: span 6; }
  .bento-wide { grid-column: span 12; }
}

/* Eyebrows */
.feat-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}
.feat-eyebrow-indigo { color: #6366f1; }
.feat-eyebrow-emerald { color: #10b981; }
.feat-eyebrow-white { color: rgba(255,255,255,0.6); }

/* Titles */
.feat-title {
  font-family: 'Instrument Serif', serif;
  font-size: 1.6rem;
  font-weight: 400;
  color: #0a0a0a;
  line-height: 1.2;
  margin-bottom: 0.75rem;
}
.feat-title-light { color: #ffffff; }

/* Desc */
.feat-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.65;
  margin-bottom: 1.5rem;
}
.feat-desc-light { color: rgba(255,255,255,0.55); }

/* NL card */
.nl-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 16px;
}
.nl-header {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}
.nl-dot {
  width: 7px; height: 7px;
  border-radius: 9999px;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}
.nl-body {
  font-size: 0.84rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.7;
  font-style: italic;
}

/* Prompt box */
.prompt-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 12px;
}
.pb-icon { color: #a5b4fc; font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
.pb-text { font-size: 0.78rem; color: rgba(255,255,255,0.65); line-height: 1.5; }

.arrow-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.arrow-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.04));
}
.arrow-label { font-size: 0.68rem; color: rgba(255,255,255,0.35); white-space: nowrap; }

.generated-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.gen-chip {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 4px 12px;
}

/* Suggestion stack */
.suggestion-stack { display: flex; flex-direction: column; gap: 8px; }
.sug-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid;
}
.sug-high { background: #fff1f2; border-color: #fecdd3; }
.sug-med  { background: #fffbeb; border-color: #fde68a; }
.sug-badge {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}
.badge-red   { background: #fee2e2; color: #dc2626; }
.badge-amber { background: #fef3c7; color: #d97706; }
.sug-text { font-size: 0.8rem; color: #374151; flex: 1; }
.sug-apply {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6366f1;
  background: #eef2ff;
  border: none;
  border-radius: 5px;
  padding: 4px 10px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  transition: background 0.15s;
}
.sug-apply:hover { background: #e0e7ff; }

/* Platform badges */
.platform-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 0.5rem; }
.platform-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 12px;
}
.platform-soon { color: #9ca3af; font-style: italic; }

/* Stats */
.stats-grid {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}
.stat-item { text-align: center; }
.stat-num {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 3vw, 2.8rem);
  color: #ffffff;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 6px;
}
.stat-label {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.4);
}
.stat-divider {
  width: 1px;
  height: 48px;
  background: rgba(255,255,255,0.08);
}
@media (max-width: 700px) {
  .stat-divider { display: none; }
  .stats-grid { gap: 1.5rem; }
}
</style>