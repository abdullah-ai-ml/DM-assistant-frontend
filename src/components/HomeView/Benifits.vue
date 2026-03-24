<template>
  <div>

    <!-- ── Benefits / Testimonials ── -->
    <section class="benefits-section">
      <div class="container mx-auto px-6 lg:px-12">

        <div class="benefits-grid">

          <!-- Left: Benefit list -->
          <div class="benefits-left">
            <div class="section-eyebrow">Why Marketers Love It</div>
            <h2 class="section-heading">
              Decisions that used<br/>
              to take days<br/>
              <em>take seconds.</em>
            </h2>
            <ul class="benefit-list">
              <li v-for="(b, i) in benefits" :key="i" class="benefit-item">
                <span class="benefit-check">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>{{ b }}</span>
              </li>
            </ul>
          </div>

          <!-- Right: Testimonial cards -->
          <div class="testimonials-col">
            <div
              v-for="(t, i) in testimonials"
              :key="i"
              class="testimonial-card"
              :class="i === 1 ? 'card-offset' : ''"
            >
              <div class="stars">★★★★★</div>
              <p class="t-quote">"{{ t.quote }}"</p>
              <div class="t-author">
                <div class="t-avatar" :style="{ background: t.color }">{{ t.initials }}</div>
                <div>
                  <div class="t-name">{{ t.name }}</div>
                  <div class="t-role">{{ t.role }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── Final CTA ── -->
    <section class="cta-section">
      <div class="container mx-auto px-6 lg:px-12">
        <div class="cta-inner">
          <div class="cta-glow"></div>
          <div class="cta-content">
            <h2 class="cta-heading">
              Ready to stop guessing<br/>
              <em>and start knowing?</em>
            </h2>
            <p class="cta-sub">
              Join thousands of marketing teams already using DManalyzer to turn raw data into clear action.
            </p>
            <div class="cta-buttons">
              <button class="cta-primary">
                Start Free — No credit card
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="cta-ghost">Schedule a demo</button>
            </div>
            <p class="cta-fine">14-day free trial · No setup fee · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
const benefits = [
  'Save 10+ hours per week on campaign analysis',
  'Get plain-English strategy — no data science degree needed',
  'Apply AI suggestions to live campaigns in one click',
  'Increase conversion rates by an average of 35%',
  'Reduce ad spend waste with intelligent optimization',
  'Unified analysis across Google, Meta, and more',
]

const testimonials = [
  {
    quote: "I used to spend Friday afternoons decoding dashboards. Now DManalyzer just tells me what's wrong and how to fix it. It's like having a senior strategist on call.",
    name: 'Sarah Chen',
    role: 'Head of Performance Marketing, Lumio',
    initials: 'SC',
    color: '#6366f1',
  },
  {
    quote: "The prompt-to-campaign feature alone saved us three hours on our last product launch. The AI-generated keywords were better than what we'd have written manually.",
    name: 'Marcus Webb',
    role: 'Paid Ads Lead, Stackline',
    initials: 'MW',
    color: '#10b981',
  },
  {
    quote: "Finally, a tool that explains results in a way I can paste straight into a client email. No translating metric-speak anymore.",
    name: 'Priya Nair',
    role: 'Founder, Signal Agency',
    initials: 'PN',
    color: '#f59e0b',
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Benefits ── */
.benefits-section {
  background: #ffffff;
  padding: 7rem 0;
  font-family: 'DM Sans', sans-serif;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}
@media (max-width: 900px) {
  .benefits-grid { grid-template-columns: 1fr; gap: 3rem; }
}

.section-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #6366f1;
  margin-bottom: 1rem;
}
.section-heading {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 400;
  color: #0a0a0a;
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
}
.section-heading em { font-style: italic; color: #6366f1; }

.benefit-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
}
.benefit-check {
  width: 22px; height: 22px;
  border-radius: 9999px;
  background: #ecfdf5;
  color: #10b981;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Testimonials */
.testimonials-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.testimonial-card {
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}
.testimonial-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.07); }
.card-offset { margin-left: 1.5rem; }
@media (max-width: 600px) { .card-offset { margin-left: 0; } }

.stars { font-size: 0.8rem; color: #f59e0b; margin-bottom: 0.75rem; letter-spacing: 2px; }
.t-quote {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.65;
  font-style: italic;
  margin-bottom: 1rem;
}
.t-author { display: flex; align-items: center; gap: 10px; }
.t-avatar {
  width: 36px; height: 36px;
  border-radius: 9999px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.t-name { font-size: 0.82rem; font-weight: 600; color: #111827; }
.t-role { font-size: 0.75rem; color: #9ca3af; }

/* ── CTA ── */
.cta-section {
  background: #0a0a0a;
  padding: 7rem 0;
  font-family: 'DM Sans', sans-serif;
}
.cta-inner {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}
.cta-glow {
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.cta-content { position: relative; }
.cta-heading {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 400;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
}
.cta-heading em { font-style: italic; color: #a5b4fc; }
.cta-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  max-width: 420px;
  margin: 0 auto 2.5rem;
  line-height: 1.65;
}
.cta-buttons { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 1.25rem; }

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  background: #ffffff;
  color: #0a0a0a;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
}
.cta-primary:hover { background: #e0e7ff; }

.cta-ghost {
  display: inline-flex;
  align-items: center;
  padding: 13px 24px;
  background: transparent;
  color: rgba(255,255,255,0.55);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}
.cta-ghost:hover { border-color: rgba(255,255,255,0.35); color: #fff; }

.cta-fine { font-size: 0.75rem; color: rgba(255,255,255,0.25); }
</style>