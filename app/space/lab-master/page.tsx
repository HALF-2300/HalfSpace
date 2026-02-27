"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./lab-master.module.css";

const CHALLENGES = [
  {
    id: "cosmo-archaeology",
    label: "Cosmic Archeology",
    prompt:
      "Use the Cosmology tool to state the lookback time at z = 5. What era of the universe does that correspond to?",
    topic: "Cosmology",
    points: 12,
  },
  {
    id: "cosmo-distance",
    label: "Distance Debate",
    prompt:
      "Redshift 2.7 maps to a comoving distance. Compare that distance to the Milky Way’s size (≈100 kly): how many Milky Ways fit?",
    topic: "Cosmology",
    points: 10,
  },
  {
    id: "stellar-lifetime",
    label: "Longevity Check",
    prompt:
      "Pick a 0.8 M☉ star in the Stellar tool. Predict its lifetime and how it would feel as a main-sequence star.",
    topic: "Stellar Evolution",
    points: 9,
  },
  {
    id: "stellar-endpoint",
    label: "Fate Mapping",
    prompt:
      "Why does a 20 M☉ star end as a black hole in our Stellar tool? List the forces that fail to balance gravity.",
    topic: "Stellar Evolution",
    points: 11,
  },
  {
    id: "stellar-steps",
    label: "Step Navigator",
    prompt:
      "Trace the star life cycle steps from cloud to endpoint and note where energy generation shifts from fusion to degeneracy pressure.",
    topic: "Stellar Evolution",
    points: 8,
  },
  {
    id: "relativity-radius",
    label: "Event Horizon Guess",
    prompt:
      "Enter 10 M☉ into the Relativity tool. Compare the Schwarzschild radius to a typical neutron star radius (≈12 km). What does that tell you?",
    topic: "Relativity",
    points: 10,
  },
  {
    id: "relativity-escape",
    label: "Escape Velocity Drill",
    prompt:
      "With the Relativity tool, increase the radius gradually until the escape velocity drops below 0.1 c. How far out is the escape horizon?",
    topic: "Relativity",
    points: 10,
  },
  {
    id: "relativity-warning",
    label: "Warning Triage",
    prompt:
      "Explain why the warning about Kerr and charged black holes matters when using our simple formulas.",
    topic: "Relativity",
    points: 7,
  },
  {
    id: "tool-dance",
    label: "Cross-tool Story",
    prompt:
      "Pick one cosmology output and one relativity output. Craft a two-sentence story that connects cosmic expansion to spacetime curvature.",
    topic: "Integration",
    points: 6,
  },
  {
    id: "lab-mission",
    label: "Mission Log",
    prompt:
      "Summarize how the three tools together help you feel the scale from photons to stars to black holes. What experiments would you run next?",
    topic: "Synthesis",
    points: 5,
  },
];

const STELLAR_STEPS = [
  "1) Molecular cloud collapses under gravity and fragments.",
  "2) Protostar forms, heating as material accretes and releasing gravitational energy.",
  "3) Core pressure and temperature rise until hydrogen fusion ignites (main sequence).",
  "4) Fusion product buildup causes expansion; the star leaves the main sequence as red giant/supergiant.",
  "5) The core contracts, fusion shells move outward, and heavy elements form via alpha-capture.",
  "6) The unresolved core determines the endpoint: white dwarf, neutron star, or black hole.",
];

const ensureLength = <T,>(array: T[] | undefined, length: number, defaultValue: T) => {
  const working = Array.isArray(array) ? Array.from(array) : [];
  while (working.length < length) {
    working.push(defaultValue);
  }
  return working.slice(0, length);
};

const DEFAULT_STATE = {
  cosmologyZ: 1.8,
  stellarMass: 3,
  relativityMass: 8.5,
  relativityRadius: 25,
  explainMode: true,
  challengeMode: true,
  challengeProgress: new Array(CHALLENGES.length).fill(false),
  challengeNotes: new Array(CHALLENGES.length).fill(""),
};

type LabState = typeof DEFAULT_STATE;

const HUBBLE_CONSTANT = 70;
const SPEED_OF_LIGHT_KM_S = 299792.458;
const SOLAR_MASS_KG = 1.98847e30;
const G_NEWTON = 6.6743e-11;

const readNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  return fallback;
};

