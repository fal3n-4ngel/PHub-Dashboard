import React from "react";
import { InvestmentAsset, InvestmentCategory, InvestmentQuote } from "@/types";

interface InvestmentsTabProps {
  investments: InvestmentAsset[];
  currency: string;
  invName: string;
  setInvName: (s: string) => void;
  invCategory: InvestmentCategory;
  setInvCategory: (c: InvestmentCategory) => void;
  invQuantity: string;
  setInvQuantity: (s: string) => void;
  invBuyPrice: string;
  setInvBuyPrice: (s: string) => void;
  invAmount: string;
  setInvAmount: (s: string) => void;
  invNotes: string;
  setInvNotes: (s: string) => void;
  isAddingAsset: boolean;
  addInvestment: (e: React.FormEvent) => void;
  deleteInvestment: (id: string) => void;
  isUpdatingPrices: boolean;
  updateMarketPrices: () => void;
  isFetchingInvestments: boolean;
  invSuggestions: InvestmentQuote[];
  setInvSuggestions: (s: InvestmentQuote[]) => void;
  selectSuggestion: (s: InvestmentQuote) => void;
}

const STAT_CARD = "flex flex-col gap-1 rounded-card border border-border-subtle bg-bg-card p-5 shadow-subtle";
const LABEL_MONO = "font-mono text-[10px] font-semibold tracking-[0.8px] text-text-secondary uppercase";
const STAT_VALUE = "text-[28px] font-bold tracking-[-0.5px] text-text-primary";
const STAT_SUBTEXT = "mt-1 text-[11px] text-text-muted";
const BENTO_CARD = "rounded-card border border-border-subtle bg-bg-card p-6 shadow-subtle";
const BTN_PRIMARY = "rounded-md border border-text-primary bg-text-primary px-4 py-2 text-[13px] font-medium text-white transition-all duration-200 hover:border-[#2e2d27] hover:bg-[#2e2d27]";
const INPUT_CLASS = "w-full rounded-lg border border-border-subtle bg-bg-card px-3 py-2 text-[13px] text-text-primary outline-none transition-all duration-200 focus:border-border-hover focus:shadow-focus";
const LEDGER_TH = "border-b border-border-subtle bg-bg-card px-3 py-2.5 font-mono text-[11px] font-semibold tracking-[0.5px] text-text-muted uppercase";
const LEDGER_TD = "border-b border-border-subtle px-3 py-3 align-middle text-[13px] text-text-primary";

