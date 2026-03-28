import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
  'Data Agent',
  'News Agent',
  'Analysis Agent',
  'Decision Agent',
  'Explainability Agent'
];

const AgentFlow = ({ loading, hasResult }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    if (!loading && hasResult) {
      setCurrentStep(-1);
      setCompletedSteps(steps.length);
      return;
    }

    if (!loading) {
      setCurrentStep(-1);
      setCompletedSteps(0);
      return;
    }

    setCurrentStep(0);
    setCompletedSteps(0);

    const timers = [];
    for (let index = 0; index < steps.length; index += 1) {
      timers.push(
        setTimeout(() => {
          setCurrentStep(index);
        }, index * 900)
      );
      timers.push(
        setTimeout(() => {
          setCompletedSteps(index + 1);
          if (index < steps.length - 1) {
            setCurrentStep(index + 1);
          } else {
            setCurrentStep(-1);
          }
        }, index * 900 + 600)
      );
    }

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [hasResult, loading]);

  const stateLabel = useMemo(() => {
    if (loading) {
      return 'Analyzing...';
    }
    if (hasResult) {
      return 'Completed';
    }
    return 'Idle';
  }, [hasResult, loading]);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-slate-100">Multi-Agent Flow</h3>
        <span className="text-xs uppercase tracking-[0.22em] text-cyan-200">{stateLabel}</span>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isDone = completedSteps > index;
          const isCurrent = loading && currentStep === index;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-xl border p-3 ${
                isDone
                  ? 'border-emerald-300/40 bg-emerald-500/10'
                  : isCurrent
                    ? 'border-cyan-300/40 bg-cyan-500/10'
                    : 'border-slate-400/20 bg-slate-900/35'
              }`}
            >
              {isCurrent && (
                <motion.div
                  initial={{ x: '-110%' }}
                  animate={{ x: '110%' }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent"
                />
              )}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-100">{step}</span>
                <span className="text-xs text-slate-300">
                  {isDone ? '✔ Done' : isCurrent ? '⏳ Loading' : 'Queued'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentFlow;
