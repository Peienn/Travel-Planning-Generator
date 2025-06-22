import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-plan', (req, res) => {
  try {
    const data = fs.readFileSync('log.json', 'utf-8');
    const jsonData = JSON.parse(data);
    res.json({ plan: jsonData });
  } catch (error) {
    console.error('讀取 log.json 失敗:', error);
    res.status(500).json({ error: '讀取行程資料失敗' });
  }
});

app.listen(3001, () => {
  console.log('✅ Server running on port 3001 (讀取 log.json 模式)');
});
