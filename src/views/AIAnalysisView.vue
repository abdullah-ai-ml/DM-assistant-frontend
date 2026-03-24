<script setup>
import DashboardLayout from '@/components/Dashboard/DashboardLayout.vue';
import { useGoogleAdsStore } from '@/stores/googleAds';
import { ref, reactive } from 'vue';
import apiClient from '@/utils/axiosConf';
import { puter } from '@heyputer/puter.js';
import { storeToRefs } from 'pinia';


const googleStore = useGoogleAdsStore();
const { campaigns, selectedCustomer, manager_id } = googleStore;
const { insights } = storeToRefs(googleStore)

// ── Insight detail modal ────────────────────────────────────────
const modal = reactive({ open: false, campaignId: null });

// ── Performance config ──────────────────────────────────────────
const performanceConfig = {
  EXCELLENT: { label: 'Excellent', glow: '#10b981', dot: '#10b981', dim: 'rgba(16,185,129,.15)' },
  GOOD:      { label: 'Good',      glow: '#3b82f6', dot: '#3b82f6', dim: 'rgba(59,130,246,.15)' },
  AVERAGE:   { label: 'Average',   glow: '#f59e0b', dot: '#f59e0b', dim: 'rgba(245,158,11,.15)' },
  POOR:      { label: 'Poor',      glow: '#ef4444', dot: '#ef4444', dim: 'rgba(239,68,68,.15)'  },
  UNRATED:   { label: 'Unrated',   glow: '#6b7280', dot: '#6b7280', dim: 'rgba(107,114,128,.15)'},
};
function perf(label) {
  return performanceConfig[label?.toUpperCase()] ?? performanceConfig['UNRATED'];
}

// ── Get insight: axios → backend, then puter.js AI analysis ─────
async function getInsight(campaign) {
  insights.value[campaign.id] = { loading: true, data: null, error: null };
  try {
    // 1️⃣ Backend call via axiosClient
    const { data } = await apiClient.get(`/google/search/${campaign.id}/keywords`, {
      params: {
        customer_id: googleStore.selectedCustomer,
        manager_id:  googleStore.manager_id,
      }
    })

    const rawKeywords = data.keywords ?? campaign.keywords ?? [];

    // 2️⃣ Puter.js AI — interpret keywords + generate natural language analysis
    const prompt = `You are a Google Ads expert analyst.
Analyze the keywords of this campaign and return ONLY valid JSON — no markdown, no preamble.

Campaign: "${campaign.name}"
Performance: "${campaign.performance_label ?? 'UNKNOWN'}"
Backend insight: "${data.insight ?? ''}"
Keywords: ${JSON.stringify(rawKeywords)}

Return exactly this shape:
{
  "summary": "2-3 sentence plain-English summary of what these keywords reveal about the campaign strategy and its current performance state",
  "keywords": [
    {
      "keyword": "original keyword text",
      "match_type": "BROAD|PHRASE|EXACT",
      "intent": "informational|navigational|commercial|transactional",
      "quality": "strong|moderate|weak",
      "why": "one concise sentence explaining why this keyword matters or needs attention"
    }
  ],
  "suggestions": [
    {
      "keyword": "new keyword to add",
      "match_type": "BROAD|PHRASE|EXACT",
      "why": "why this keyword would improve the campaign's reach or conversions"
    }
  ],
  "overall_recommendation": "one actionable sentence — the single biggest improvement this campaign needs"
}`;

    const aiResp = await puter.ai.chat(
      [{ role: 'user', content: prompt }],
      { model: 'gpt-4o', temperature: 0.4 }
    );

    const raw = aiResp.message.content.replace(/```json/g,'').replace(/```/g,'').trim();
    const parsed = JSON.parse(raw);

    insights.value[campaign.id] = {
      loading: false,
      error: null,
      data: {
        backendInsight: data.insight ?? '',
        ...parsed,
      },
    };
  } catch (err) {
    insights.value[campaign.id] = {
      loading: false,
      data: null,
      error: err?.response?.data?.message ?? err.message ?? 'Failed to load insight.',
    };
  }
}

