# SentinelZero Dashboard

Interactive MVP dashboard for risk analysis of smart contracts on BNB Chain.

## Features

- **Real-time Risk Scoring**: Calculate comprehensive risk scores for smart contracts
- **Historical Trends**: Visualize exploit patterns over time
- **Vulnerability Distribution**: Analyze breakdown of attack vectors
- **Live Monitoring**: Track multiple contracts in real-time
- **Recent Exploits**: Stay updated with latest incidents

## Technology Stack

- **React.js 18**: Modern React with hooks
- **Chart.js 4**: Professional data visualizations
- **CSS3**: Custom styling with CSS variables
- **Web3.js**: Blockchain integration (planned)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Start development server
npm start
```

The dashboard will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

```
dashboard/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── Header.js
│   │   ├── StatsOverview.js
│   │   ├── RiskScoreCard.js
│   │   ├── HistoricalTrends.js
│   │   ├── VulnerabilityBreakdown.js
│   │   ├── MonitoringPanel.js
│   │   └── RecentExploits.js
│   ├── services/        # Data services
│   │   └── dataService.js
│   ├── styles/          # CSS files
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
└── package.json
```

## Component Overview

### Header
Navigation bar with branding and wallet connection

### StatsOverview
High-level statistics cards showing total incidents, losses, and recovery rates

### RiskScoreCard
Interactive calculator for contract risk assessment with breakdown visualization

### HistoricalTrends
Line chart showing exploit incidents over time using Chart.js

### VulnerabilityBreakdown
Doughnut chart displaying distribution of vulnerability categories

### MonitoringPanel
Real-time monitoring panel for tracked contracts with alerts

### RecentExploits
List of most recent documented exploits

## Data Integration

The dashboard loads data from:
- `/data/historical_exploits.json` - Historical exploit database
- `/src/taxonomy/risk_taxonomy.json` - Risk classification framework

## Customization

### Colors

Theme colors are defined in `src/index.css` using CSS variables:

```css
:root {
  --color-primary: #F3BA2F;        /* BNB Chain yellow */
  --color-bg-primary: #0A0E17;     /* Dark background */
  --color-text-primary: #EAECEF;   /* Light text */
  /* ... */
}
```

### Charts

Chart configurations are in individual component files. Modify options in:
- `HistoricalTrends.js` for line chart
- `VulnerabilityBreakdown.js` for doughnut chart

## API Integration (Future)

The dashboard is designed to integrate with a backend API for:
- Real-time contract analysis
- Live blockchain data feeds
- User authentication
- Contract monitoring subscriptions

Stub functions are in `src/services/dataService.js`.

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Contributing

Please ensure all components follow the existing code style and include appropriate CSS files.

## License

Apache 2.0
