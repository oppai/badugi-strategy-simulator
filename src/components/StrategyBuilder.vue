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
      <span class="desc">以下のカードで構成される役をキープ</span>
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
        <strong>Badugi(4枚)</strong> が完成している場合は常にそのまま(Stand Pat)キープします。<br/>
        各ラウンドでは、指定されたランク以下の「色がバラバラの最強ハンド」を残します。指定ランク以下のカードが1枚もない場合は全チェンジします。<br/>
        <small>※3rdチェンジではA2Txなど(TやT以下の3Tri)がある場合、特別にそれをキープして1枚チェンジします。</small>
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
  width: 130px;
}

.desc {
  font-size: 0.8rem;
  color: #64748b;
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
  padding: 12px;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #cbd5e1;
  border-left: 3px solid #0ea5e9;
  line-height: 1.5;
}
</style>
