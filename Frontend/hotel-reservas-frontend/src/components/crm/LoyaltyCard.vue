<template>
  <div class="loyalty-card" :class="`loyalty-card--${level}`">
    <div class="lc-top">
      <div class="lc-brand">
        <div class="lc-logo">O&B</div>
        <div>
          <div class="lc-hotel">Olive &amp; Bone</div>
          <div class="lc-program">Programa de Fidelidad</div>
        </div>
      </div>
      <div class="lc-level-badge">{{ levelLabel }}</div>
    </div>

    <div class="lc-points-area">
      <div class="lc-points">{{ points.toLocaleString() }}</div>
      <div class="lc-points-label">puntos disponibles</div>
    </div>

    <div class="lc-progress-area">
      <div class="lc-progress-info">
        <span>{{ levelLabel }}</span>
        <span v-if="level !== 'premium'">{{ nextLevelLabel }} ({{ nextMin.toLocaleString() }} pts)</span>
        <span v-else>Nivel máximo alcanzado ✨</span>
      </div>
      <div class="lc-progress-bar">
        <div class="lc-progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div class="lc-benefits">
      <div v-for="b in benefits" :key="b" class="lc-benefit">✓ {{ b }}</div>
    </div>

    <div class="lc-discount" v-if="descuento > 0">
      <span>Descuento activo</span>
      <strong>{{ descuento }}%</strong>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  points:   { type: Number, default: 0 },
  level:    { type: String, default: 'basico' },
  nextMin:  { type: Number, default: 500 },
  nextLevel:{ type: String, default: 'preferencial' },
  progress: { type: Number, default: 0 },
  descuento:{ type: Number, default: 0 },
});

const LABELS = { basico:'Básico', preferencial:'Preferencial', vip:'VIP', premium:'Premium' };
const levelLabel    = computed(() => LABELS[props.level]);
const nextLevelLabel = computed(() => LABELS[props.nextLevel]);

const BENEFITS = {
  basico:       ['Acceso estándar', 'Reserva online'],
  preferencial: ['Check-in prioritario', 'Descuento 5%', 'Amenidades de bienvenida'],
  vip:          ['Upgrade de habitación', 'Desayuno incluido', 'Descuento 10%', 'Check-out tardío'],
  premium:      ['Suite garantizada', 'Descuento 15%', 'Servicio personalizado', 'Acceso a spa', 'Traslado incluido'],
};
const benefits = computed(() => BENEFITS[props.level] ?? []);
</script>

<style scoped>
.loyalty-card {
  border-radius: 1.5rem;
  padding: 1.75rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,.2);
  min-height: 220px;
  display: flex; flex-direction: column; gap: 1.2rem;
}
.loyalty-card::before {
  content: '';
  position: absolute;
  top: -40%; right: -20%;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  pointer-events: none;
}
.loyalty-card--premium::before {
  background: radial-gradient(circle, rgba(212,175,55,.12) 0%, transparent 70%);
  width: 400px; height: 400px;
  top: -50%; right: -25%;
}
.loyalty-card--premium::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 220px; height: 220px;
  border-radius: 50%;
  border: 1px solid rgba(212,175,55,.08);
  pointer-events: none;
}
.loyalty-card--basico       { background: linear-gradient(135deg, #6a7c6b, #4a5d4b); }
.loyalty-card--preferencial { background: linear-gradient(135deg, #2e7d32, #1b5e20); }
.loyalty-card--vip          { background: linear-gradient(135deg, #b8860b, #8b6914); }
.loyalty-card--premium {
  background: linear-gradient(145deg, #080808 0%, #1a1210 40%, #0f0f0f 70%, #1c1410 100%);
  box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(212,175,55,.15), inset 0 1px 0 rgba(212,175,55,.1);
}

.lc-top { display: flex; justify-content: space-between; align-items: flex-start; }
.lc-brand { display: flex; gap: .75rem; align-items: center; }
.lc-logo  { width: 2.5rem; height: 2.5rem; border-radius: .75rem; background: rgba(255,255,255,.15);
            display: grid; place-items: center; font-weight: 900; font-size: .75rem; }
.loyalty-card--premium .lc-logo {
  background: linear-gradient(135deg, #c9a84c, #f0d080);
  color: #1a1a1a;
  box-shadow: 0 4px 12px rgba(201,168,76,.3);
}
.lc-hotel   { font-weight: 800; font-size: .9rem; }
.lc-program { font-size: .72rem; opacity: .7; }
.lc-level-badge { background: rgba(255,255,255,.15); padding: .3rem .75rem; border-radius: 99px;
                  font-size: .72rem; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
.loyalty-card--premium .lc-level-badge {
  background: linear-gradient(135deg, rgba(201,168,76,.25), rgba(240,208,128,.15));
  border: 1px solid rgba(212,175,55,.35);
  color: #f0d080;
  letter-spacing: .12em;
}

.lc-points       { font-size: 2.5rem; font-weight: 900; line-height: 1; }
.lc-points-label { font-size: .75rem; opacity: .7; margin-top: .2rem; }
.loyalty-card--premium .lc-points { color: #f0d080; text-shadow: 0 0 30px rgba(212,175,55,.3); }

.lc-progress-info { display: flex; justify-content: space-between; font-size: .72rem; opacity: .8; margin-bottom: .4rem; }
.lc-progress-bar  { height: 5px; background: rgba(255,255,255,.2); border-radius: 99px; overflow: hidden; }
.lc-progress-fill { height: 100%; background: white; border-radius: 99px; transition: width 600ms ease; }
.loyalty-card--premium .lc-progress-fill { background: linear-gradient(90deg, #c9a84c, #f0d080); box-shadow: 0 0 8px rgba(212,175,55,.5); }

.lc-benefits { display: flex; flex-wrap: wrap; gap: .4rem; }
.lc-benefit  { font-size: .72rem; background: rgba(255,255,255,.12); padding: .2rem .5rem;
               border-radius: 6px; opacity: .9; }

.lc-discount { display: flex; justify-content: space-between; align-items: center;
               background: rgba(255,255,255,.1); border-radius: .75rem; padding: .5rem .75rem;
               font-size: .8rem; }
.lc-discount strong { font-size: 1.1rem; }
</style>