// ── Apply suggested keyword in bulk → PUT (matches updateKeywords pattern) ──
const applyingKw = reactive({}); // { [campaignId]: bool }

async function applyKeyword(campaign, suggestion) {
  const key = campaign.id;
  applyingKw[key] = true;
  try {
    // Merge existing analyzed keywords + the new suggestion, deduplicated
    const existingKeywords = insights.value[campaign.id]?.data?.keywords?.map(k => ({
      keyword:    k.keyword,
      match_type: k.match_type,
    })) ?? [];

    const alreadyExists = existingKeywords.some(k => k.keyword === suggestion.keyword);
    const keywords = alreadyExists
      ? existingKeywords
      : [...existingKeywords, { keyword: suggestion.keyword, match_type: suggestion.match_type }];

    const response = await apiClient.put(
      `/google/search/${campaign.id}/keywords`,
      {
        manager_id:  googleStore.manager_id,
        customer_id: googleStore.selectedCustomer,
        keywords,
      }
    );

    if (response.data.ok) {
      suggestion._applied = true;
    } else {
      console.error('Keyword update failed:', response.data.error);
    }
  } catch (err) {
    console.error('Failed to apply keyword:', err?.response?.data || err);
  } finally {
    applyingKw[key] = false;
  }
}

function openModal(campaignId) { modal.campaignId = campaignId; modal.open = true; }
function closeModal()          { modal.open = false; modal.campaignId = null; }

// ── Tag colour helpers ───────────────────────────────────────────
const qualityColor = { strong: '#10b981', moderate: '#f59e0b', weak: '#ef4444' };
const intentColor  = {
  transactional: '#818cf8', commercial: '#38bdf8',
  navigational:  '#a78bfa', informational: '#94a3b8',
};
</script>

