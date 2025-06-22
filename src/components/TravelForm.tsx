import { useState } from 'react';

// 定義回傳 JSON 的型別
type ScheduleItem = {
  period: string;
  time: string;
  title: string;
  description: string;
};

type DayPlan = {
  date: string;
  weekday: string;
  schedule: ScheduleItem[];
};

type TravelPlan = {
  city: string;
  days: DayPlan[];
};

// 日期格式化工具
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function TravelForm() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [location, setLocation] = useState('高雄');
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [preferences, setPreferences] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setGeneratedPlan(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, startDate, endDate, preferences }),
      });

      if (!response.ok) throw new Error('伺服器錯誤');

      const data = await response.json();
      setGeneratedPlan(data.plan);
    } catch (error) {
      console.error(error);
      setError('行程產生失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2>行程規劃器</h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* 表單區塊 */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            flex: '1',
          }}
        >
          <label>
            地點：
            <input value={location} onChange={(e) => setLocation(e.target.value)} required />
          </label>
          <label>
            開始日期：
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>
          <label>
            結束日期：
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </label>
          <label>
            偏好（例如：牛肉麵、溫泉、火鍋...）：
            <input value={preferences} onChange={(e) => setPreferences(e.target.value)} />
          </label>
          <button type="submit" style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
            {loading ? '產生中...' : '產生行程'}
          </button>
        </form>

        {/* 結果區塊 */}
        <div
          style={{
            flex: '1',
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            minHeight: '200px',
          }}
        >
          <h3>你的行程：</h3>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          {generatedPlan && Array.isArray(generatedPlan.days) && (
            <div>
              {generatedPlan.days.map((day) => (
                <div key={day.date} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>
                    📅 {day.date}（{day.weekday}）
                  </h4>
                  {day.schedule.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem', paddingLeft: '0.5rem', borderLeft: '4px solid #007bff' }}>
                      <div style={{ fontSize: '0.9rem', color: '#555' }}>{item.period} | {item.time}</div>
                      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                      <div>{item.description}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TravelForm;
