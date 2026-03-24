<template>
  <section class="hero-section relative min-h-screen flex items-center overflow-hidden">

    <!-- Subtle grid texture -->
    <div class="grid-texture absolute inset-0 pointer-events-none"></div>

    <!-- Ink bleed accent blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="container mx-auto px-6 lg:px-12 relative z-10 pt-24 pb-16">
      <div class="grid lg:grid-cols-12 gap-8 items-center">

        <!-- Left: 7 cols -->
        <div class="lg:col-span-7 space-y-8">

          <!-- Eyebrow -->
          <div class="eyebrow-pill">
            <span class="eyebrow-dot"></span>
            <span>LLM-Powered Marketing Intelligence</span>
          </div>

          <!-- Headline -->
          <h1 class="hero-heading">
            Stop reading<br/>
            dashboards.<br/>
            <em>Start reading minds.</em>
          </h1>

          <!-- Sub -->
          <p class="hero-sub">
            DManalyzer turns your raw campaign data into plain-English strategy.
            Describe your goal, let our AI build the campaign, then watch it
            tell you exactly what to fix — in words, not numbers.
          </p>

          <!-- CTA row -->
          <div class="flex flex-wrap gap-4 items-center">
            <button class="cta-primary">
              Try It Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="cta-ghost">Watch 90-sec demo</button>
          </div>

          <!-- Social proof strip -->
          <div class="proof-strip">
            <div class="proof-avatars">
              <span class="avatar av1">JK</span>
              <span class="avatar av2">ML</span>
              <span class="avatar av3">SR</span>
              <span class="avatar av4">+</span>
            </div>
            <p class="proof-text">
              Trusted by <strong>2,500+</strong> marketing teams
            </p>
          </div>
        </div>

        <!-- Right: 5 cols — product preview card -->
        <div class="lg:col-span-5">
          <div class="product-card">

            <!-- Card header bar -->
            <div class="card-bar">
              <div class="bar-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="bar-label">Campaign Intelligence</span>
            </div>

            <!-- AI analysis block -->
            <div class="analysis-block">
              <div class="analysis-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                Live AI analysis
              </div>
              <p class="analysis-text">
                Your <strong>Google Search</strong> campaign is spending 62% of budget on broad-match keywords that convert at 0.4%. Shifting to exact-match for your top 8 terms could cut CPA by <strong>~$14</strong> and free up $1,200/mo for better-performing ad groups.
              </p>
            </div>

            <!-- Suggestion pill -->
            <div class="suggestion-row">
              <div class="suggestion-chip">
                <span class="chip-icon">✦</span>
                Shift 60% budget to exact-match keywords
              </div>
              <button class="apply-btn">Apply</button>
            </div>

            <div class="suggestion-row">
              <div class="suggestion-chip chip-amber">
                <span class="chip-icon">↗</span>
                Pause 3 underperforming ad groups
              </div>
              <button class="apply-btn">Apply</button>
            </div>

            <div class="suggestion-row">
              <div class="suggestion-chip chip-green">
                <span class="chip-icon">★</span>
                Add negative keywords: "free", "DIY"
              </div>
              <button class="apply-btn">Apply</button>
            </div>

            <!-- Projected lift -->
            <div class="lift-bar">
              <span class="lift-label">Projected CPA improvement</span>
              <span class="lift-value">−38%</span>
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

/* ── Section ── */
.hero-section {
  background: #0a0a0a;
  font-family: 'DM Sans', sans-serif;
}

/* Grid texture */
.grid-texture {
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* Blobs */
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  pointer-events: none;
}
.blob-1 {
  width: 480px; height: 480px;
  background: rgba(99, 102, 241, 0.12);
  top: -100px; right: -80px;
}
.blob-2 {
  width: 360px; height: 360px;
  background: rgba(16, 185, 129, 0.07);
  bottom: 0; left: 10%;
}

/* Eyebrow */
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.04em;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 9999px;
  background: #6366f1;
  box-shadow: 0 0 8px #6366f1;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Heading */
.hero-heading {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 400;
  line-height: 1.08;
  color: #ffffff;
  letter-spacing: -0.02em;
}
.hero-heading em {
  font-style: italic;
  color: #a5b4fc;
}

/* Sub */
.hero-sub {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.55);
  max-width: 520px;
}

/* CTAs */
.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #ffffff;
  color: #0a0a0a;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.cta-primary:hover { background: #e0e7ff; }

.cta-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}
.cta-ghost:hover { border-color: rgba(255,255,255,0.35); color: #fff; }

/* Proof strip */
.proof-strip {
  display: flex;
  align-items: center;
  gap: 12px;
}
.proof-avatars { display: flex; }
.avatar {
  width: 32px; height: 32px;
  border-radius: 9999px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; font-weight: 600;
  border: 2px solid #0a0a0a;
  margin-left: -8px;
  color: #fff;
}
.avatar:first-child { margin-left: 0; }
.av1 { background: #6366f1; }
.av2 { background: #10b981; }
.av3 { background: #f59e0b; }
.av4 { background: #374151; font-size: 0.75rem; }
.proof-text { font-size: 0.8rem; color: rgba(255,255,255,0.45); }
.proof-text strong { color: rgba(255,255,255,0.75); }

/* ── Product card ── */
.product-card {
  background: #111111;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);
}

/* Card top bar */
.card-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
}
.bar-dots { display: flex; gap: 5px; }
.bar-dots span {
  width: 10px; height: 10px; border-radius: 9999px;
  background: rgba(255,255,255,0.15);
}
.bar-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-left: 4px;
}

/* Analysis block */
.analysis-block {
  padding: 16px;
  margin: 16px;
  background: rgba(99,102,241,0.08);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 10px;
}
.analysis-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a5b4fc;
  margin-bottom: 8px;
}
.analysis-text {
  font-size: 0.82rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.65);
}
.analysis-text strong { color: #fff; }

/* Suggestion rows */
.suggestion-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 8px;
}
.suggestion-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 7px 10px;
  flex: 1;
}
.chip-amber { border-color: rgba(245,158,11,0.2); background: rgba(245,158,11,0.05); }
.chip-green { border-color: rgba(16,185,129,0.2); background: rgba(16,185,129,0.05); }
.chip-icon { font-size: 0.7rem; opacity: 0.6; }

.apply-btn {
  padding: 6px 12px;
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(99,102,241,0.15);
  color: #a5b4fc;
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 6px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;
}
.apply-btn:hover { background: rgba(99,102,241,0.3); }

/* Lift bar */
.lift-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin: 12px 16px 16px;
  background: rgba(16,185,129,0.07);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 10px;
}
.lift-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.lift-value { font-size: 1.1rem; font-weight: 700; color: #34d399; }
</style>