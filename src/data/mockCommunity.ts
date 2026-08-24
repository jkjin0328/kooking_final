import { BlogPost } from '../types';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: '[주말 홈스토랑] 30년 전통 비법 그대로! 진한 돼지고기 김치찌개 성공기 🍲',
    snippet: '퇴근하고 냉장고에 남은 묵은지와 삼겹살로 만든 김치찌개예요. Kooking 타이머 기능 덕분에 불조절 타이밍을 기가 막히게 맞췄습니다!',
    content: `안녕하세요! 요리를 사랑하는 푸드로거 '민트초코'입니다 ✨

이번 주말에는 남편과 함께 든든한 한국인의 소울푸드, **돼지고기 묵은지 김치찌개**를 끓여보았어요.
평소에는 김치가 너무 시거나 국물이 밍밍해서 실패할 때가 많았는데, Kooking의 레시피대로 **들기름에 고기와 다진마늘을 먼저 볶고**, 묵은지에 설탕 반 작은술을 넣어 볶았더니 잡내 없이 깊고 감칠맛 폭발하는 찌개가 완성되었습니다!

![요리과정](https://images.unsplash.com/photo-1583032015879-bf73715c0e7b?w=800&auto=format&fit=crop&q=80)

### 💡 저만의 꿀팁 3가지
1. **멸치 다시마 육수는 필수!** 맹물보다 감칠맛이 3배 이상 올라가요.
2. **두부는 마지막 3분 전에!** 너무 일찍 넣으면 부서지니 조리 타이머를 맞춰두고 넣으세요.
3. **인원수 계산기 활용**: 이번엔 친정부모님 오셔서 4인분으로 배율 조절했는데 양념 비율이 딱 맞았습니다.

다들 오늘 저녁으로 맛있는 김치찌개 한 뚝배기 어떠세요? 레시피 저장해두시고 꼭 만들어보세요! 💕`,
    author: {
      name: '민트초코',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      badge: '파워블로거 셰프',
    },
    coverImage: 'https://images.unsplash.com/photo-1583032015879-bf73715c0e7b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1583032015879-bf73715c0e7b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    ],
    date: '2025.05.12 14:32',
    views: 1420,
    likes: 128,
    commentsCount: 3,
    tags: ['김치찌개', '홈스토랑', '집밥일기', '네이버블로그스타일', '저녁메뉴'],
    recipeId: 'recipe-1',
    recipeTitle: '얼큰하고 깊은 맛! 돼지고기 듬뿍 묵은지 김치찌개',
    comments: [
      {
        id: 'c-1',
        author: '따뜻한식탁',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        date: '2025.05.12 15:10',
        content: '사진만 봐도 군침이 도네요! 들기름에 먼저 볶는 팁 저도 오늘 저녁에 꼭 써봐야겠어요 👍',
        likes: 14,
        replies: [
          {
            id: 'c-1-1',
            author: '민트초코 (작성자)',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
            date: '2025.05.12 15:30',
            content: '따뜻한식탁님 꼭 해보세요! 들기름 향이 배어서 훨씬 고소하답니다 ㅎㅎ',
            likes: 6,
          },
        ],
      },
      {
        id: 'c-2',
        author: '자취10단',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        date: '2025.05.12 16:45',
        content: '밀키트 재료 장바구니로 바로 주문해서 만들어 먹었는데 정말 편했습니다. 블로그 글 잘 보고 가요!',
        likes: 9,
      },
    ],
  },
  {
    id: 'post-2',
    title: '[다이어트 식단일기] 10분 만에 끝내는 아보카도 훈제연어 포케 보울 🥑🐟',
    snippet: '식단 관리할 때 제일 중요한 건 지속가능성과 맛이죠! 탄수화물은 줄이고 단백질과 좋은 지방은 꽉 채운 샐러드 보울 레시피입니다.',
    content: `바디프로필 준비 3주 차에 접어들며 질리지 않는 클린식을 찾다가 발견한 **아보카도 훈제연어 보울**!

Kooking의 영양 성분 차트 기능을 보니까 칼로리는 340kcal에 단백질이 무려 28g이나 되더라구요.
드레싱도 올리브유와 간장, 레몬즙 베이스로 직접 만들어서 당류 걱정 없이 마음껏 즐겼습니다.

![연어보울](https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80)

음성 인식 조리 모드로 손에 물 묻은 상태에서도 "다음 단계" 말하면서 편하게 요리했어요. 스마트한 세상 최고입니다 👏`,
    author: {
      name: '헬시라이프',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badge: '식단 인플루언서',
    },
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    ],
    date: '2025.05.11 09:15',
    views: 980,
    likes: 95,
    commentsCount: 2,
    tags: ['식단일기', '다이어트레시피', '연어보울', '클린식단', '헬스타그램'],
    recipeId: 'recipe-4',
    recipeTitle: '10분 컷! 아보카도 훈제연어 샐러드 보울 & 특제 오리엔탈',
    comments: [
      {
        id: 'c-3',
        author: '러닝매니아',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        date: '2025.05.11 11:20',
        content: '운동 끝나고 단백질 보충용으로 딱이네요! 스크랩해갑니다~',
        likes: 5,
      },
    ],
  },
];
