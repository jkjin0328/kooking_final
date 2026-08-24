import { BackendApiSpec } from '../types';

export const SYSTEM_ARCHITECTURE_MERMAID = `flowchart TB
    subgraph ClientLayer [Client & Edge Layer]
        Browser[Web Browser / PWA Client]
        Mobile[Mobile Safari / Chrome]
        CDN[CloudFront / Edge CDN Caching]
        WAF[AWS WAF & Rate Limiting Bucket]
    end

    subgraph GatewayLayer [API Gateway & Ingress]
        LB[ALB - Application Load Balancer]
        Kong[Kong API Gateway / Nginx Reverse Proxy]
        Auth[OAuth2 / JWT Token Verifier & RTR]
    end

    subgraph ServiceLayer [Microservices / Spring Boot & Node.js Cluster]
        AuthSvc[Auth & User Service]
        RecipeSvc[Recipe & Ingredient Engine]
        FridgeSvc[Fridge Matching & AI Vision Engine]
        OrderSvc[Order & Mealkit Payment Service]
        LiveSvc[WebRTC Live Streaming & Chat Svc]
        CommSvc[Community Blog & Hierarchy Comments]
        AIAgent[Gemini 3.7 & Vision AI Model Cluster]
    end

    subgraph CacheAndQueue [In-Memory & Message Broker]
        RedisPrimary[(Redis Primary - ZSET Rankings & Like Locks)]
        RedisReplica[(Redis Replica - Rate Limit & Sessions)]
        KafkaCluster[[Apache Kafka Event Bus / SSE Notifications]]
    end

    subgraph StorageLayer [Persistence & Cloud Storage]
        MasterDB[(PostgreSQL Primary - R/W Master)]
        ReadReplica1[(PostgreSQL Read Replica 1)]
        ReadReplica2[(PostgreSQL Read Replica 2)]
        ES[(ElasticSearch 8.x - Fulltext Search Engine)]
        S3[(AWS S3 Media Bucket - WebP / Videos)]
    end

    Browser --> CDN
    CDN --> WAF
    WAF --> LB
    LB --> Kong
    Kong --> Auth
    Auth --> ServiceLayer

    RecipeSvc --> RedisPrimary
    RecipeSvc --> ES
    RecipeSvc --> MasterDB
    RecipeSvc -.-> ReadReplica1

    FridgeSvc --> AIAgent
    FridgeSvc --> S3

    OrderSvc --> MasterDB
    OrderSvc --> KafkaCluster
    OrderSvc --> RedisPrimary

    LiveSvc --> KafkaCluster
    CommSvc --> MasterDB
    CommSvc --> S3

    MasterDB -.-> ReadReplica1
    MasterDB -.-> ReadReplica2
`;

export const DATABASE_ERD_MERMAID = `erDiagram
    USERS ||--o{ RECIPES : "authors"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ BOOKMARKS : "scraps"
    USERS ||--o{ BLOG_POSTS : "publishes"
    USERS ||--o{ ORDERS : "places"
    
    RECIPES ||--|{ INGREDIENTS : "contains"
    RECIPES ||--|{ COOKING_STEPS : "has"
    RECIPES ||--o{ REVIEWS : "receives"
    RECIPES ||--o{ BOOKMARKS : "saved_in"
    
    BLOG_POSTS ||--o{ BLOG_COMMENTS : "has"
    BLOG_COMMENTS ||--o{ BLOG_COMMENTS : "replies_to"
    
    ORDERS ||--|{ ORDER_ITEMS : "includes"
    INGREDIENTS ||--o{ ORDER_ITEMS : "ordered_as"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string nickname
        string avatar_url
        string role "USER, CHEF, ADMIN"
        timestamp created_at
        timestamp last_login
    }

    RECIPES {
        uuid id PK
        uuid user_id FK
        string title
        string subtitle
        string category "korean, western, asian, diet, airfryer"
        int prep_time
        int cook_time
        int servings
        string difficulty "EASY, MEDIUM, HARD"
        int calories
        decimal rating_avg
        int view_count
        int like_count
        string video_url
        timestamp created_at
    }

    INGREDIENTS {
        uuid id PK
        uuid recipe_id FK
        string name
        decimal base_amount
        string unit
        decimal unit_price
        boolean is_essential
    }

    COOKING_STEPS {
        uuid id PK
        uuid recipe_id FK
        int step_number
        string title
        text description
        int timer_seconds
        string image_url
        string chef_tip
    }

    BLOG_POSTS {
        uuid id PK
        uuid user_id FK
        string title
        text content
        string cover_image_url
        int view_count
        int like_count
        uuid linked_recipe_id FK
        timestamp created_at
    }

    BLOG_COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        uuid parent_comment_id FK
        text content
        int depth
        timestamp created_at
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        decimal total_amount
        string payment_status "PENDING, PAID, CANCELLED"
        string payment_provider "TOSS, KAKAOPAY"
        string shipping_address
        timestamp created_at
    }
`;

