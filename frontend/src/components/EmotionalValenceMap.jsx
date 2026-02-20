import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './EmotionalValenceMap.css';

export default function EmotionalValenceMap({ bands, dreamType }) {
  // Calculate emotional valence from brain waves
  const calculateEmotionalState = () => {
    if (!bands) return [];
    
    const { delta, theta, alpha, beta } = bands;
    
    // Generate emotional timeline (simulated sleep stages)
    const timeline = [];
    const stages = 20; // 20 data points representing sleep stages
    
    for (let i = 0; i < stages; i++) {
      const time = i * 30; // 30-minute intervals
      
      // Simulate emotional changes throughout sleep
      const stressLevel = Math.max(0, Math.min(100, 
        beta * 100 + Math.sin(i * 0.5) * 20
      ));
      
      const relaxationLevel = Math.max(0, Math.min(100,
        alpha * 100 + Math.cos(i * 0.3) * 15
      ));
      
      const creativityLevel = Math.max(0, Math.min(100,
        theta * 100 + Math.sin(i * 0.7) * 25
      ));
      
      const deepSleepLevel = Math.max(0, Math.min(100,
        delta * 100 + Math.cos(i * 0.4) * 20
      ));
      
      // Overall emotional valence (-100 to +100)
      const valence = (relaxationLevel + creativityLevel - stressLevel) / 2;
      
      timeline.push({
        time: `${Math.floor(time / 60)}h ${time % 60}m`,
        timeMinutes: time,
        valence: valence,
        stress: stressLevel,
        relaxation: relaxationLevel,
        creativity: creativityLevel,
        deepSleep: deepSleepLevel,
        emotion: valence > 30 ? 'Peaceful' : valence > 0 ? 'Calm' : valence > -30 ? 'Anxious' : 'Stressed'
      });
    }
    
    return timeline;
  };

  const emotionalData = calculateEmotionalState();
  
  // Calculate average emotional state
  const avgValence = emotionalData.reduce((sum, d) => sum + d.valence, 0) / emotionalData.length;
  const dominantEmotion = avgValence > 30 ? 'Peaceful 😌' : 
                          avgValence > 0 ? 'Calm 😊' : 
                          avgValence > -30 ? 'Anxious 😰' : 'Stressed 😫';
  
  const emotionColor = avgValence > 30 ? '#4cc9f0' : 
                       avgValence > 0 ? '#7b2ff7' : 
                       avgValence > -30 ? '#ffbe0b' : '#ff006e';

  return (
    <div className="emotional-valence-map">
      <div className="valence-header">
        <div className="valence-title">
          <h3>💭 Emotional Valence Map</h3>
          <p>Track your emotional temperature throughout the night</p>
        </div>
        
        <div className="dominant-emotion" style={{ borderColor: emotionColor }}>
          <span className="emotion-label">Dominant State</span>
          <span className="emotion-value" style={{ color: emotionColor }}>
            {dominantEmotion}
          </span>
        </div>
      </div>

      <div className="valence-chart">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={emotionalData}>
            <defs>
              <linearGradient id="valenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4cc9f0" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#7b2ff7" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#ff006e" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#8892b0" 
              fontSize={11}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#8892b0" 
              fontSize={11}
              domain={[-100, 100]}
              ticks={[-100, -50, 0, 50, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(20, 22, 38, 0.95)', 
                border: '2px solid rgba(76, 201, 240, 0.5)', 
                borderRadius: 12,
                color: '#ffffff',
                padding: '12px'
              }}
              labelStyle={{ color: '#4cc9f0', fontWeight: 700 }}
              formatter={(value, name) => {
                if (name === 'valence') return [value.toFixed(1), 'Emotional Valence'];
                return [value.toFixed(1), name];
              }}
            />
            <Area 
              type="monotone" 
              dataKey="valence" 
              stroke="#4cc9f0" 
              strokeWidth={3}
              fill="url(#valenceGradient)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="emotion-breakdown">
        <div className="emotion-stat">
          <div className="stat-icon" style={{ background: '#ff006e' }}>😰</div>
          <div className="stat-info">
            <span className="stat-label">Stress Peaks</span>
            <span className="stat-value">
              {emotionalData.filter(d => d.stress > 60).length}
            </span>
          </div>
        </div>

        <div className="emotion-stat">
          <div className="stat-icon" style={{ background: '#4cc9f0' }}>😌</div>
          <div className="stat-info">
            <span className="stat-label">Peaceful Moments</span>
            <span className="stat-value">
              {emotionalData.filter(d => d.valence > 30).length}
            </span>
          </div>
        </div>

        <div className="emotion-stat">
          <div className="stat-icon" style={{ background: '#7b2ff7' }}>💡</div>
          <div className="stat-info">
            <span className="stat-label">Creative Phases</span>
            <span className="stat-value">
              {emotionalData.filter(d => d.creativity > 60).length}
            </span>
          </div>
        </div>

        <div className="emotion-stat">
          <div className="stat-icon" style={{ background: '#ffbe0b' }}>😴</div>
          <div className="stat-info">
            <span className="stat-label">Deep Sleep</span>
            <span className="stat-value">
              {emotionalData.filter(d => d.deepSleep > 60).length}
            </span>
          </div>
        </div>
      </div>

      <div className="valence-insights">
        <h4>🔍 Insights</h4>
        <ul>
          <li>
            Your sleep showed <strong>{emotionalData.filter(d => d.valence > 0).length}</strong> positive 
            emotional periods out of {emotionalData.length} total stages
          </li>
          <li>
            Peak relaxation occurred around <strong>
              {emotionalData.reduce((max, d) => d.relaxation > max.relaxation ? d : max).time}
            </strong>
          </li>
          <li>
            Your {dreamType || 'dream'} aligns with a <strong>{dominantEmotion.split(' ')[0].toLowerCase()}</strong> emotional state
          </li>
        </ul>
      </div>
    </div>
  );
}
