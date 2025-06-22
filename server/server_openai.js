import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-plan', async (req, res) => {
  const { location, startDate, endDate, preferences } = req.body;

  const prompt = `
  請依據以下條件規劃旅遊行程，並**只回傳符合格式的 JSON，且不包含範例或多餘說明文字**。

  條件：
  地點：${location}
  日期：${startDate} ~ ${endDate}
  偏好：${preferences}
  請在描述的區域舉實際店名，Ex: 炸雞洋行、丹丹漢堡、壽山情人觀景台
  請回傳 JSON 格式，結構如下（請**不要**回傳此範例）：
  
  {
    "city": "高雄",
    "days": [
      {
        "date": "2025-06-21",
        "weekday": "星期六",
        "schedule": [
          {
            "period": "上午",
            "time": "09:00 - 11:00",
            "title": "蓮池潭",
            "description": "租借自行車環湖，欣賞湖邊的特色寺廟和美麗風景。拍照點：龍虎塔、蓮池潭的風景。"
          }
        ]
      }
    ]
  }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    let rawContent = completion.choices[0].message.content;
    console.log('🔹 OpenAI 回傳內容：\n', rawContent);
    rawContent = rawContent.trim()
      .replace(/^```json\s*/, '')  // 去除開頭的 ```json
      .replace(/```$/, '');        // 去除結尾的 ``
    try {
      const jsonData = JSON.parse(rawContent);
      const logData = {
        prompt: prompt,
        response: jsonData,
        timestamp: new Date().toISOString()
      };
      // ✅ 寫入 log 檔案（存成 log.json）
      fs.writeFileSync('log.json', JSON.stringify(logData, null, 2), 'utf-8');

      res.json({ plan: jsonData });
    } catch (parseError) {
      console.error('❌ JSON 解析失敗：', parseError);
      res.status(500).json({ error: 'OpenAI 回傳格式錯誤，無法解析 JSON。' });
    }
  } catch (error) {
    console.error('❌ OpenAI API 錯誤：', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

app.listen(3001, () => {
  console.log('✅ Server running on port 3001');
});
