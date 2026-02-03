# 🏆 Solved.ac Dashboard

Solved.ac 학습 패턴 분석 및 라이벌 비교 대시보드

## 기능

### 📊 개인 대시보드

- 프로필 카드 (티어, 레이팅, 랭킹, 스트릭)
- 난이도별 풀이 현황 바 차트
- 태그별 풀이 현황 레이더 차트
- GitHub 스타일 풀이 잔디 캘린더

### ⚔️ 라이벌 비교

- 두 유저 프로필 VS 비교
- 종합 승패 요약 (4개 항목)
- 난이도별 나란히 비교 바 차트
- 태그별 오버레이 비교 레이더 차트

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Backend | Python, FastAPI, httpx |
| Frontend | Next.js, TypeScript, Tailwind CSS |
| 차트 | Recharts |
| API | Solved.ac API v3 |

## 실행 방법

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd web
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 프로젝트 구조

```text
solvedac-dashboard/
├── backend/
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── api/user.py
│       ├── services/solvedac_client.py
│       └── schemas/user.py
├── web/
│   ├── app/
│   │   ├── page.tsx          (개인 대시보드)
│   │   └── rival/page.tsx    (라이벌 비교)
│   ├── components/           (UI 컴포넌트)
│   └── lib/                  (API 유틸리티)
└── frontend-v1/              (기존 바닐라 코드 아카이브)
```

## 라이선스

MIT
