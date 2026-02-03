# Solved.ac Dashboard

Solved.ac 학습 패턴 분석 및 시각화 대시보드

## 기능

- 사용자 프로필 조회 (티어 뱃지, 레이팅, 랭킹)
- 난이도별 문제 풀이 통계 (바 차트)
- 태그별 문제 풀이 통계 (도넛 차트, Top 10)
- 잔디 캘린더 (GitHub 스타일 활동 기록)
- 최고 난이도 문제 Top 10 (백준 링크 연동)
- 최근 검색 아이디 저장 (로컬 스토리지)

## 기술 스택

- **Backend:** FastAPI, httpx, Pydantic
- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **API:** Solved.ac API v3

## 설치 및 실행

### 1. 클론

```bash
git clone https://github.com/Dev-2A/solvedac-dashboard.git
cd solvedac-dashboard
```

### 2. 가상환경 설정

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

### 3. 의존성 설치

```bash
pip install -r backend/requirements.txt
```

### 4. 백엔드 실행

```bash
cd backend
uvicorn app.main:app --reload
```

### 5. 프론트엔드 실행 (새 터미널)

```bash
cd frontend
python -m http.server 5500
```

### 6. 접속

- 대시보드: http://localhost:5500
- API 문서: http://127.0.0.1:8000/docs

## API 엔드포인트

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/user/{handle}` | 사용자 프로필 |
| GET | `/api/user/{handle}/stats` | 난이도별 통계 |
| GET | `/api/user/{handle}/tags` | 태그별 통계 |
| GET | `/api/user/{handle}/grass` | 잔디 데이터 |
| GET | `/api/user/{handle}/problems` | 최고 난이도 문제 |

## 프로젝트 구조

```text
solvedac-dashboard/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── api/
│       │   └── user.py
│       ├── services/
│       │   └── solvedac_client.py
│       ├── schemas/
│       │   └── user.py
│       └── models/
└── frontend/
    ├── index.html
    └── app.js
```

## 라이선스

MIT
