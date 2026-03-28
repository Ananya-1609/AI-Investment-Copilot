import { motion } from 'framer-motion';
import DecisionCard from './DecisionCard';
import RiskMeter from './RiskMeter';

const Dashboard = ({ result }) => {
  const data = result?.data || {};
  const analysis = result?.analysis || {};
  const decision = result?.decision_details || result?.decision || {};
  const whyNot = result?.why_not || {};
  const suggestions = Array.isArray(result?.suggestions) ? result.suggestions : [];

  const hasDataError = Boolean(data.error);
  const formattedCurrentPrice = Number.isFinite(Number(data.current_price))
    ? Number(data.current_price).toFixed(2)
    : '0.00';
  const decisionValue = decision?.decision || 'INVALID';
  const alternativeDecisions = ['BUY', 'HOLD', 'SELL'].filter((option) => option !== decisionValue);
  const confidenceBarColor =
    decisionValue === 'BUY'
      ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-lime-300'
      : decisionValue === 'HOLD'
        ? 'bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300'
        : decisionValue === 'SELL'
          ? 'bg-gradient-to-r from-rose-400 via-red-400 to-orange-400'
          : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300';

  const riskCategory = analysis?.risk_category || 'Unknown';
  const riskCategoryBadge =
    riskCategory === 'High'
      ? 'Risk: HIGH 🔴'
      : riskCategory === 'Medium'
        ? 'Risk: MEDIUM 🟡'
        : riskCategory === 'Low'
          ? 'Risk: LOW 🟢'
          : 'Risk: UNKNOWN ⚪';
  const riskCategoryColor =
    riskCategory === 'High'
      ? 'text-rose-200 border-rose-300/40 bg-rose-500/10'
      : riskCategory === 'Medium'
        ? 'text-amber-200 border-amber-300/40 bg-amber-500/10'
        : riskCategory === 'Low'
          ? 'text-emerald-200 border-emerald-300/40 bg-emerald-500/10'
          : 'text-slate-200 border-slate-300/40 bg-slate-700/40';

    const warnings = Array.isArray(analysis?.warnings) ? analysis.warnings : [];
    const marketSentiment = analysis?.market_sentiment || 'Neutral';
    const confidenceRange = decision?.confidence_range || { min: 0, max: 0 };
    const hasConfidenceRange =
      Number.isFinite(confidenceRange?.min) && Number.isFinite(confidenceRange?.max);
    const confidenceSpread = hasConfidenceRange
      ? Math.max(0, Number(confidenceRange.max) - Number(confidenceRange.min))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4"
    >
      <DecisionCard
        decision={decision.decision}
        confidence={decision.confidence}
        marketSentiment={marketSentiment}
      />

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-300/45 bg-gradient-to-br from-amber-500/20 to-rose-500/15 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-100">Warnings</p>
          <ul className="mt-2 space-y-2 text-sm text-amber-50">
            {warnings.map((warning) => (
              <li key={warning} className="rounded-xl border border-amber-200/30 bg-amber-950/35 px-3 py-2">
                <span className="font-semibold">⚠️</span> {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass-card rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Confidence</p>
          <span className="text-sm font-semibold text-cyan-100">
            {Number.isFinite(decision.confidence) ? `${decision.confidence.toFixed(1)}%` : '0.0%'}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700/70">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                Number.isFinite(decision.confidence)
                  ? Math.max(0, Math.min(100, decision.confidence))
                  : 0
              }%`
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${confidenceBarColor}`}
          />
        </div>
        {hasConfidenceRange && (
          <div className="mt-3 rounded-xl border border-slate-300/20 bg-slate-900/40 p-3">
            <p className="text-xs text-slate-300">
              Range: {Number(confidenceRange.min).toFixed(1)}% - {Number(confidenceRange.max).toFixed(1)}%
            </p>
            {confidenceSpread > 10 && (
              <p className="mt-2 text-xs font-semibold text-amber-200">⚠️ High uncertainty in prediction</p>
            )}
          </div>
        )}
      </div>

      <RiskMeter score={analysis.risk_score} />

      <div className="glass-card rounded-2xl p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Risk Category</p>
        <p className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${riskCategoryColor}`}>
          {riskCategoryBadge}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.09 }}
        className="glass-card rounded-2xl p-5"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Stock Snapshot</p>
        {hasDataError ? (
          <p className="mt-3 rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            Invalid stock
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-300/20 bg-slate-900/40 p-3">
              <p className="text-xs text-slate-400">Current Price</p>
              <p className="mt-1 font-display text-2xl font-bold text-slate-100">₹{formattedCurrentPrice}</p>
            </div>
            <div className="rounded-xl border border-slate-300/20 bg-slate-900/40 p-3">
              <p className="text-xs text-slate-400">Trend</p>
              {data.trend === 'upward' ? (
                <p className="mt-1 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-lg font-semibold text-emerald-200">
                  <span aria-hidden="true">📈</span>
                  Upward
                </p>
              ) : data.trend === 'downward' ? (
                <p className="mt-1 inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-400/15 px-3 py-1 text-lg font-semibold text-rose-200">
                  <span aria-hidden="true">📉</span>
                  Downward
                </p>
              ) : (
                <p className="mt-1 inline-flex items-center gap-2 rounded-full border border-slate-300/30 bg-slate-700/40 px-3 py-1 text-lg font-semibold text-slate-200">
                  Trend unavailable
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass-card rounded-2xl p-5"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Analysis Summary</p>
        <p className="mt-2 whitespace-pre-line rounded-xl border border-slate-300/15 bg-slate-900/35 p-3 text-sm leading-relaxed text-slate-100">
          {analysis.summary || 'No summary available'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-5"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Why Not</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {alternativeDecisions.map((option) => (
            <div key={option} className="rounded-xl border border-slate-300/15 bg-slate-900/35 p-3">
              <p className="text-sm font-semibold text-slate-100">Why not {option}?</p>
              <ul className="mt-2 list-disc pl-4 text-sm text-slate-200">
                {(whyNot?.[option] || ['Not enough supporting signals']).map((reason) => (
                  <li key={`${option}-${reason}`}>{reason}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="glass-card rounded-2xl p-5"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Try also</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((symbol) => (
              <button
                key={symbol}
                type="button"
                className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
              >
                {symbol}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
