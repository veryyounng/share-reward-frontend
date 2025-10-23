## 🛍️ Share & Reward (Frontend)

Kafka 기반 상품 공유 리워드 시스템의 프론트엔드입니다.
React + Vite + Tailwind로 제작되었으며, 공유 생성 → 클릭 → 실시간 리워드 스트림을 시각화합니다.

## ⚙️ 기술 스택

Frontend: React, TypeScript, Vite, TailwindCSS

Backend: Spring Boot (Kafka 이벤트 기반)

Infra: Docker, AWS EC2

실시간 통신: SSE (Server-Sent Events)

## 🚀 실행 방법
```
# 설치
npm install

# 개발 서버 실행
npm run dev
```
## 🧩 주요 기능

상품 공유: 공유 생성 시 share.created.v1 이벤트 트리거

클릭 시뮬레이션: 클릭 요청 → 리워드 발생

실시간 리워드: SSE로 보상 이벤트 스트리밍

요약 / 리더보드: API 또는 더미 데이터로 표시

## 🧱 구조
```
src/
 ├── App.tsx          # 전체 흐름 및 API/SSE 제어
 ├── components/
 │   ├── ShopView.tsx     # 공유/클릭
 │   ├── MyPageView.tsx   # 스트림/리더보드
 │   └── Sidebar.tsx      # 탭/유저 설정
 └── types/              # API/이벤트 타입 정의
```



	
