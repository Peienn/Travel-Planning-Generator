

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# 複製後端 package.json 並安裝依賴
COPY server/package*.json ./server/
RUN cd server && npm install

# 複製全部原始碼
COPY . .

CMD ["sh", "-c", "npm run dev -- --host & node server/server_openai.js"]
