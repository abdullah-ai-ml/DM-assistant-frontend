<template>
  <section class="how-section">
    <div class="container mx-auto px-6 lg:px-12">

      <!-- Header -->
      <div class="section-header">
        <div class="section-eyebrow">How It Works</div>
        <h2 class="section-heading">
          From idea to<br/>
          <em>live campaign</em> in minutes
        </h2>
        <p class="section-sub">
          No spreadsheets. No guesswork. Just describe what you want and let AI handle the rest.
        </p>
      </div>

      <!-- Steps -->
      <div class="steps-grid">

        <!-- Step 1 -->
        <div class="step-card">
          <div class="step-number">01</div>
          <div class="step-icon-wrap step-icon-indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <h3 class="step-title">Describe Your Goal</h3>
          <p class="step-desc">
            Type a plain-English prompt like "Launch a search campaign for emergency plumbing in NYC with a $50/day budget." No forms. No settings. Just intent.
          </p>
          <!-- Mini prompt demo -->
          <div class="step-demo prompt-demo">
            <span class="prompt-cursor">›</span>
            <span class="prompt-text">Generate a campaign for a B2B SaaS tool targeting CTOs in fintech…</span>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="step-card">
          <div class="step-number">02</div>
          <div class="step-icon-wrap step-icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <h3 class="step-title">AI Builds Everything</h3>
          <p class="step-desc">
            Our LLM generates headlines, descriptions, keyword lists with match types, bidding strategy, ad schedule, and audience targeting — all pre-filled and ready to review.
          </p>
          <!-- Mini asset preview -->
          <div class="step-demo asset-demo">
            <div class="asset-row"><span class="asset-tag">Headline</span><span class="asset-val">Emergency Plumber NYC</span></div>
            <div class="asset-row"><span class="asset-tag">Keywords</span><span class="asset-val">12 generated ✓</span></div>
            <div class="asset-row"><span class="asset-tag">Strategy</span><span class="asset-val">Maximize Clicks</span></div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="step-card">
          <div class="step-number">03</div>
          <div class="step-icon-wrap step-icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h3 class="step-title">Get Plain-English Analysis</h3>
          <p class="step-desc">
            Once live, DManalyzer reads your performance data and explains it like a strategist — not a spreadsheet. One-click suggestions update your campaign instantly.
          </p>
          <!-- Mini insight card -->
          <div class="step-demo insight-demo">
            <p class="insight-text">
              "Your CTR dropped 18% on mobile this week — your ad copy doesn't address mobile intent. Try a shorter headline."
            </p>
            <button class="mini-apply">Apply fix →</button>
          </div>
        </div>

      </div>

      <!-- Connector line (decorative, desktop only) -->
      <div class="connector-line hidden lg:block"></div>

    </div>
  </section>
</template>

<script setup></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

.how-section {
  background: #ffffff;
  padding: 7rem 0;
  font-family: 'DM Sans', sans-serif;
  position: relative;
}

/* Section header */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
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
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 400;
  color: #0a0a0a;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}
.section-heading em {
  font-style: italic;
  color: #6366f1;
}
.section-sub {
  font-size: 1rem;
  color: #6b7280;
  max-width: 440px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Steps grid */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  position: relative;
}

/* Step card */
.step-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  transition: box-shadow 0.25s, transform 0.25s;
}
.step-card:hover {
  box-shadow: 0 20px 48px rgba(0,0,0,0.07);
  transform: translateY(-3px);
}

.step-number {
  font-family: 'Instrument Serif', serif;
  font-size: 3.5rem;
  font-weight: 400;
  color: #f3f4f6;
  line-height: 1;
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  user-select: none;
}

.step-icon-wrap {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.25rem;
}
.step-icon-indigo { background: #eef2ff; color: #6366f1; }
.step-icon-emerald { background: #ecfdf5; color: #10b981; }
.step-icon-amber { background: #fffbeb; color: #f59e0b; }

.step-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #0a0a0a;
  margin-bottom: 0.6rem;
}
.step-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.65;
  margin-bottom: 1.25rem;
}

/* Step demos */
.step-demo {
  border-radius: 10px;
  padding: 12px 14px;
}

/* Prompt demo */
.prompt-demo {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
}
.prompt-cursor {
  color: #6366f1;
  font-size: 1rem;
  margin-top: 1px;
  flex-shrink: 0;
}
.prompt-text {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  font-family: 'DM Mono', monospace, sans-serif;
  line-height: 1.5;
}

/* Asset demo */
.asset-demo {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.asset-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.asset-tag {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
  width: 68px;
  flex-shrink: 0;
}
.asset-val {
  font-size: 0.78rem;
  color: #374151;
  font-weight: 500;
}

/* Insight demo */
.insight-demo {
  background: #faf5ff;
  border: 1px solid #e9d5ff;
}
.insight-text {
  font-size: 0.78rem;
  color: #4b5563;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 10px;
}
.mini-apply {
  font-size: 0.72rem;
  font-weight: 600;
  color: #6366f1;
  background: #eef2ff;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;
}
.mini-apply:hover { background: #e0e7ff; }

/* Connector (decorative) */
.connector-line {
  position: absolute;
  top: calc(50% - 1px);
  left: calc(33.333% - 20px);
  right: calc(33.333% - 20px);
  height: 1px;
  background: linear-gradient(90deg, #e0e7ff, #bbf7d0, #fef3c7);
  z-index: 0;
  pointer-events: none;
}
</style>