export default function SpaceLabMasterPage() {
  const [state, setState] = useState<LabState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }
    const stored = window.localStorage.getItem("space-lab-master");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState((prev) => ({
          ...prev,
          cosmologyZ: readNumber(parsed.cosmologyZ, prev.cosmologyZ),
          stellarMass: readNumber(parsed.stellarMass, prev.stellarMass),
          relativityMass: readNumber(parsed.relativityMass, prev.relativityMass),
          relativityRadius: readNumber(parsed.relativityRadius, prev.relativityRadius),
          explainMode: typeof parsed.explainMode === "boolean" ? parsed.explainMode : prev.explainMode,
          challengeMode: typeof parsed.challengeMode === "boolean" ? parsed.challengeMode : prev.challengeMode,
          challengeProgress: ensureLength(parsed.challengeProgress, CHALLENGES.length, false),
          challengeNotes: ensureLength(parsed.challengeNotes, CHALLENGES.length, ""),
        }));
      } catch (error) {
        console.warn("Failed to parse saved lab state", error);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("space-lab-master", JSON.stringify(state));
  }, [state, hydrated]);

  const cosmologyZ = Math.max(0, state.cosmologyZ);

  const cosmologyResults = useMemo(() => {
    const lookbackCoefficient = 9.78 * (100 / HUBBLE_CONSTANT);
    const lookbackTime = lookbackCoefficient * (cosmologyZ / (1 + cosmologyZ));
    const hubbleDistanceMpc = SPEED_OF_LIGHT_KM_S / HUBBLE_CONSTANT;
    const comovingDistanceMpc = hubbleDistanceMpc * cosmologyZ;
    const comovingDistanceGly = (comovingDistanceMpc * 3.26e6) / 1e9;
    return {
      lookbackTime: Number(lookbackTime.toFixed(2)),
      comovingDistanceGly: Number(comovingDistanceGly.toFixed(2)),
    };
  }, [cosmologyZ]);

  const stellarLifetime = useMemo(() => {
    const mass = Math.max(0.08, state.stellarMass);
    const lifetime = 10 * Math.pow(mass, -2.5);
    let endpoint: "White Dwarf" | "Neutron Star" | "Black Hole" = "White Dwarf";
    if (mass >= 20) {
      endpoint = "Black Hole";
    } else if (mass >= 3) {
      endpoint = "Neutron Star";
    }
    return {
      mass,
      lifetime: Number(lifetime.toFixed(2)),
      endpoint,
    };
  }, [state.stellarMass]);

  const relativityResults = useMemo(() => {
    const massSolar = Math.max(0.5, state.relativityMass);
    const radiusKm = Math.max(1, state.relativityRadius);
    const massKg = massSolar * SOLAR_MASS_KG;
    const radiusMeters = radiusKm * 1000;
    const schwarzschildRadiusMeters = (2 * G_NEWTON * massKg) / (SPEED_OF_LIGHT_KM_S * 1000) ** 2;
    const schwarzschildRadiusKm = schwarzschildRadiusMeters / 1000;
    const escapeMetersPerSecond = Math.sqrt((2 * G_NEWTON * massKg) / radiusMeters);
    const escapeFractionOfC = escapeMetersPerSecond / (SPEED_OF_LIGHT_KM_S * 1000);
    const escapeKmPerSecond = escapeMetersPerSecond / 1000;
    return {
      schwarzschildRadiusKm: Number(schwarzschildRadiusKm.toFixed(3)),
      escapeVelocity: Number(escapeKmPerSecond.toFixed(0)),
      escapeFractionOfC: Number(escapeFractionOfC.toFixed(3)),
    };
  }, [state.relativityMass, state.relativityRadius]);

  const challengeScore = useMemo(() => {
    return CHALLENGES.reduce((acc, challenge, index) => {
      if (state.challengeProgress[index]) {
        return acc + challenge.points;
      }
      return acc;
    }, 0);
  }, [state.challengeProgress]);

  const challengeCompletion = Math.round(
    (state.challengeProgress.filter(Boolean).length / CHALLENGES.length) * 100
  );

  const toggleProgress = (index: number) => {
    setState((prev) => {
      const nextProgress = [...prev.challengeProgress];
      nextProgress[index] = !nextProgress[index];
      return {
        ...prev,
        challengeProgress: nextProgress,
      };
    });
  };

  const updateNote = (index: number, value: string) => {
    setState((prev) => {
      const nextNotes = [...prev.challengeNotes];
      nextNotes[index] = value;
      return {
        ...prev,
        challengeNotes: nextNotes,
      };
    });
  };

  const toggleExplainMode = () =>
    setState((prev) => ({
      ...prev,
      explainMode: !prev.explainMode,
    }));

  const toggleChallengeMode = () =>
    setState((prev) => ({
      ...prev,
      challengeMode: !prev.challengeMode,
    }));

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <p>Space Lab Master — خُبرة رؤية علمية تنقّل المفاهيم الكبيرة لأدوات تقدر تستعملها بعينك.</p>
        <h1>SPACE LAB MASTER</h1>
        <p>
          ثلاثة أدوات تحسب زعزعة الكون، عمر النجوم، ومفاتيح النسبية. كل نتيجة محفوظة محلياً حتى تواصل
          تجربة الأدوات لاحقاً.
        </p>
      </header>

      <div className={styles.modeBar}>
        <button
          className={`${styles.modeButton} ${state.explainMode ? styles.active : ""}`}
          onClick={toggleExplainMode}
          type="button"
        >
          Explain Mode {state.explainMode ? "ON" : "OFF"}
        </button>
        <button
          className={`${styles.modeButton} ${state.challengeMode ? styles.active : ""}`}
          onClick={toggleChallengeMode}
          type="button"
        >
          Challenge Mode {state.challengeMode ? "ON" : "OFF"}
        </button>
      </div>

      <div className={styles.statusBar}>
        <span className={styles.statusBadge}>Inputs + progress saved locally</span>
        <span>Challenge score: <strong>{challengeScore}</strong> pts</span>
        <span>Completion: {challengeCompletion}%</span>
      </div>

      <section className={styles.tools}>
        <article className={styles.toolCard}>
          <div className={styles.toolHeader}>
            <h2>Cosmology Tool</h2>
            <p>Redshift → Lookback time + distance (تقريب)</p>
          </div>
          <div className={styles.inputRow}>
            <label className={styles.labelWithInput}>
              Redshift (z)
              <input
                type="number"
                min="0"
                step="0.01"
                value={cosmologyZ}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    cosmologyZ: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.resultRow}>
                <td>Lookback time</td>
                <td>{cosmologyResults.lookbackTime.toLocaleString()} Gyr</td>
              </tr>
              <tr className={styles.resultRow}>
                <td>Comoving distance</td>
                <td>{cosmologyResults.comovingDistanceGly.toLocaleString()} Gly</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.describe}>
            الضوء الذي نراه في هذا اللحظة انبعث حين كان الكون أصغر، والجدول يربط z بزمن انبعاثه
            والمسافة الحالية التي يشغلها المصدر.
          </p>
          {state.explainMode && (
            <div className={styles.explainBlock}>
              <strong>Explain mode steps</strong>
              <ol className={styles.explainSteps}>
                <li>Redshift z يمثّل توسع الفضاء بين وقت انطلاق الفوتون والآن.</li>
                <li>
                  Lookback time استخدام معامل هابل (H₀ = {HUBBLE_CONSTANT}) لتقدير الزمن الذي استغرقه
                  الضوء حتى يصل إلينا.
                </li>
                <li>
                  Comoving distance يحول سرعة التوسع إلى طول حقيقي يفترض أن التوسع يتوقف لحظة
                  التشبيه.
                </li>
              </ol>
              <div className={styles.terms}>
                <span>
                  <strong>Redshift:</strong> نسبة تمدد الطول الموجي عند مرور الضوء عبر الفضاء المتوسع.
                </span>
                <span>
                  <strong>Lookback time:</strong> عمر الضوء منذ خروجه من المصدر نحو الأرض.
                </span>
                <span>
                  <strong>Comoving distance:</strong> بعد مبسّط لا يضيف توسعًا إضافيًا للوقت.
                </span>
              </div>
            </div>
          )}
        </article>

        <article className={styles.toolCard}>
          <div className={styles.toolHeader}>
            <h2>Stellar Tool</h2>
            <p>Mass → Lifetime + Endpoint + لماذا؟</p>
          </div>
          <div className={styles.inputRow}>
            <label className={styles.labelWithInput}>
              Mass (M☉)
              <input
                type="number"
                min="0.08"
                step="0.1"
                value={state.stellarMass}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    stellarMass: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.resultRow}>
                <td>Lifetime</td>
                <td>{stellarLifetime.lifetime.toLocaleString()} Gyr</td>
              </tr>
              <tr className={styles.resultRow}>
                <td>Endpoint</td>
                <td>{stellarLifetime.endpoint}</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.describe}>
            كتلة النجم تحكم شدة الضغط الجاذبي، وكلما كان أكبر، أسرع يحرق وقوده، وفي النهاية فقط
            الأجسام التي تناسب الكتلة تحتفظ بما يكفي من ضغط دون حرق نفسه كله.
          </p>
          <div className={styles.stepsList}>
            {STELLAR_STEPS.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
          {state.explainMode && (
            <div className={styles.explainBlock}>
              <strong>Explain mode terms</strong>
              <div className={styles.terms}>
                <span>
                  <strong>Fusion balance:</strong> التوازن بين الضغط والاندفاع الحراري في قلب النجم.
                </span>
                <span>
                  <strong>Degeneracy pressure:</strong> ضغط إلكتروني/نيتروني يمنع الانهيار الى الأبد.
                </span>
                <span>
                  <strong>Endpoint:</strong> الحالة التي يصل إليها النجم عندما لا يستطيع المصدر تمديد
                  ضغطه أكثر.
                </span>
              </div>
            </div>
          )}
        </article>

        <article className={styles.toolCard}>
          <div className={styles.toolHeader}>
            <h2>Relativity Tool</h2>
            <p>Schwarzschild radius + escape velocity + معنى أفق الحدث</p>
          </div>
          <div className={styles.inputRow}>
            <label className={styles.labelWithInput}>
              Mass (M☉)
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={state.relativityMass}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    relativityMass: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className={styles.labelWithInput}>
              Radius (km)
              <input
                type="number"
                min="1"
                step="1"
                value={state.relativityRadius}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    relativityRadius: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.resultRow}>
                <td>Schwarzschild radius</td>
                <td>{relativityResults.schwarzschildRadiusKm} km</td>
              </tr>
              <tr className={styles.resultRow}>
                <td>Escape velocity</td>
                <td>
                  {relativityResults.escapeVelocity.toLocaleString()} km/s ({relativityResults.escapeFractionOfC}
                  c)
                </td>
              </tr>
            </tbody>
          </table>
          <p className={styles.describe}>
            أفق الحدث هو نصف قطر مخروط الضوء؛ أي ما دونه يتجه الضوء نحو الداخل بلا رجعة، وأي
            إسقاط بعيداً عنه يحتاج سرعة تفوق سرعة الضوء كي يهرب.
          </p>
          <div className={styles.warning}>
            تحذير: الحسابات تقريبية وتفشل عند النجوم الدوّارة (Kerr) أو المشحونة؛ لا تأخذ هذه
            الأرقام كقانون، بل كمساحة تخطيط.
          </div>
          {state.explainMode && (
            <div className={styles.explainBlock}>
              <strong>Explain mode steps</strong>
              <ol className={styles.explainSteps}>
                <li>
                  نبدأ بمضاعفة ثابت الجاذبية وكتلة الشمس لنحولها إلى المتر، ثم نطرح سرعة الضوء
                  لتحديد نصف القطر الحر.
                </li>
                <li>
                  سرعة الهروب = √(2GM/r)، تعني كمية الطاقة الحركية اللازمة لتجاوز الجاذبية عند
                  هذا النصف القطر.
                </li>
                <li>
                  إذا كانت سرعة الهروب ≥ c فهذا يعني أن الضوء لا يمكنه الهرب، ويُعرف ذلك بأفق الحدث.
                </li>
              </ol>
              <div className={styles.terms}>
                <span>
                  <strong>Schwarzschild radius:</strong> نصف قطر ثقب أسود غير دوّار ولا مشحون.
                </span>
                <span>
                  <strong>Escape velocity:</strong> السرعة اللازمة لتتخطى طاقة الجاذبية عند r.
                </span>
                <span>
                  <strong>Event horizon:</strong> الحد الذي يسيطر فيه انحناء الزمكان على مسار الضوء.
                </span>
              </div>
            </div>
          )}
        </article>
      </section>

      {state.challengeMode && (
        <section className={styles.challengeSection}>
          <div className={styles.challengeHeader}>
            <div>
              <h3>Challenge Mode — حُسّب، سجّل، سَجل النقاط</h3>
              <p>
                عشرة مسائل موزعة على الأدوات. ضع إجابة، ظلّل النقطة لحين الإنهاء، وشاهد النتيجة ترتفع.
              </p>
            </div>
            <div className={styles.score}>
              Score: <span>{challengeScore}</span> pts
            </div>
          </div>
          <div className={styles.challengeList}>
            {CHALLENGES.map((challenge, index) => (
              <div key={challenge.id} className={styles.challengeItem}>
                <div className={styles.challengeMeta}>
                  <label>
                    <input
                      type="checkbox"
                      checked={state.challengeProgress[index]}
                      onChange={() => toggleProgress(index)}
                    />
                    {"  "}
                    {challenge.label}
                  </label>
                  <span>{challenge.topic}</span>
                  <span>{challenge.points} pts</span>
                </div>
                <p className={styles.describe}>{challenge.prompt}</p>
                <textarea
                  className={styles.challengeNotes}
                  placeholder="سجل ملاحظاتك أو خطوتك التالية هنا..."
                  value={state.challengeNotes[index]}
                  onChange={(event) => updateNote(index, event.target.value)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {!state.challengeMode && (
        <div className={styles.savedNotice}>
          Challenge mode مغلق، لكنه سيرتفع تلقائياً عندما تفتحها مجدداً بفضل التخزين المحلي.
        </div>
      )}
    </div>
  );
}
