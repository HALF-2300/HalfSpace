'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { gravitationalTimeFactor } from '@/utils/halfspace/science';

interface WeightCalculatorProps {
  lang?: 'en' | 'ar';
}

export function NeutronStarWeightCalculator({ lang = 'en' }: WeightCalculatorProps) {
  const [volume, setVolume] = useState(1); // teaspoon
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    // 1 teaspoon = ~5 ml = 0.000005 m³
    // Neutron star density = ~10^17 kg/m³
    // Weight = volume × density × gravity (on Earth)
    const densityKgPerM3 = 1e17;
    const volumeM3 = volume * 0.000005;
    const massKg = volumeM3 * densityKgPerM3;
    const weightTons = massKg / 1000;
    setResult(weightTons);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="interactive-calculator"
    >
      <h4>{lang === 'ar' ? '🧮 حاسبة الوزن النيوتروني' : '🧮 Neutron Star Weight Calculator'}</h4>
      <p className="calc-description">
        {lang === 'ar' 
          ? 'احسب كم تزن ملعقة صغيرة من نجم نيوتروني على الأرض'
          : 'Calculate how much a teaspoon of neutron star would weigh on Earth'}
      </p>
      
      <div className="calc-input-group">
        <label>
          {lang === 'ar' ? 'الحجم (ملاعق صغيرة)' : 'Volume (teaspoons)'}
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="calc-slider"
        />
        <span className="calc-value">{volume.toFixed(1)}</span>
      </div>

      <button onClick={calculate} className="calc-button">
        {lang === 'ar' ? 'احسب الآن' : 'Calculate'}
      </button>

      {result !== null && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="calc-result"
        >
          <div className="result-label">
            {lang === 'ar' ? 'الكتلة التقريبية (طن متري):' : 'Estimated mass (metric tonnes):'}
          </div>
          <div className="result-value">
            {result >= 1e9 
              ? `${(result / 1e9).toFixed(2)} ${lang === 'ar' ? 'مليار طن' : 'billion tons'}`
              : result >= 1e6
              ? `${(result / 1e6).toFixed(2)} ${lang === 'ar' ? 'مليون طن' : 'million tons'}`
              : `${result.toFixed(0)} ${lang === 'ar' ? 'طن' : 'tons'}`
            }
          </div>
          <div className="result-comparison">
            {lang === 'ar' 
              ? `≈ ${(result / 7e10).toFixed(2)} × وزن جبل إيفرست`
              : `≈ ${(result / 7e10).toFixed(2)} × weight of Mount Everest`}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface TimeDilationCalculatorProps {
  lang?: 'en' | 'ar';
}

export function BlackHoleTimeDilation({ lang = 'en' }: TimeDilationCalculatorProps) {
  const [distance, setDistance] = useState(100); // in Schwarzschild radii
  const [timeElapsed, setTimeElapsed] = useState(1); // hours
  const [result, setResult] = useState<{ localTime: number; distantTime: number } | null>(null);

  const calculate = () => {
    // Simplified time dilation factor at distance r from black hole
    // t_distant = t_local / sqrt(1 - Rs/r)
    // where Rs is Schwarzschild radius
    const Rs = 1; // normalized
    const r = distance;
    const dilationFactor = gravitationalTimeFactor(r / Rs);
    
    const localTime = timeElapsed;
    const distantTime = timeElapsed * dilationFactor;

    setResult({ localTime, distantTime });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="interactive-calculator"
    >
      <h4>{lang === 'ar' ? '⏱️ حاسبة تباطؤ الزمن' : '⏱️ Time Dilation Calculator'}</h4>
      <p className="calc-description">
        {lang === 'ar'
          ? 'راصد ساكن خارج ثقب أسود غير دوّار مقارنة براصد بعيد؛ نهمل الحركة والدوران.'
          : 'Stationary observer outside a non-rotating black hole, compared with a distant observer. Motion and rotation are omitted.'}
      </p>

      <div className="calc-input-group">
        <label>
          {lang === 'ar' ? 'المسافة من الثقب الأسود' : 'Distance from Black Hole'}
        </label>
        <input
          type="range"
          min="1.1"
          max="100"
          step="0.5"
          value={distance}
          onChange={(e) => setDistance(parseFloat(e.target.value))}
          className="calc-slider"
        />
        <span className="calc-value">{distance.toFixed(1)} Rs</span>
      </div>

      <div className="calc-input-group">
        <label>
          {lang === 'ar' ? 'الوقت المحلي (ساعات)' : 'Local Time (hours)'}
        </label>
        <input
          type="range"
          min="0.1"
          max="24"
          step="0.1"
          value={timeElapsed}
          onChange={(e) => setTimeElapsed(parseFloat(e.target.value))}
          className="calc-slider"
        />
        <span className="calc-value">{timeElapsed.toFixed(1)} h</span>
      </div>

      <button onClick={calculate} className="calc-button">
        {lang === 'ar' ? 'احسب الآن' : 'Calculate'}
      </button>

      {result && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="calc-result"
        >
          <div className="result-row">
            <span className="result-label">
              {lang === 'ar' ? 'زمنك:' : 'Your time:'}
            </span>
            <span className="result-value">{result.localTime.toFixed(1)} h</span>
          </div>
          <div className="result-row">
            <span className="result-label">
              {lang === 'ar' ? 'الزمن البعيد:' : 'Distant time:'}
            </span>
            <span className="result-value">
              {result.distantTime >= 24 
                ? `${(result.distantTime / 24).toFixed(1)} ${lang === 'ar' ? 'يوم' : 'days'}`
                : `${result.distantTime.toFixed(1)} h`}
            </span>
          </div>
          <div className="result-comparison">
            {lang === 'ar'
              ? `الزمن أسرع بـ ${(result.distantTime / result.localTime).toFixed(2)}× بعيداً عنك`
              : `Time is ${(result.distantTime / result.localTime).toFixed(2)}× faster far away`}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
