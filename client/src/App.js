import { Analytics } from '@vercel/analytics/react';
import PortfolioDemo from './demo/PortfolioDemo';

export default function App() {
  return (
    <>
      <PortfolioDemo />
      <Analytics />
    </>
  );
}