<template>
  <DashboardLayout>
    <div class="page">

      <!-- Header -->
      <header class="page-header">
        <div>
          <p class="eyebrow">Google Ads</p>
          <h1 class="title">Campaigns</h1>
        </div>
        <div class="header-pill">{{ campaigns?.length ?? 0 }} active</div>
      </header>

      <!-- Empty -->
      <div v-if="!campaigns?.length" class="empty">
        <div class="empty-icon">◎</div>
        <p>No campaigns found for this account.</p>
      </div>

      <!-- ── Single-column campaign list ── -->
      <div v-else class="campaign-list">
        <div
          v-for="(campaign, i) in campaigns"
          :key="campaign.id"
          class="campaign-item"
          :style="{ animationDelay: `${i * 55}ms`, '--glow': perf(campaign.performance_label).glow }"
        >

          <!-- ══ Card ══ -->
          <div class="card">
            <div class="accent-bar" :style="{ background: perf(campaign.performance_label).glow }" />

            <div class="card-body">
              <!-- Row 1: name + badge -->
              <div class="card-row-top">
                <div class="campaign-name">
                  <span class="name-arrow">▸</span>
                  {{ campaign.name }}
                </div>
                <div
                  class="perf-badge"
                  :style="{
                    background: perf(campaign.performance_label).dim,
                    color:      perf(campaign.performance_label).dot,
                  }"
                >
                  <span class="dot" :style="{ background: perf(campaign.performance_label).dot }" />
                  {{ perf(campaign.performance_label).label }}
                </div>
              </div>

              <!-- Row 2: meta + button -->
              <div class="card-row-bottom">
                <span class="campaign-meta">
                  <span class="meta-tag">ID</span>{{ campaign.id }}
                  <template v-if="campaign.keywords?.length">
                    <span class="meta-sep">·</span>
                    <span class="meta-tag">KW</span>{{ campaign.keywords.length }}
                  </template>
                </span>
                <button
                  class="btn-insight"
                  :disabled="insights[campaign.id]?.loading"
                  @click="getInsight(campaign)"
                >
                  <span v-if="insights[campaign.id]?.loading" class="spinner" />
                  <template v-else>
                    <span class="btn-star" :style="{ color: perf(campaign.performance_label).glow }">✦</span>
                    {{ insights[campaign.id]?.data ? 'Refresh' : 'Get Insight' }}
                  </template>
                </button>
              </div>
            </div>
          </div>

          <!-- ══ Insight panel — below the card ══ -->
          <transition name="reveal">
            <div
              v-if="insights[campaign.id]?.data || insights[campaign.id]?.error"
              class="insight-panel"
              :style="{ '--glow': perf(campaign.performance_label).glow }"
            >
              <div class="insight-glow-top" />

              <!-- Error -->
              <template v-if="insights[campaign.id]?.error">
                <span class="ins-label is-err">⚠ Error</span>
                <p class="ins-body">{{ insights[campaign.id].error }}</p>
              </template>

              <!-- Success -->
              <template v-else>
                <!-- Summary + modal trigger -->
                <div class="ins-summary-row">
                  <div>
                    <span class="ins-label">✦ AI Analysis</span>
                    <p class="ins-body">{{ insights[campaign.id].data.summary }}</p>
                  </div>
                  <button class="btn-why" @click="openModal(campaign.id)">
                    Full breakdown <span>→</span>
                  </button>
                </div>

                <!-- Recommendation -->
                <div v-if="insights[campaign.id].data.overall_recommendation" class="rec-pill">
                  <span>⚡</span>
                  {{ insights[campaign.id].data.overall_recommendation }}
                </div>

                <!-- Suggested keyword chips -->
                <div v-if="insights[campaign.id].data.suggestions?.length" class="sug-section">
                  <p class="sug-label">Suggested keywords</p>
                  <div class="sug-chips">
                    <div
                      v-for="(sug, si) in insights[campaign.id].data.suggestions"
                      :key="si"
                      class="chip"
                      :class="{ 'chip-applied': sug._applied }"
                      :title="sug.why"
                    >
                      <span class="chip-kw">{{ sug.keyword }}</span>
                      <span class="chip-mt">{{ sug.match_type }}</span>
                      <button
                        v-if="!sug._applied"
                        class="chip-btn"
                        :disabled="applyingKw[campaign.id]"
                        @click="applyKeyword(campaign, sug)"
                      >
                        <span v-if="applyingKw[campaign.id]" class="chip-spin" />
                        <span v-else>+</span>
                      </button>
                      <span v-else class="chip-done">✓</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </transition>

        </div><!-- /campaign-item -->
      </div>

      <!-- ══════════════════════════
           KEYWORD BREAKDOWN MODAL
      ══════════════════════════ -->
      <teleport to="body">
        <transition name="mfade">
          <div
            v-if="modal.open && modal.campaignId && insights[modal.campaignId]?.data"
            class="modal-bg"
            @click.self="closeModal"
          >
            <transition name="mup">
              <div class="modal-box" v-if="modal.open">
                <div class="mhdr">
                  <div>
                    <p class="m-eyebrow">Keyword Intelligence</p>
                    <h2 class="m-title">{{ campaigns.find(c => c.id === modal.campaignId)?.name }}</h2>
                  </div>
                  <button class="m-close" @click="closeModal">✕</button>
                </div>

                <div class="mbody">

                  <!-- Summary -->
                  <div class="msec">
                    <p class="msec-lbl">Summary</p>
                    <p class="m-summary">{{ insights[modal.campaignId].data.summary }}</p>
                  </div>

                  <!-- Recommendation -->
                  <div v-if="insights[modal.campaignId].data.overall_recommendation" class="m-rec">
                    <span>⚡</span>
                    <p>{{ insights[modal.campaignId].data.overall_recommendation }}</p>
                  </div>

                  <!-- Existing keywords -->
                  <div v-if="insights[modal.campaignId].data.keywords?.length" class="msec">
                    <p class="msec-lbl">Keyword Analysis — why each keyword matters</p>
                    <div class="kw-list">
                      <div
                        v-for="(kw, ki) in insights[modal.campaignId].data.keywords"
                        :key="ki"
                        class="kw-row"
                      >
                        <div class="kw-top">
                          <span class="kw-text">{{ kw.keyword }}</span>
                          <div class="kw-tags">
                            <span class="ktag ktag-match">{{ kw.match_type }}</span>
                            <span
                              class="ktag"
                              :style="{ color: intentColor[kw.intent]??'#94a3b8', background:(intentColor[kw.intent]??'#94a3b8')+'18' }"
                            >{{ kw.intent }}</span>
                            <span
                              class="ktag"
                              :style="{ color: qualityColor[kw.quality]??'#94a3b8', background:(qualityColor[kw.quality]??'#94a3b8')+'18' }"
                            >{{ kw.quality }}</span>
                          </div>
                        </div>
                        <p class="kw-why">{{ kw.why }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Suggestions with full why -->
                  <div v-if="insights[modal.campaignId].data.suggestions?.length" class="msec">
                    <p class="msec-lbl">Suggested Additions — why to add each keyword</p>
                    <div class="kw-list">
                      <div
                        v-for="(sug, si) in insights[modal.campaignId].data.suggestions"
                        :key="si"
                        class="kw-row sug-row"
                        :class="{ 'sug-applied': sug._applied }"
                      >
                        <div class="kw-top">
                          <span class="kw-text">{{ sug.keyword }}</span>
                          <div class="kw-tags">
                            <span class="ktag ktag-match">{{ sug.match_type }}</span>
                            <span v-if="sug._applied" class="ktag ktag-done">✓ Added</span>
                            <button
                              v-else
                              class="chip-btn modal-add"
                              :disabled="applyingKw[modal.campaignId]"
                              @click="applyKeyword(campaigns.find(c=>c.id===modal.campaignId), sug)"
                            >
                              <span v-if="applyingKw[modal.campaignId]" class="chip-spin" />
                              <span v-else>+ Add</span>
                            </button>
                          </div>
                        </div>
                        <p class="kw-why sug-why">{{ sug.why }}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </transition>
          </div>
        </transition>
      </teleport>

    </div>
  </DashboardLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Fira+Code:wght@400;500&display=swap');

/* ── Page ── */
.page {
  min-height: 100vh;
  background: #07090e;
  padding: 36px 32px;
  font-family: 'Syne', sans-serif;
  color: #e2e8f0;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}
.eyebrow {
  font-size: 0.65rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: #1e2533;
  margin: 0 0 4px;
  font-family: 'Fira Code', monospace;
}
.title {
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #e2e8f0 20%, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.header-pill {
  font-family: 'Fira Code', monospace;
  font-size: 0.65rem;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(255,255,255,.025);
  border: 1px solid rgba(255,255,255,.06);
  color: #2d3748;
}

/* ── List ── */
.campaign-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 800px;
}

/* ── Item ── */
.campaign-item {
  display: flex;
  flex-direction: column;
  animation: fadeUp .38s ease both;
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ── Card ── */
.card {
  display: flex;
  align-items: stretch;
  background: linear-gradient(130deg, #0d1117, #090d14);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color .2s, box-shadow .2s;
}
.card:hover {
  border-color: rgba(255,255,255,.11);
  box-shadow: 0 0 24px rgba(0,0,0,.5);
}
.accent-bar {
  width: 3px;
  flex-shrink: 0;
  opacity: .65;
}
.card-body {
  flex: 1;
  padding: 13px 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

/* Row 1 */
.card-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.campaign-name {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  font-size: 0.9rem;
  color: #f1f5f9;
}
.name-arrow { color: #1e293b; font-size: 0.6rem; }

.perf-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 99px;
  font-family: 'Fira Code', monospace;
  font-size: 0.63rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  animation: pulse 2.2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

/* Row 2 */
.card-row-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.campaign-meta {
  font-family: 'Fira Code', monospace;
  font-size: 0.58rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 4px;
}
.meta-tag {
  font-size: 0.52rem;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: #374151;
}
.meta-sep { color: #1e293b; }

/* Button */
.btn-insight {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 13px;
  border-radius: 7px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  color: #4b5563;
  font-family: 'Syne', sans-serif;
  font-size: 0.73rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .17s;
  white-space: nowrap;
}
.btn-insight:hover:not(:disabled) {
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.15);
  color: #cbd5e1;
}
.btn-insight:disabled { opacity: .5; cursor: not-allowed; }
.btn-star { font-size: 0.52rem; }

/* Spinner */
.spinner {
  display: inline-block;
  width: 11px; height: 11px;
  border: 1.5px solid rgba(255,255,255,.1);
  border-top-color: #64748b;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to{transform:rotate(360deg)} }

/* ── Insight panel ── */
.insight-panel {
  margin-top: 2px;
  background: #060810;
  border: 1px solid rgba(255,255,255,.05);
  border-top: 2px solid color-mix(in srgb, var(--glow) 38%, transparent);
  border-radius: 0 0 11px 11px;
  padding: 15px 18px 17px;
  position: relative;
  overflow: hidden;
}
.insight-glow-top {
  position: absolute;
  top:0; left:0; right:0; height: 44px;
  background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--glow) 14%, transparent), transparent 70%);
  pointer-events: none;
}

.ins-label {
  display: block;
  font-family: 'Fira Code', monospace;
  font-size: 0.56rem;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--glow);
  opacity: .75;
  margin-bottom: 5px;
}
.ins-label.is-err { color: #ef4444; }
.ins-body {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.65;
  color: #64748b;
}

/* Summary row */
.ins-summary-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 11px;
}

/* "Full breakdown" button */
.btn-why {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 11px;
  border-radius: 6px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  color: #374151;
  font-family: 'Fira Code', monospace;
  font-size: 0.6rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all .16s;
  flex-shrink: 0;
}
.btn-why:hover { color: #94a3b8; border-color: rgba(255,255,255,.13); }

/* Recommendation */
.rec-pill {
  display: inline-flex;
  align-items: flex-start;
  gap: 7px;
  padding: 7px 12px;
  border-radius: 8px;
  background: rgba(245,158,11,.04);
  border: 1px solid rgba(245,158,11,.1);
  font-size: 0.76rem;
  color: #92400e;
  margin-bottom: 13px;
  line-height: 1.45;
}
.rec-pill span { color: #f59e0b; flex-shrink: 0; margin-top: 1px; }

/* Suggestions */
.sug-section { margin-top: 2px; }
.sug-label {
  font-family: 'Fira Code', monospace;
  font-size: 0.55rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #1e293b;
  margin-bottom: 7px;
}
.sug-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 5px 3px 9px;
  border-radius: 6px;
  background: rgba(255,255,255,.035);
  border: 1px solid rgba(255,255,255,.07);
  transition: border-color .14s;
}
.chip:hover { border-color: rgba(255,255,255,.12); }
.chip-applied { border-color: rgba(16,185,129,.2); background: rgba(16,185,129,.04); }
.chip-kw {
  font-family: 'Fira Code', monospace;
  font-size: 0.68rem;
  color: #94a3b8;
}
.chip-mt {
  font-family: 'Fira Code', monospace;
  font-size: 0.55rem;
  color: #374151;
  text-transform: uppercase;
}
.chip-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  border-radius: 4px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  color: #64748b;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all .14s;
}
.chip-btn:hover:not(:disabled) { background: rgba(255,255,255,.12); color: #e2e8f0; }
.chip-btn:disabled { opacity: .45; cursor: not-allowed; }
.chip-done { font-size: 0.6rem; color: #10b981; width: 18px; text-align: center; }
.chip-spin {
  display: inline-block;
  width: 8px; height: 8px;
  border: 1.5px solid rgba(255,255,255,.1);
  border-top-color: #64748b;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

/* Reveal transition */
.reveal-enter-active { transition: all .38s cubic-bezier(.16,1,.3,1); }
.reveal-leave-active { transition: all .2s ease; }
.reveal-enter-from   { opacity:0; transform:translateY(-8px); }
.reveal-leave-to     { opacity:0; transform:translateY(-4px); }

/* ══════════════
   MODAL
══════════════ */
.modal-bg {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(0,0,0,.84);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.modal-box {
  width: 100%;
  max-width: 660px;
  max-height: 88vh;
  background: #090c13;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 100px rgba(0,0,0,.9);
  position: relative;
}
.modal-box::before {
  content:'';
  position:absolute; top:0; left:0; right:0; height:1px;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
}

.mhdr {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 22px 15px;
  border-bottom: 1px solid rgba(255,255,255,.055);
  flex-shrink: 0;
}
.m-eyebrow {
  font-family: 'Fira Code', monospace;
  font-size: 0.58rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: #1e293b;
  margin: 0 0 4px;
}
.m-title {
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
  color: #f1f5f9;
}
.m-close {
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  color: #374151;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all .14s;
  flex-shrink: 0;
}
.m-close:hover { background: rgba(255,255,255,.09); color: #94a3b8; }

.mbody {
  overflow-y: auto;
  padding: 18px 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.06) transparent;
}
.mbody::-webkit-scrollbar { width: 3px; }
.mbody::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 2px; }

.msec {}
.msec-lbl {
  font-family: 'Fira Code', monospace;
  font-size: 0.56rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #1e293b;
  margin-bottom: 9px;
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(255,255,255,.04);
}
.m-summary {
  font-size: 0.83rem;
  line-height: 1.7;
  color: #64748b;
  margin: 0;
}
.m-rec {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 11px 14px;
  border-radius: 9px;
  background: rgba(245,158,11,.04);
  border: 1px solid rgba(245,158,11,.1);
}
.m-rec p { margin:0; font-size:0.8rem; color:#b45309; line-height:1.5; }
.m-rec span { color:#f59e0b; flex-shrink:0; margin-top:2px; }

/* Keyword rows in modal */
.kw-list { display:flex; flex-direction:column; gap:5px; }
.kw-row {
  padding: 9px 13px;
  border-radius: 8px;
  background: rgba(255,255,255,.02);
  border: 1px solid rgba(255,255,255,.05);
  transition: border-color .14s;
}
.kw-row:hover { border-color: rgba(255,255,255,.09); }
.sug-row { border-color: rgba(99,102,241,.1); background: rgba(99,102,241,.025); }
.sug-applied { border-color: rgba(16,185,129,.16); background: rgba(16,185,129,.03); }

.kw-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.kw-text {
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  color: #cbd5e1;
  font-weight: 500;
}
.kw-tags { display:flex; align-items:center; gap:4px; flex-shrink:0; }
.ktag {
  font-family: 'Fira Code', monospace;
  font-size: 0.58rem;
  padding: 2px 7px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
}
.ktag-match { background: rgba(255,255,255,.04); color: #2d3748; }
.ktag-done  { background: rgba(16,185,129,.1);   color: #10b981; }
.kw-why {
  margin: 0;
  font-size: 0.74rem;
  color: #2d3748;
  line-height: 1.55;
}
.sug-why { color: #374151; }

.modal-add {
  padding: 2px 9px;
  width: auto; height: auto;
  font-size: 0.62rem;
  border-radius: 5px;
}

/* Modal transitions */
.mfade-enter-active, .mfade-leave-active { transition: opacity .22s ease; }
.mfade-enter-from, .mfade-leave-to       { opacity:0; }
.mup-enter-active { transition: all .3s cubic-bezier(.16,1,.3,1); }
.mup-leave-active { transition: all .18s ease; }
.mup-enter-from   { opacity:0; transform:translateY(18px) scale(.97); }
.mup-leave-to     { opacity:0; transform:translateY(6px) scale(.98); }

/* Empty */
.empty {
  display:flex; flex-direction:column; align-items:center;
  gap:12px; padding:80px; color:#1e293b; text-align:center; font-size:0.83rem;
}
.empty-icon { font-size:2rem; opacity:.2; }
</style>