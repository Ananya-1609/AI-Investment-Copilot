import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TypingText = ({ text, speed = 14 }) => {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    setVisibleText('');

    if (!text) {
      return undefined;
    }

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="whitespace-pre-line text-sm leading-relaxed text-slate-100">{visibleText}</span>;
};

const AssistantMessage = ({ payload, isLatestAssistant }) => {
  const hasAnalysis = payload?.hasAnalysis === true;
  const decision = payload?.decision?.decision || 'INVALID';
  const confidence = Number.isFinite(payload?.decision?.confidence) ? payload.decision.confidence : 0;
  const riskScore = Number.isFinite(payload?.riskScore) ? payload.riskScore : 0;
  const riskCategory = payload?.riskCategory || 'Unknown';
  const marketSentiment = payload?.marketSentiment || 'Neutral';
  const warnings = Array.isArray(payload?.warnings) ? payload.warnings : [];
  const topNews = payload?.topNews || 'No recent headline available.';
  const explanation = payload?.explanation || 'No explanation available.';
  const whyNot = payload?.whyNot || {};
  const suggestions = Array.isArray(payload?.suggestions) ? payload.suggestions : [];
  const alternativeDecisions = ['BUY', 'HOLD', 'SELL'].filter((option) => option !== decision);
  const confidenceRange = payload?.decision?.confidence_range || { min: 0, max: 0 };
  const hasConfidenceRange =
    Number.isFinite(confidenceRange?.min) && Number.isFinite(confidenceRange?.max);
  const confidenceSpread = hasConfidenceRange
    ? Math.max(0, Number(confidenceRange.max) - Number(confidenceRange.min))
    : 0;

  const riskCategoryTone =
    riskCategory === 'High'
      ? 'text-rose-200'
      : riskCategory === 'Medium'
        ? 'text-amber-200'
        : riskCategory === 'Low'
          ? 'text-emerald-200'
          : 'text-slate-200';

  return (
    <div className="max-w-full rounded-2xl border border-slate-300/15 bg-slate-900/45 px-4 py-3">
      <div className="space-y-2 text-sm leading-relaxed text-slate-100">
        {hasAnalysis && (
          <>
            <p>
              <span className="font-semibold text-cyan-100">📊 Decision:</span> {decision}
            </p>
            <p>
              <span className="font-semibold text-amber-100">⚠️ Risk Score:</span> {riskScore} / 100
            </p>
            <p>
              <span className="font-semibold text-fuchsia-100">🧭 Risk Category:</span>{' '}
              <span className={riskCategoryTone}>{riskCategory}</span>
            </p>
            <p>
              <span className="font-semibold text-emerald-100">📍 Market Sentiment:</span> {marketSentiment}
            </p>
            {warnings.length > 0 && (
              <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">Warnings</p>
                <ul className="mt-1 list-disc pl-4 text-xs text-amber-50">
                  {warnings.map((warning) => (
                    <li key={warning}>⚠️ {warning}</li>
                  ))}
                </ul>
              </div>
            )}
            <p>
              <span className="font-semibold text-blue-100">📰 Top News:</span> {topNews}
            </p>
          </>
        )}
        <p>
          <span className="font-semibold text-emerald-100">💡 Explanation:</span>{' '}
          {isLatestAssistant ? <TypingText text={explanation} /> : <span className="whitespace-pre-line">{explanation}</span>}
        </p>
      </div>

      {(whyNot.BUY || whyNot.HOLD || whyNot.SELL) && (
        <div className="mt-3 rounded-xl border border-slate-300/15 bg-slate-800/45 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Why Not</p>
          {alternativeDecisions.map((option) => (
            <div key={option} className="mt-2 text-xs text-slate-200">
              <p className="font-semibold text-slate-100">Why not {option}?</p>
              <ul className="mt-1 list-disc pl-4">
                {(whyNot[option] || ['Not enough supporting signals']).map((reason) => (
                  <li key={`${option}-${reason}`}>{reason}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-500/10 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Try also:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((symbol) => (
              <button
                key={symbol}
                type="button"
                className="rounded-full border border-cyan-300/40 bg-slate-900/50 px-3 py-1 text-xs font-semibold text-cyan-100"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasAnalysis && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-300/15 pt-3">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">
            Confidence: {confidence.toFixed(1)}%
          </span>
          {hasConfidenceRange && (
            <span className="rounded-full border border-slate-300/30 bg-slate-800/55 px-3 py-1 text-xs text-slate-100">
              Range: {Number(confidenceRange.min).toFixed(1)}% - {Number(confidenceRange.max).toFixed(1)}%
            </span>
          )}
          {confidenceSpread > 10 && (
            <span className="rounded-full border border-amber-300/35 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100">
              ⚠️ High uncertainty in prediction
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const ChatBox = ({ messages, onSend, isLoading, mode, onModeChange }) => {
  const [input, setInput] = useState('');

  const latestAssistantIndex = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === 'assistant') {
        return index;
      }
    }
    return -1;
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || isLoading) {
      return;
    }

    onSend(value);
    setInput('');
  };

  return (
    <section className="glass-card flex h-[72vh] min-h-[540px] flex-col rounded-3xl">
      <div className="border-b border-slate-300/15 px-5 py-4">
        <h2 className="font-display text-xl font-semibold text-slate-100">AI Investment Copilot</h2>
        <p className="mt-1 text-sm text-slate-300">AI-powered multi-agent system for smart investment decisions</p>
      </div>

      <div className="scrollbar-soft flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isUser = message.role === 'user';
            return (
              <motion.div
                key={`${message.role}-${index}-${message.content || message?.payload?.explanation || ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {isUser ? (
                  <div className="max-w-[84%] rounded-2xl border border-blue-300/25 bg-blue-500/20 px-4 py-3 text-sm text-blue-50">
                    {message.content}
                  </div>
                ) : (
                  <AssistantMessage
                    payload={message.payload}
                    isLatestAssistant={index === latestAssistantIndex}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[84%] rounded-2xl border border-slate-300/20 bg-slate-900/50 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              Analyzing stock using AI agents...
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-300/15 p-4">
        <div className="mb-3 flex items-center gap-3">
          <label htmlFor="investor-mode" className="text-xs uppercase tracking-[0.18em] text-slate-300">
            Investor Mode
          </label>
          <select
            id="investor-mode"
            value={mode}
            onChange={(event) => onModeChange(event.target.value)}
            className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-300/50"
            disabled={isLoading}
          >
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about a stock (e.g., TCS, INFY, RELIANCE)"
            className="w-full rounded-2xl border border-slate-300/20 bg-slate-950/65 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChatBox;