export const BACKEND_30_API_SPECS: BackendApiSpec[] = [
  {
    id: 1,
    category: '인증/보안',
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    title: 'JWT & OAuth2 기반 사용자 인증',
    description: '이메일/비밀번호 또는 소셜 OAuth2(카카오, 구글, 네이버) 인가 코드를 검증하고 Access Token(1시간) 및 Refresh Token(14일)을 발급합니다.',
    techStack: 'Spring Security 6.0, JJWT, OAuth2 Client',
    security: 'Bearer JWT (Public for Login)',
    requestExample: `{\n  "email": "chef_kim@kooking.com",\n  "password": "Password123!",\n  "provider": "LOCAL"\n}`,
    responseExample: `{\n  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",\n  "refreshToken": "d8f8a1e2-45b6...",\n  "expiresIn": 3600,\n  "user": {\n    "id": "usr_101",\n    "name": "김민서",\n    "role": "CHEF"\n  }\n}`
  },
  {
    id: 2,
    category: '미디어/스토리지',
    method: 'POST',
    endpoint: '/api/v1/media/upload-url',
    title: 'AWS S3 Presigned URL 발급 API',
    description: '클라이언트가 대용량 레시피 이미지/조리 영상을 S3 버킷에 직접 안전하게 업로드할 수 있도록 짧은 유효시간(5분)의 Presigned Put URL을 생성합니다.',
    techStack: 'AWS SDK v2 S3Presigner, CloudFront',
    security: 'Bearer Token (Authorized User)',
    requestExample: `{\n  "fileName": "recipe_kimchi_step1.jpg",\n  "contentType": "image/jpeg",\n  "fileSize": 2048500\n}`,
    responseExample: `{\n  "presignedUrl": "https://kooking-media.s3.ap-northeast-2.amazonaws.com/uploads/recipe/...",\n  "mediaKey": "uploads/recipe/2025/05/12/uuid.jpg",\n  "cdnUrl": "https://cdn.kooking.com/uploads/recipe/2025/05/12/uuid.webp"\n}`
  },
  {
    id: 3,
    category: '검색/추천',
    method: 'GET',
    endpoint: '/api/v1/recipes/search/auto',
    title: '실시간 검색 및 초성 자동완성 API',
    description: '사용자의 입력 타이핑(초성 검색 포함, e.g. "ㄱㅊㅉㄱ" -> "김치찌개")에 맞춰 Trie 알고리즘 및 ElasticSearch N-gram 분석기를 거쳐 실시간 연관 검색어를 반환합니다.',
    techStack: 'ElasticSearch 8.x N-Gram, Redis Caching',
    security: 'Public API',
    requestExample: `GET /api/v1/recipes/search/auto?q=김치&limit=5`,
    responseExample: `{\n  "keywords": ["김치찌개", "김치볶음밥", "김치전", "묵은지 등갈비찜", "김치말이국수"],\n  "trending": ["통삼겹", "파스타", "연어보울"]\n}`
  },
  {
    id: 4,
    category: '레시피',
    method: 'GET',
    endpoint: '/api/v1/recipes/filter',
    title: '다중 태그/카테고리 필터링 Dynamic Query',
    description: '카테고리, 조리 시간(15분/30분/1시간 이내), 난이도, 포함/제외 재료, 칼로리 범위 등 다중 조건을 QueryDSL을 통해 동적 쿼리로 필터링 및 페이징 처리합니다.',
    techStack: 'JPA QueryDSL 5.0, PostgreSQL Partial Index',
    security: 'Public API',
    requestExample: `GET /api/v1/recipes/filter?category=korean&maxTime=30&difficulty=EASY&page=0&size=10`,
    responseExample: `{\n  "content": [ { "id": "recipe-1", "title": "돼지고기 김치찌개", "cookTime": 25 } ],\n  "page": 0,\n  "totalElements": 284,\n  "totalPages": 29\n}`
  },
  {
    id: 5,
    category: '동시성/캐시',
    method: 'POST',
    endpoint: '/api/v1/recipes/{id}/like',
    title: '좋아요/북마크 동시성 분산 락 처리',
    description: '초당 수천 건의 동시 좋아요 클릭 시 발생하는 Race Condition을 방지하기 위해 Redis Redisson 분산 락(Distributed Lock)과 비동기 Write-Back 배치로 DB 부하를 차단합니다.',
    techStack: 'Redis Redisson Lock, Kafka Producer',
    security: 'Bearer Token Required',
    requestExample: `POST /api/v1/recipes/recipe-1/like`,
    responseExample: `{\n  "recipeId": "recipe-1",\n  "isLiked": true,\n  "totalLikes": 529,\n  "syncedAt": "2025-05-12T14:32:00Z"\n}`
  },
  {
    id: 6,
    category: '스마트 엔진',
    method: 'POST',
    endpoint: '/api/v1/fridge/match',
    title: '냉장고 파먹기 매칭 알고리즘 API',
    description: '사용자가 냉장고에 보유 중인 재료 리스트를 입력받아 필수 재료 가중치 Jaccard Similarity 알고리즘을 적용하여 매칭률(%) 순으로 최적의 레시피 목록을 산출합니다.',
    techStack: 'In-Memory Cosine/Jaccard Indexer, Spring Core',
    security: 'Public or User Token',
    requestExample: `{\n  "myIngredients": ["묵은지", "돼지고기", "대파", "계란"],\n  "prioritizeEssential": true\n}`,
    responseExample: `{\n  "matches": [\n    {\n      "recipeId": "recipe-1",\n      "title": "돼지고기 김치찌개",\n      "matchPercentage": 88,\n      "missingIngredients": ["두부", "청양고추"],\n      "possessedIngredients": ["묵은지", "돼지고기", "대파"]\n    }\n  ]\n}`
  },
  {
    id: 7,
    category: '통계/캐시',
    method: 'POST',
    endpoint: '/api/v1/recipes/{id}/view',
    title: '조회수 어뷰징 방지 시스템 (Redis HyperLogLog)',
    description: '사용자 IP + User-Agent 해시값을 Redis Set/HyperLogLog에 24시간 TTL로 기록하여 F5 새로고침 및 봇에 의한 어뷰징 조회수 중복 증가를 방지합니다.',
    techStack: 'Redis HyperLogLog & Set (TTL 86400s)',
    security: 'Public (Client IP Tracking)',
    requestExample: `POST /api/v1/recipes/recipe-1/view`,
    responseExample: `{\n  "recipeId": "recipe-1",\n  "viewCount": 1421,\n  "isNewView": true\n}`
  },
  {
    id: 8,
    category: '커뮤니티',
    method: 'GET',
    endpoint: '/api/v1/recipes/{id}/comments',
    title: '계층형 댓글(대댓글) RESTful API',
    description: '네이버 블로그 스타일의 부모 댓글과 대댓글 구조(Adjacency List or Nested Set)를 효율적인 1회 쿼리로 조회하며, 비동기 페이지네이션을 지원합니다.',
    techStack: 'Spring Data JPA Recursive CTE Query',
    security: 'Public (Write requires Auth)',
    requestExample: `GET /api/v1/recipes/recipe-1/comments?page=0&size=20`,
    responseExample: `{\n  "comments": [\n    {\n      "id": "c-1",\n      "author": "따뜻한식탁",\n      "content": "정말 맛있어요!",\n      "replies": [\n        { "id": "c-1-1", "author": "민트초코", "content": "감사합니다!" }\n      ]\n    }\n  ]\n}`
  },
  {
    id: 9,
    category: '캐시/랭킹',
    method: 'GET',
    endpoint: '/api/v1/recipes/rankings',
    title: '인기 레시피 실시간 랭킹 캐싱 (Redis ZSET)',
    description: '최근 24시간 내 조회수, 좋아요, 스크랩 가중치 점수를 합산하여 Redis Sorted Set(ZSET)에 실시간 적재하고 1분 주기로 갱신되는 1~10위 랭킹을 초고속 반환합니다.',
    techStack: 'Redis ZSET (ZREVRANGEBYSCORE)',
    security: 'Public Cache Hit (<2ms)',
    requestExample: `GET /api/v1/recipes/rankings?timeframe=daily&top=10`,
    responseExample: `{\n  "updatedAt": "2025-05-12T14:30:00Z",\n  "rankings": [\n    { "rank": 1, "recipeId": "recipe-1", "title": "돼지고기 김치찌개", "score": 9480 },\n    { "rank": 2, "recipeId": "recipe-5", "title": "에어프라이어 통삼겹", "score": 8810 }\n  ]\n}`
  },
  {
    id: 10,
    category: '실시간 알림',
    method: 'GET',
    endpoint: '/api/v1/notifications/subscribe',
    title: 'Real-time 알림 스트림 (SSE: Server-Sent Events)',
    description: '내 레시피 댓글 작성, 좋아요, 팔로우한 셰프의 라이브 방송 시작 등의 알림을 HTTP/2 기반 SSE 지속 연결을 통해 클라이언트에 무지연 푸시합니다.',
    techStack: 'Spring SseEmitter, Redis Pub/Sub',
    security: 'Bearer JWT (HTTP Header / QueryParam)',
    requestExample: `GET /api/v1/notifications/subscribe (Accept: text/event-stream)`,
    responseExample: `event: notification\ndata: {"type": "NEW_COMMENT", "message": "따뜻한식탁님이 회원님의 글에 댓글을 남겼습니다.", "link": "/blog/post-1"}\n\n`
  },
  {
    id: 11,
    category: 'AI/비전',
    method: 'POST',
    endpoint: '/api/v1/ai/vision-extract',
    title: 'AI 이미지 식별 및 냉장고 재료 자동 추출',
    description: '사용자가 스마트폰으로 촬영한 냉장고/식재료 사진을 Gemini Vision AI 모델로 분석하여 식재료 이름, 개수, 신선도 등급을 자동 판별합니다.',
    techStack: 'Gemini 3.7 Vision API, Google GenAI SDK',
    security: 'Bearer Token (Rate Limited)',
    requestExample: `{\n  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."\n}`,
    responseExample: `{\n  "detectedIngredients": [\n    { "name": "계란", "confidence": 0.98, "count": "3개", "freshScore": "A+" },\n    { "name": "양파", "confidence": 0.94, "count": "1개", "freshScore": "A" }\n  ],\n  "suggestedRecipes": ["계란 볶음밥", "양파 계란말이"]\n}`
  },
  {
    id: 12,
    category: '커머스/결제',
    method: 'POST',
    endpoint: '/api/v1/payments/confirm',
    title: '밀키트/식재료 결제 승인 API (토스페이/카카오페이)',
    description: 'PG사 결제 인증 완료 후 paymentKey, orderId, amount를 전달받아 위변조를 검증하고 최종 결제를 승인한 뒤 주문 상태를 PAID로 전환합니다.',
    techStack: 'Toss Payments API, Spring Transactional',
    security: 'Bearer JWT + PG Secret Key Header',
    requestExample: `{\n  "paymentKey": "toss_pk_202505121234",\n  "orderId": "ORD-839201",\n  "amount": 23800\n}`,
    responseExample: `{\n  "status": "DONE",\n  "orderId": "ORD-839201",\n  "approvedAt": "2025-05-12T14:35:10Z",\n  "receiptUrl": "https://dashboard.tosspayments.com/receipt/..."\n}`
  },
  {
    id: 13,
    category: '커머스/동시성',
    method: 'POST',
    endpoint: '/api/v1/orders/mealkit',
    title: '트랜잭션 & 재고 차감 비관적 락(Pessimistic Lock) 제어',
    description: '한정 수량 밀키트의 동시 주문 시 초과 판매(Overselling)를 막기 위해 DB `SELECT FOR UPDATE` 또는 Redis Lua 스크립트로 원자적(Atomic) 재고 차감을 수행합니다.',
    techStack: 'JPA Pessimistic Write Lock, Redis Lua Script',
    security: 'Bearer Token (Authorized User)',
    requestExample: `{\n  "items": [\n    { "recipeId": "recipe-1", "ingredientId": "ing-1", "quantity": 2, "price": 3500 }\n  ],\n  "address": "서울특별시 강남구 테헤란로 123 7층",\n  "paymentMethod": "TOSS_PAY"\n}`,
    responseExample: `{\n  "orderId": "ORD-519284",\n  "status": "CONFIRMED",\n  "totalAmount": 7000,\n  "estimatedDelivery": "내일 새벽 07:00 도착 보장"\n}`
  },
  {
    id: 14,
    category: '인증/보안',
    method: 'POST',
    endpoint: '/api/v1/auth/refresh',
    title: 'OAuth2 Refresh Token Rotation (RTR)',
    description: 'Access Token 만료 시 Refresh Token을 검증하고, 일회용 원칙(RTR)에 따라 사용된 Refresh Token을 무효화한 뒤 새 Access Token 및 새 Refresh Token을 동시 발급합니다.',
    techStack: 'Spring Security, Redis Token Blacklist',
    security: 'Refresh Token Header',
    requestExample: `{\n  "refreshToken": "d8f8a1e2-45b6..."\n}`,
    responseExample: `{\n  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",\n  "refreshToken": "c9e7b3a1-12c4...",\n  "expiresIn": 3600\n}`
  },
  {
    id: 15,
    category: '인프라/보안',
    method: 'ALL',
    endpoint: '/api/v1/*',
    title: 'API Rate Limiting (Redis Token Bucket 알고리즘)',
    description: 'DDoS 및 스크래핑을 방지하기 위해 사용자 IP 또는 User ID 단위로 분당 최대 120회 요청 제한을 초과할 시 HTTP 429 Too Many Requests를 반환합니다.',
    techStack: 'Bucket4j, Redis Token Bucket Engine',
    security: 'Global Gateway Filter',
    requestExample: `Header: X-Forwarded-For: 203.0.113.195`,
    responseExample: `HTTP 429 Too Many Requests\n{\n  "error": "RATE_LIMIT_EXCEEDED",\n  "retryAfter": 12,\n  "message": "요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요."\n}`
  },
  {
    id: 16,
    category: '검색',
    method: 'GET',
    endpoint: '/api/v1/search/fulltext',
    title: 'ElasticSearch 전문 검색 (BM25 + Synonym 사전)',
    description: '요리명, 재료명, 본문 레시피 설명, 조리 팁을 대상으로 한국어 형태소 분석기(Nori)와 동의어(스팸=통조림햄, 대파=파)를 적용하여 정밀 검색 결과를 제공합니다.',
    techStack: 'ElasticSearch 8.x Nori Tokenizer, Logstash',
    security: 'Public API',
    requestExample: `GET /api/v1/search/fulltext?q=얼큰한 묵은지 찌개&sort=relevance`,
    responseExample: `{\n  "took": 4,\n  "total": 38,\n  "hits": [\n    { "_id": "recipe-1", "_score": 4.82, "title": "돼지고기 묵은지 김치찌개" }\n  ]\n}`
  },
  {
    id: 17,
    category: '메시징',
    method: 'POST',
    endpoint: '/api/v1/notifications/async-email',
    title: '비동기 카카오 알림톡 & 이메일 발송 (Kafka / RabbitMQ)',
    description: '주문 완료, 배송 시작, 비밀번호 재설정 메일 발송 작업을 동기 API 요청에서 분리하여 Apache Kafka 큐에 적재하고 Worker 클러스터에서 비동기로 처리합니다.',
    techStack: 'Apache Kafka 3.4, AWS SES, Aligo Kakao Alimtalk',
    security: 'Internal S2S Microservice Call',
    requestExample: `{\n  "templateId": "ORDER_COMPLETE_V1",\n  "receiverPhone": "010-1234-5678",\n  "variables": { "orderId": "ORD-519284", "itemCount": 2 }\n}`,
    responseExample: `{\n  "messageId": "msg-kafka-98124",\n  "status": "QUEUED",\n  "publishedAt": "2025-05-12T14:35:12Z"\n}`
  },
  {
    id: 18,
    category: '배치',
    method: 'POST',
    endpoint: '/api/v1/batch/daily-maintenance',
    title: '일일 통계 집계 & 만료 토큰 정리 배치 (Spring Batch)',
    description: '매일 자정 00:00에 실행되어 일일 요리 통계 산출, 만료된 Refresh Token 및 블랙리스트 레코드 삭제, 레시피 인기 랭킹 재계산 파이프라인을 실행합니다.',
    techStack: 'Spring Batch 5.0, Quartz Scheduler, Jenkins',
    security: 'Admin IP Whitelist / Batch Secret',
    requestExample: `POST /api/v1/batch/daily-maintenance`,
    responseExample: `{\n  "jobExecutionId": 8920,\n  "status": "COMPLETED",\n  "processedRecords": 45890,\n  "durationSeconds": 14.2\n}`
  },
  {
    id: 19,
    category: '영양/헬스',
    method: 'POST',
    endpoint: '/api/v1/nutrition/calculate',
    title: '정밀 영양소 계산 Engine (식약처 공공DB 연동)',
    description: '레시피에 등록된 각 식재료의 그람(g) 단위 수량을 바탕으로 식약처 식품영양성분 DB와 매핑하여 1인분당 칼로리, 탄수화물, 단백질, 지방, 나트륨, 당류를 정밀 산출합니다.',
    techStack: '식약처 식품영양 DB API, Python NumPy Engine',
    security: 'Public / Internal API',
    requestExample: `{\n  "ingredients": [\n    { "name": "돼지고기 삼겹살", "amountGram": 200 },\n    { "name": "두부", "amountGram": 150 }\n  ],\n  "servings": 2\n}`,
    responseExample: `{\n  "perServing": {\n    "calories": 420,\n    "carbs": 24,\n    "protein": 32,\n    "fat": 22,\n    "sodium": 890,\n    "sugar": 6\n  }\n}`
  },
  {
    id: 20,
    category: '추천/AI',
    method: 'GET',
    endpoint: '/api/v1/recommendations/personal',
    title: '개인화 레시피 추천 시스템 (협업 필터링 Matrix Factorization)',
    description: '사용자가 과거 북마크하거나 별점 5점을 준 레시피와 유사한 취향을 가진 유저 군집의 소비 데이터를 분석하여 개인 맞춤 레시피 5종을 추천합니다.',
    techStack: 'Surprise SVD++ Engine, Redis Vector Search',
    security: 'Bearer Token (Personalized)',
    requestExample: `GET /api/v1/recommendations/personal?userId=usr_101&limit=5`,
    responseExample: `{\n  "recommendedRecipes": [\n    { "recipeId": "recipe-2", "title": "트러플 크림 파스타", "reason": "최근 묵은지 김치찌개를 스크랩한 유저들이 많이 본 레시피" }\n  ]\n}`
  },
  {
    id: 21,
    category: '셰프/구독',
    method: 'POST',
    endpoint: '/api/v1/chefs/{id}/subscribe',
    title: 'Multi-tenant 셰프 스토어 & 멤버십 구독 API',
    description: '인기 셰프의 프리미엄 시크릿 레시피 열람권 및 월간 밀키트 정기 배송 멤버십을 구독 결제(정기 결제 빌링키 생성) 처리합니다.',
    techStack: 'Billing Auto-Debit Engine, Multi-Tenant DB Schema',
    security: 'Bearer Token (Subscriber User)',
    requestExample: `{\n  "chefId": "chef_alessandro",\n  "tier": "PREMIUM_VIP",\n  "billingKey": "bill_toss_912384"\n}`,
    responseExample: `{\n  "subscriptionId": "SUB-9401",\n  "status": "ACTIVE",\n  "nextBillingDate": "2025-06-12",\n  "benefits": ["시크릿 레시피 무제한", "라이브 채팅 VIP 배지"]\n}`
  },
  {
    id: 22,
    category: '실시간/WebRTC',
    method: 'POST',
    endpoint: '/api/v1/webrtc/signal',
    title: 'WebRTC 기반 라이브 시그널링 & SFU 서버 연동',
    description: '셰프의 초고화질 4K 라이브 스트리밍과 시청자 간 SDP Offer/Answer 교환 및 ICE Candidate 시그널링을 중계합니다.',
    techStack: 'Mediasoup SFU Node.js, WebSockets',
    security: 'Bearer JWT (Stream Host / Viewer Token)',
    requestExample: `{\n  "streamId": "live-stream-1",\n  "type": "offer",\n  "sdp": "v=0\\no=- 123456 2 IN IP4 127.0.0.1..."\n}`,
    responseExample: `{\n  "type": "answer",\n  "sdp": "v=0\\no=- 987654 2 IN IP4 127.0.0.1...",\n  "transportId": "sfu_trans_9812"\n}`
  },
  {
    id: 23,
    category: '위치/GIS',
    method: 'GET',
    endpoint: '/api/v1/studios/nearby',
    title: 'GIS 위치 기반 공유 쿠킹 스튜디오 예약 System',
    description: '사용자의 현재 GPS 좌표(위도/경도)를 기준으로 반경 N km 내에 위치한 오픈 쿠킹 스튜디오를 PostgreSQL PostGIS 공간 쿼리로 탐색하고 예약 현황을 조회합니다.',
    techStack: 'PostgreSQL PostGIS (ST_DWithin, ST_Distance)',
    security: 'Public API',
    requestExample: `GET /api/v1/studios/nearby?lat=37.5665&lng=126.9780&radiusKm=5`,
    responseExample: `{\n  "studios": [\n    {\n      "id": "std-1",\n      "name": "Kooking 성수 오픈키친",\n      "distanceKm": 1.2,\n      "availableSlots": ["14:00", "16:00", "19:00"]\n    }\n  ]\n}`
  },
  {
    id: 24,
    category: 'DB/인프라',
    method: 'GET',
    endpoint: '/api/v1/db/read-replica',
    title: '데이터베이스 Read/Write 분리 & Replication 라우팅',
    description: 'Spring `@Transactional(readOnly = true)` 감지 시 RoutingDataSource가 읽기 전용 슬레이브(Replica) DB로 쿼리를 자동 라우팅하여 마스터 DB 쓰기 병목을 해소합니다.',
    techStack: 'Spring AbstractRoutingDataSource, AWS Aurora Read Replica',
    security: 'Internal Gateway Config',
    requestExample: `Internal Context: Transactional(readOnly = true)`,
    responseExample: `{\n  "routedTarget": "aurora-reader-endpoint.ap-northeast-2.rds.amazonaws.com",\n  "lagMs": 1.4\n}`
  },
  {
    id: 25,
    category: '운영/배포',
    method: 'GET',
    endpoint: '/actuator/health',
    title: '헬스체크 및 Zero-Downtime 무중단 배포 (Blue/Green)',
    description: 'Kubernetes Liveness / Readiness 프로브와 연동되어 DB 커넥션 풀, Redis 연결, 디스크 용량 상태를 종합 체크하고 Blue/Green 무중단 트래픽 전환을 보장합니다.',
    techStack: 'Spring Boot Actuator, Kubernetes Probes',
    security: 'Internal Monitoring Port (8081)',
    requestExample: `GET /actuator/health`,
    responseExample: `{\n  "status": "UP",\n  "components": {\n    "db": { "status": "UP", "details": { "database": "PostgreSQL" } },\n    "redis": { "status": "UP" },\n    "diskSpace": { "status": "UP", "details": { "free": 128940000000 } }\n  }\n}`
  },
  {
    id: 26,
    category: '보안/감사',
    method: 'GET',
    endpoint: '/api/v1/admin/audit-logs',
    title: 'Audit Log & 보안 이력 추적 (AOP 기반 변경 이력 기록)',
    description: '관리자 또는 유저의 레시피 삭제, 개인정보 수정, 결제 취소 등 민감 작업 발생 시 이전/이후 스냅샷과 IP, 작업자 ID를 불변 로그 테이블에 적재합니다.',
    techStack: 'Spring AOP, Hibernate Envers, ELK Stack',
    security: 'Admin Role (SUPER_ADMIN Only)',
    requestExample: `GET /api/v1/admin/audit-logs?action=DELETE_RECIPE&startDate=2025-05-01`,
    responseExample: `{\n  "logs": [\n    {\n      "id": "log-912",\n      "operatorId": "admin_master",\n      "action": "DELETE_RECIPE",\n      "targetId": "recipe-old-9",\n      "ipAddress": "192.168.1.10",\n      "timestamp": "2025-05-10T11:20:00Z"\n    }\n  ]\n}`
  },
  {
    id: 27,
    category: '유틸리티',
    method: 'GET',
    endpoint: '/api/v1/recipes/{id}/pdf',
    title: 'PDF 레시피 카드 자동 생성 Engine (Headless Chrome)',
    description: '레시피 상세 정보, 재료 목록, 조리 순서, 영양성분 차트를 인쇄용 A4 PDF 카드 형태로 실시간 렌더링하여 다운로드할 수 있는 바이너리 스트림을 생성합니다.',
    techStack: 'Puppeteer / iText 7, AWS Lambda',
    security: 'Public / User Token',
    requestExample: `GET /api/v1/recipes/recipe-1/pdf?format=A4`,
    responseExample: `Content-Type: application/pdf\nContent-Disposition: attachment; filename="recipe-1-kooking-card.pdf"\n[Binary Stream ...]`
  },
  {
    id: 28,
    category: '국제화/i18n',
    method: 'POST',
    endpoint: '/api/v1/i18n/translate',
    title: '다국어 AI 번역 & 번역 캐싱 (KO / EN / JA)',
    description: '한국어 요리 레시피를 전 세계 사용자가 볼 수 있도록 Gemini AI 번역 모델로 자동 번역하고, 번역된 결과를 Redis 및 CDN에 캐싱하여 다국어 즉시 전환을 지원합니다.',
    techStack: 'Gemini 3.7 API, Redis i18n Cache',
    security: 'Public Cached API',
    requestExample: `{\n  "recipeId": "recipe-1",\n  "targetLanguage": "EN"\n}`,
    responseExample: `{\n  "translatedTitle": "Deep & Rich! Aged Kimchi Pork Stew (Kimchi-jjigae)",\n  "language": "EN",\n  "cached": true\n}`
  },
  {
    id: 29,
    category: '관리자',
    method: 'GET',
    endpoint: '/api/v1/admin/dashboard/metrics',
    title: '관리자 대시보드 실시간 비즈니스 통계 API',
    description: '일일 활성 유저(DAU), 분당 API 호출수, 밀키트 결제 총액, 레시피 등록 트렌드, 서버 리소스 사용률을 집계하여 대시보드 차트 데이터로 반환합니다.',
    techStack: 'Prometheus, Grafana, PostgreSQL Aggregations',
    security: 'Admin Role (ADMIN / CHEF_ADMIN)',
    requestExample: `GET /api/v1/admin/dashboard/metrics?range=today`,
    responseExample: `{\n  "dau": 48290,\n  "totalOrdersToday": 1420,\n  "revenueToday": 28400000,\n  "newRecipesToday": 340,\n  "avgResponseTimeMs": 14.5\n}`
  },
  {
    id: 30,
    category: 'GDPR/개인정보',
    method: 'DELETE',
    endpoint: '/api/v1/users/privacy-purge',
    title: 'GDPR 및 개인정보 영구 파기/익명화 자동화 API',
    description: '회원 탈퇴 시 개인정보보호법 및 GDPR 잊힐 권리에 따라 사용자의 이메일, 전화번호, 결제정보를 마스킹/암호화 파기하고 작성 레시피는 탈퇴회원 처리합니다.',
    techStack: 'Spring Batch Privacy Processor, Crypto Shredding',
    security: 'Bearer Token (Account Owner Self)',
    requestExample: `DELETE /api/v1/users/privacy-purge\n{\n  "reason": "개인 사유",\n  "confirmPassword": "Password123!"\n}`,
    responseExample: `{\n  "status": "PURGED",\n  "purgedAt": "2025-05-12T14:38:00Z",\n  "message": "회원님의 모든 개인정보가 안전하게 영구 파기되었습니다."\n}`
  }
];
