import { NextResponse } from 'next/server';
import { enableInvestmentPortfolios } from '../../flags';

export async function GET() {
  // Safe shortcut: in local development without Vercel configuration/secrets,
  // return fallback directly to avoid spamming console logs with Vercel Flags SDK connection warnings.
  const hasVercelConfig = !!(process.env.FLAGS_SECRET || process.env.VERCEL || process.env.EDGE_CONFIG);
  
  if (!hasVercelConfig) {
    const envVal = process.env.ENABLE_INVESTMENT_PORTFOLIOS || process.env.enableInvestmentPortfolios;
    return NextResponse.json({
      enableInvestmentPortfolios: envVal !== 'false'
    });
  }

  try {
    const isEnabled = await enableInvestmentPortfolios();
    return NextResponse.json({
      enableInvestmentPortfolios: isEnabled
    });
  } catch (err) {
    const envVal = process.env.ENABLE_INVESTMENT_PORTFOLIOS || process.env.enableInvestmentPortfolios;
    return NextResponse.json({
      enableInvestmentPortfolios: envVal !== 'false'
    });
  }
}
