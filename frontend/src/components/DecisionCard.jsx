import { motion } from 'framer-motion';

const decisionTheme = {
  BUY: {
    bg: 'from-emerald-500/25 to-green-400/10',
    border: 'border-emerald-300/40',
    text: 'text-emerald-200'
  },
  HOLD: {
    bg: 'from-amber-500/25 to-yellow-400/10',
    border: 'border-amber-300/40',
    text: 'text-amber-200'
  },
  SELL: {
    bg: 'from-rose-500/25 to-red-400/10',
    border: 'border-rose-300/40',
    text: 'text-rose-200'
  },
  INVALID: {
    bg: 'from-slate-500/25 to-gray-400/10',
    border: 'border-slate-300/40',
    text: 'text-slate-200'
  }
};

const sentimentTheme = {
  Bullish: 'border-emerald-300/40 bg-emerald-500/15 text-emerald-100',
  Neutral: 'border-amber-300/40 bg-amber-500/15 text-amber-100',
  Bearish: 'border-rose-300/40 bg-rose-500/15 text-rose-100'
};

const DecisionCard = ({ decision, confidence, marketSentiment }) => {
  const normalizedDecision = decision || 'INVALID';
  const theme = decisionTheme[normalizedDecision] || decisionTheme.INVALID;
  const normalizedSentiment = marketSentiment || 'Neutral';
  const sentimentTone = sentimentTheme[normalizedSentiment] || sentimentTheme.Neutral;
  const confidenceValue = Number.isFinite(confidence)
    ? Math.max(0, Math.min(100, confidence))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.bg} p-5`}
    >
      <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Decision</p>
      <div className="mt-2 flex items-end justify-between">
        <h3 className={`font-display text-3xl font-bold ${theme.text}`}>{normalizedDecision}</h3>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${sentimentTone}`}>
          {normalizedSentiment}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-end">
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
          {confidenceValue.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
};

export default DecisionCard;
