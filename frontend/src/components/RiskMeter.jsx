import { motion } from 'framer-motion';

const getRiskStyle = (risk) => {
  if (risk >= 70) {
    return { label: 'High', color: 'from-rose-500 to-red-400' };
  }
  if (risk >= 40) {
    return { label: 'Moderate', color: 'from-amber-400 to-yellow-300' };
  }
  return { label: 'Low', color: 'from-emerald-500 to-green-300' };
};

const RiskMeter = ({ score = 0 }) => {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
  const style = getRiskStyle(safeScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 }}
      className="rounded-2xl border border-slate-300/20 bg-slate-900/35 p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Risk Meter</p>
        <span className="text-sm font-semibold text-slate-100">{style.label}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${style.color}`}
        />
      </div>
      <p className="mt-2 text-sm text-slate-300">Score: {safeScore.toFixed(1)} / 100</p>
    </motion.div>
  );
};

export default RiskMeter;
