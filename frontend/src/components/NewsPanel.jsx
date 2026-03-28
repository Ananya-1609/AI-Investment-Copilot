import { motion } from 'framer-motion';

const NewsPanel = ({ news = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5"
    >
      <h3 className="font-display text-lg font-semibold text-slate-100">Top Market News</h3>
      {news.length === 0 ? (
        <p className="mt-4 rounded-xl border border-slate-400/20 bg-slate-900/40 p-4 text-sm text-slate-300">
          No recent news found
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {news.slice(0, 5).map((item, index) => (
            <motion.li
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl border border-slate-400/20 bg-slate-900/35 p-3 text-sm leading-relaxed text-slate-200"
            >
              {item}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default NewsPanel;
