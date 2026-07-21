import { NextResponse } from 'next/server';
import { enableInvestmentPortfolios } from '../../flags';

export async function GET() {
  try {
    const isEnabled = await enableInvestmentPortfolios();
    return NextResponse.json({
      enableInvestmentPortfolios: isEnabled
    });
  } catch (err) {
    console.warn("Vercel feature flag evaluation failed, using fallback:", err);
    // Safe fallback for local development without Vercel config
    const envVal = process.env.ENABLE_INVESTMENT_PORTFOLIOS || process.env.enableInvestmentPortfolios;
    return NextResponse.json({
      enableInvestmentPortfolios: envVal !== 'false'
    });
  }
}
