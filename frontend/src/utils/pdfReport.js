/**
 * PDF Report Generator for Dream Analysis
 * Generates a clean, professional PDF report with dream pattern analytics
 */

export const generateDreamReportPDF = (result, patterns, lexicon) => {
  // Get current date
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate statistics
  const dreamTypeFrequency = patterns.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  const mostCommonDream = Object.entries(dreamTypeFrequency)
    .sort((a, b) => b[1] - a[1])[0];

  const avgConfidence = patterns.length > 0
    ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
    : 0;

  // Create HTML content for PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dream Analysis Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #4cc9f0;
    }
    
    .header h1 {
      font-size: 32px;
      color: #1a1a2e;
      margin-bottom: 10px;
    }
    
    .header .subtitle {
      font-size: 16px;
      color: #666;
    }
    
    .header .date {
      font-size: 14px;
      color: #999;
      margin-top: 10px;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 22px;
      color: #1a1a2e;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .icon {
      font-size: 24px;
    }
    
    .current-analysis {
      background: linear-gradient(135deg, #4cc9f0 0%, #7b2ff7 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    
    .current-analysis h2 {
      font-size: 28px;
      margin-bottom: 15px;
    }
    
    .current-analysis .confidence {
      font-size: 48px;
      font-weight: bold;
      margin: 15px 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    
    .stat-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #4cc9f0;
    }
    
    .stat-card .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .stat-card .value {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a2e;
    }
    
    .bands-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    .bands-table th,
    .bands-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .bands-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #1a1a2e;
    }
    
    .bands-table tr:hover {
      background: #f8f9fa;
    }
    
    .band-bar {
      height: 20px;
      border-radius: 4px;
      display: inline-block;
    }
    
    .band-delta { background: #4cc9f0; }
    .band-theta { background: #7b2ff7; }
    .band-alpha { background: #ffbe0b; }
    .band-beta { background: #ff006e; }
    
    .lexicon-list {
      list-style: none;
      margin-top: 15px;
    }
    
    .lexicon-item {
      background: #f8f9fa;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 8px;
      border-left: 4px solid #7b2ff7;
    }
    
    .lexicon-item .symbol-name {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a2e;
      margin-bottom: 5px;
    }
    
    .lexicon-item .symbol-count {
      display: inline-block;
      background: #4cc9f0;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      margin-left: 10px;
    }
    
    .lexicon-item .symbol-meaning {
      color: #666;
      margin: 8px 0;
    }
    
    .lexicon-item .symbol-emotion {
      display: inline-block;
      background: #e0e0e0;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      color: #333;
    }
    
    .timeline {
      margin-top: 15px;
    }
    
    .timeline-item {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .timeline-dot {
      width: 12px;
      height: 12px;
      background: #4cc9f0;
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
    }
    
    .timeline-content .date {
      font-size: 12px;
      color: #999;
    }
    
    .timeline-content .type {
      font-size: 16px;
      font-weight: bold;
      color: #1a1a2e;
      margin: 5px 0;
    }
    
    .timeline-content .confidence {
      font-size: 14px;
      color: #4cc9f0;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧠 Dream Analysis Report</h1>
    <div class="subtitle">Neural Architecture Decoding & Pattern Analytics</div>
    <div class="date">Generated on ${date}</div>
  </div>

  <div class="current-analysis">
    <h2>Current Analysis</h2>
    <div><strong>Dream Type:</strong> ${result.dream}</div>
    <div class="confidence">${result.confidence}%</div>
    <div>Confidence Level</div>
  </div>

  <div class="section">
    <div class="section-title">
      <span class="icon">📊</span>
      <span>Brain Wave Analysis</span>
    </div>
    <table class="bands-table">
      <thead>
        <tr>
          <th>Wave Type</th>
          <th>Value</th>
          <th>Visualization</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Delta</strong></td>
          <td>${result.bands.delta.toFixed(3)}</td>
          <td><div class="band-bar band-delta" style="width: ${result.bands.delta * 200}px"></div></td>
          <td>Deep Sleep (0.5-4 Hz)</td>
        </tr>
        <tr>
          <td><strong>Theta</strong></td>
          <td>${result.bands.theta.toFixed(3)}</td>
          <td><div class="band-bar band-theta" style="width: ${result.bands.theta * 200}px"></div></td>
          <td>Creativity (4-8 Hz)</td>
        </tr>
        <tr>
          <td><strong>Alpha</strong></td>
          <td>${result.bands.alpha.toFixed(3)}</td>
          <td><div class="band-bar band-alpha" style="width: ${result.bands.alpha * 200}px"></div></td>
          <td>Relaxation (8-13 Hz)</td>
        </tr>
        <tr>
          <td><strong>Beta</strong></td>
          <td>${result.bands.beta.toFixed(3)}</td>
          <td><div class="band-bar band-beta" style="width: ${result.bands.beta * 200}px"></div></td>
          <td>Active Thinking (13-30 Hz)</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${patterns.length > 0 ? `
  <div class="section">
    <div class="section-title">
      <span class="icon">📈</span>
      <span>Pattern Statistics</span>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Total Dreams Analyzed</div>
        <div class="value">${patterns.length}</div>
      </div>
      <div class="stat-card">
        <div class="label">Most Common Type</div>
        <div class="value">${mostCommonDream ? mostCommonDream[0] : 'N/A'}</div>
      </div>
      <div class="stat-card">
        <div class="label">Average Confidence</div>
        <div class="value">${avgConfidence.toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <div class="label">Dominant Wave</div>
        <div class="value">${Object.entries(result.bands).sort((a,b)=>b[1]-a[1])[0][0].toUpperCase()}</div>
      </div>
    </div>
  </div>
  ` : ''}

  ${lexicon.length > 0 ? `
  <div class="section">
    <div class="section-title">
      <span class="icon">📖</span>
      <span>Personal Dream Lexicon</span>
    </div>
    <ul class="lexicon-list">
      ${lexicon.slice(0, 10).map(item => `
        <li class="lexicon-item">
          <div class="symbol-name">
            ${item.symbol}
            <span class="symbol-count">×${item.count}</span>
          </div>
          <div class="symbol-meaning">${item.meaning}</div>
          <span class="symbol-emotion">${item.emotion}</span>
        </li>
      `).join('')}
    </ul>
  </div>
  ` : ''}

  ${patterns.length > 0 ? `
  <div class="section">
    <div class="section-title">
      <span class="icon">⏱️</span>
      <span>Recent Dream Timeline</span>
    </div>
    <div class="timeline">
      ${patterns.slice(-10).reverse().map(pattern => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="date">${new Date(pattern.date).toLocaleDateString()}</div>
            <div class="type">${pattern.type}</div>
            <div class="confidence">${pattern.confidence.toFixed(1)}% confidence</div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Dream Decoder - Neural Architecture Decoding System</p>
    <p>This report is generated from EEG brainwave analysis and machine learning predictions.</p>
  </div>
</body>
</html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
  }, 500);
};