export const InvestmentsTab: React.FC<InvestmentsTabProps> = ({
  investments,
  currency,
  invName,
  setInvName,
  invCategory,
  setInvCategory,
  invQuantity,
  setInvQuantity,
  invBuyPrice,
  setInvBuyPrice,
  invAmount,
  setInvAmount,
  invNotes,
  setInvNotes,
  isAddingAsset,
  addInvestment,
  deleteInvestment,
  isUpdatingPrices,
  updateMarketPrices,
  isFetchingInvestments,
  invSuggestions,
  setInvSuggestions,
  selectSuggestion,
}) => {
  const safeInvestments = Array.isArray(investments) ? investments : [];
  const totalValue = safeInvestments.reduce((acc, a) => acc + (a.amount || 0), 0);
  const totalInvested = safeInvestments.reduce((acc, a) => acc + (a.investedAmount || a.amount || 0), 0);
  const totalProfit = totalValue - totalInvested;
  const profitPct = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  const holdingsCount = safeInvestments.length;

  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.5px]">Investment Portfolios</h1>
          <p className="mt-0.5 text-xs text-text-muted">
            Track assets manually or simulate live market updates.
          </p>
        </div>
        <button
          onClick={updateMarketPrices}
          disabled={isUpdatingPrices || safeInvestments.length === 0}
          className={`${BTN_PRIMARY} flex items-center gap-1.5 px-4 py-2 text-xs`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isUpdatingPrices ? "animate-spin" : ""}>
            <path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          {isUpdatingPrices ? "Refreshing..." : "Fetch live prices"}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className={STAT_CARD}>
          <span className={LABEL_MONO}>PORTFOLIO VALUE</span>
          <span className={STAT_VALUE}>{currency}{totalValue.toFixed(2)}</span>
          <span className={STAT_SUBTEXT}>Current market valuation</span>
        </div>
        <div className={STAT_CARD}>
          <span className={LABEL_MONO}>TOTAL INVESTED</span>
          <span className={`${STAT_VALUE} text-accent-blue`}>{currency}{totalInvested.toFixed(2)}</span>
          <span className={STAT_SUBTEXT}>Capital input cost</span>
        </div>
        <div className={STAT_CARD}>
          <span className={LABEL_MONO}>TOTAL PROFIT / LOSS</span>
          <span className={STAT_VALUE} style={{ color: totalProfit >= 0 ? "#16a34a" : "#b3666b" }}>
            {totalProfit >= 0 ? "+" : ""}{currency}{totalProfit.toFixed(2)}
          </span>
          <span className="mt-1 text-[11px] font-semibold" style={{ color: profitPct >= 0 ? "#16a34a" : "#b3666b" }}>
            {profitPct >= 0 ? "+" : ""}{profitPct.toFixed(1)}% Return
          </span>
        </div>
        <div className={STAT_CARD}>
          <span className={LABEL_MONO}>HOLDINGS COUNT</span>
          <span className={STAT_VALUE}>{holdingsCount}</span>
          <span className={STAT_SUBTEXT}>Active assets logged</span>
        </div>
      </div>

      {/* Bottom 2-Column Section */}
      <div className="grid grid-cols-[280px_1fr] items-start gap-5 max-md:grid-cols-1">
        {/* Left Column Card: ADD ASSET */}
        <div className={`${BENTO_CARD} relative`}>
          <span className={`${LABEL_MONO} mb-3.5 block`}>ADD ASSET</span>
          <form onSubmit={addInvestment} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Asset Name (e.g. BTC, AAPL)"
                value={invName}
                onChange={(e) => setInvName(e.target.value)}
                required
                className={INPUT_CLASS}
              />
              {invSuggestions.length > 0 && (
                <div className={`${BENTO_CARD} absolute top-full right-0 left-0 z-[100] mt-1 max-h-[180px] overflow-y-auto p-2`}>
                  {invSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSuggestion(s)}
                      className="flex cursor-pointer justify-between rounded px-2 py-1.5 text-[11px] hover:bg-bg-secondary"
                    >
                      <span className="font-semibold">{s.symbol || s.name}</span>
                      <span className="text-[10px] text-text-muted">{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <select value={invCategory} onChange={(e) => setInvCategory(e.target.value as InvestmentCategory)} className={`${INPUT_CLASS} cursor-pointer text-xs`}>
              <option value="equity">Equity (Stock)</option>
              <option value="crypto">Crypto</option>
              <option value="mutual_fund">Mutual Fund</option>
              <option value="sip">SIP</option>
              <option value="gold">Gold</option>
              <option value="cash">Cash / FD</option>
              <option value="other">Other</option>
            </select>

            <input
              type="number"
              placeholder={`Invested Amount (${currency})`}
              value={invAmount}
              onChange={(e) => setInvAmount(e.target.value)}
              step="any"
              required
              className={INPUT_CLASS}
            />

            <input
              type="number"
              placeholder="Quantity Owned"
              value={invQuantity}
              onChange={(e) => setInvQuantity(e.target.value)}
              step="any"
              className={INPUT_CLASS}
            />

            <input
              type="text"
              placeholder="Notes (optional)"
              value={invNotes}
              onChange={(e) => setInvNotes(e.target.value)}
              className={INPUT_CLASS}
            />

            <button type="submit" disabled={isAddingAsset} className={`${BTN_PRIMARY} mt-1 w-full py-2.5`}>
              {isAddingAsset ? "Adding..." : "Add Holding"}
            </button>
          </form>
        </div>

        {/* Right Column Card: HOLDINGS PORTFOLIO Table */}
        <div className={`${BENTO_CARD} p-5`}>
          <span className={`${LABEL_MONO} mb-3.5 block`}>HOLDINGS PORTFOLIO</span>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className={LEDGER_TH}>Asset</th>
                  <th className={LEDGER_TH}>Category</th>
                  <th className={`${LEDGER_TH} text-right`}>Quantity</th>
                  <th className={`${LEDGER_TH} text-right`}>Avg Buy</th>
                  <th className={`${LEDGER_TH} text-right`}>Live Price</th>
                  <th className={`${LEDGER_TH} text-right`}>Invested</th>
                  <th className={`${LEDGER_TH} text-right`}>Current Value</th>
                  <th className={`${LEDGER_TH} text-right`}>P&amp;L</th>
                  <th className={`${LEDGER_TH} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {safeInvestments.map((asset) => {
                  const currentVal = asset.amount || 0;
                  const investedVal = asset.investedAmount || asset.amount || 0;
                  const assetProfit = currentVal - investedVal;
                  const assetProfitPct = investedVal > 0 ? (assetProfit / investedVal) * 100 : 0;
                  const avgBuy = asset.quantity && asset.quantity > 0 ? investedVal / asset.quantity : (asset.buyPrice || 0);

                  return (
                    <tr key={asset.id} className="hover:bg-bg-secondary">
                      <td className={`${LEDGER_TD} font-semibold`}>
                        {asset.name}
                        {asset.notes && <p className="mt-0.5 text-[10px] text-text-muted">{asset.notes}</p>}
                      </td>
                      <td className={LEDGER_TD}>
                        <span className="rounded bg-bg-secondary px-1.5 py-0.5 font-mono text-[10px] capitalize">
                          {asset.category}
                        </span>
                      </td>
                      <td className={`${LEDGER_TD} text-right`}>{asset.quantity || "—"}</td>
                      <td className={`${LEDGER_TD} text-right`}>{avgBuy > 0 ? `${currency}${avgBuy.toFixed(2)}` : "—"}</td>
                      <td className={`${LEDGER_TD} text-right`}>{asset.currentPrice ? `${currency}${asset.currentPrice.toFixed(2)}` : "—"}</td>
                      <td className={`${LEDGER_TD} text-right`}>{currency}{investedVal.toFixed(2)}</td>
                      <td className={`${LEDGER_TD} text-right font-semibold`}>{currency}{currentVal.toFixed(2)}</td>
                      <td className={`${LEDGER_TD} text-right font-semibold`} style={{ color: assetProfit >= 0 ? "#16a34a" : "#b3666b" }}>
                        <div>{assetProfit >= 0 ? "+" : ""}{currency}{assetProfit.toFixed(2)}</div>
                        <div className="text-[10px]">{assetProfitPct >= 0 ? "+" : ""}{assetProfitPct.toFixed(1)}%</div>
                      </td>
                      <td className={`${LEDGER_TD} text-right`}>
                        <button
                          onClick={() => deleteInvestment(asset.id)}
                          className="border-none bg-transparent text-[11px] font-medium text-[#b3666b]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {safeInvestments.length === 0 && (
              <p className="p-8 text-center text-[13px] text-text-muted">
                {isFetchingInvestments ? "Loading portfolio..." : "No active holdings found."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
