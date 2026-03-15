<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Strategy } from '../core/strategy';

const props = defineProps<{
  modelValue: Strategy;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Strategy): void;
}>();

const strategy = ref<Strategy>(JSON.parse(JSON.stringify(props.modelValue)));

watch(strategy, (newVal) => {
  emit('update:modelValue', newVal);
}, { deep: true });

const ranks = [
  { value: 1, label: 'A' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: 'T' },
  { value: 11, label: 'J' },
  { value: 12, label: 'Q' },
  { value: 13, label: 'K' }
];

</script>

<template>
  <div class="strategy-builder">
    <h3 class="title">{{ title }}</h3>
    
    <div class="form-group row">
      <label>1st Change Target:</label>
      <select v-model.number="strategy.r1Target">
        <option v-for="r in ranks" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
    </div>

    <div class="form-group row">
      <label>2nd Change Target:</label>
      <select v-model.number="strategy.r2Target">
        <option v-for="r in ranks" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
    </div>

    <div class="form-group row">
      <label>3rd Change Target:</label>
      <select v-model.number="strategy.r3Target">
        <option v-for="r in ranks" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
    </div>
    
    <div class="fallback-rule">
      <div class="rule-body">
        <ul>
          <li><strong>Badugi完成時</strong>は常にキープ(Stand Pat)。</li>
          <li>ターゲット以下の<strong>最強ハンド</strong>を残す(他はチェンジ)。1枚もなければ全チェンジ。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.strategy-builder {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.title {
  margin-top: 0;
  margin-bottom: 16px;
  color: #f8fafc;
  font-size: 1.25rem;
  border-bottom: 2px solid #64ffda;
  padding-bottom: 8px;
  display: inline-block;
}

.form-group {
  margin-bottom: 16px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.95rem;
}

.row label {
  color: #94a3b8;
  font-weight: 500;
  width: 140px;
}

select {
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  outline: none;
  font-weight: 600;
  font-size: 1rem;
  min-width: 80px;
  cursor: pointer;
}

select:focus {
  border-color: #64ffda;
  box-shadow: 0 0 8px rgba(100, 255, 218, 0.2);
}

.fallback-rule {
  margin-top: 24px;
  padding: 12px 12px 12px 24px;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #cbd5e1;
  border-left: 3px solid #0ea5e9;
  line-height: 1.6;
}

.fallback-rule ul {
  margin: 0;
  padding-left: 0;
}

.fallback-rule li {
  margin-bottom: 4px;
}

.fallback-rule li:last-child {
  margin-bottom: 0;
}
</style>
