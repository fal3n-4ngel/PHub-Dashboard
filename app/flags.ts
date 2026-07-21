import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const enableInvestmentPortfolios = flag({
  key: 'enableInvestmentPortfolios',
  adapter: vercelAdapter(),
});
