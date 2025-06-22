import { useLocation } from 'react-router-dom';

function PlanPage() {
  const query = new URLSearchParams(useLocation().search);
  const location = query.get('location');
  const start = query.get('start');
  const end = query.get('end');
  const preferences = query.get('preferences');

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>你選擇的行程</h2>
      <p><strong>地點：</strong>{location}</p>
      <p><strong>期間：</strong>{start} 到 {end}</p>
      <p><strong>偏好：</strong>{preferences || '無'}</p>

      <p>這裡未來可以接上 AI 產生行程或查詢推薦資料。</p>
    </div>
  );
}

export default PlanPage;
