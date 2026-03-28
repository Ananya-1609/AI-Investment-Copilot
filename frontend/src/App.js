import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatBox from './components/ChatBox';
import Dashboard from './components/Dashboard';
import NewsPanel from './components/NewsPanel';
import AgentFlow from './components/AgentFlow';
import { analyzeStock } from './api/api';

const createAssistantPayload = (response) => ({
  hasAnalysis: true,
  decision: response?.decision_details || response?.decision || { decision: 'INVALID', confidence: 0 },
  riskScore: Number.isFinite(response?.analysis?.risk_score) ? response.analysis.risk_score : 0,
  riskCategory: response?.risk_category || response?.analysis?.risk_category || 'Unknown',
  marketSentiment: response?.analysis?.market_sentiment || 'Neutral',
  warnings: Array.isArray(response?.analysis?.warnings) ? response.analysis.warnings : [],
  topNews: Array.isArray(response?.news) && response.news.length > 0 ? response.news[0] : 'No recent headline available.',
  explanation: response?.explanation || 'No explanation available.',
  whyNot: response?.why_not || {},
  suggestions: Array.isArray(response?.suggestions) ? response.suggestions : []
});

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      payload: {
        hasAnalysis: false,
        explanation: 'Enter a stock to start AI analysis 🚀'
      }
    }
  ]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('balanced');

  const invalidState = useMemo(() => {
    if (!result) {
      return false;
    }
    const resolvedDecision =
      result?.decision || result?.decision_details?.decision || result?.decision?.decision || 'INVALID';
    return Boolean(result?.data?.error) || resolvedDecision === 'INVALID';
  }, [result]);

  const handleSend = async (query) => {
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const response = await analyzeStock(query, mode);
      setResult(response);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          payload: createAssistantPayload(response)
        }
      ]);
    } catch (error) {
      const fallback = {
        data: { error: 'No data found for this stock' },
        news: [],
        analysis: {
          risk_score: 0,
          risk_category: 'Unknown',
          warnings: [],
          market_sentiment: 'Neutral',
          summary: 'Unable to complete analysis due to backend/network issue.'
        },
        decision: 'INVALID',
        confidence: 0,
        decision_details: {
          decision: 'INVALID',
          confidence: 0,
          confidence_range: { min: 0, max: 0 }
        },
        why_not: {},
        suggestions: ['INFY', 'HDFC', 'ICICI'],
        explanation:
          error?.response?.data?.detail ||
          error?.message ||
          'The system could not process this query. Please try again.'
      };

      setResult(fallback);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          payload: createAssistantPayload(fallback)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fin-grid relative min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <ChatBox
            messages={messages}
            onSend={handleSend}
            isLoading={loading}
            mode={mode}
            onModeChange={setMode}
          />
        </motion.div>

        <div className="space-y-5">
          <AgentFlow loading={loading} hasResult={Boolean(result)} />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass-card rounded-2xl p-5"
              >
                <p className="text-sm text-slate-200">Analyzing stock using AI agents...</p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-700/60">
                  <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-cyan-200/75 to-transparent" />
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                {invalidState ? (
                  <div className="glass-card rounded-2xl border border-rose-300/30 p-5">
                    <h3 className="font-display text-xl font-semibold text-rose-200">Invalid Stock Query</h3>
                    <p className="mt-2 text-sm text-rose-100">
                      {result?.data?.error || 'No valid stock data was returned.'}
                    </p>
                    <p className="mt-3 rounded-xl border border-slate-300/20 bg-slate-900/45 p-3 text-sm text-slate-100">
                      {result?.explanation}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-300">Try valid stocks</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(result?.suggestions?.length ? result.suggestions : ['INFY', 'HDFC', 'ICICI']).map((stock) => (
                        <span
                          key={stock}
                          className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                        >
                          {stock}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Dashboard result={result} />
                )}

                {!invalidState && <NewsPanel news={result?.news || []} />}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-5"
              >
                <h3 className="font-display text-lg font-semibold text-slate-100">Decision Dashboard</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Ask for a stock analysis to see agent output, confidence, risk, and latest market news.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default App;
