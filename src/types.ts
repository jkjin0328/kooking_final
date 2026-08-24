export interface Ingredient {
  id: string;
  name: string;
  amount: number; // Base amount for default servings (e.g. 2 servings)
  unit: string;
  price?: number; // For mealkit / cart
  isEssential?: boolean;
  category?: 'main' | 'seasoning' | 'sub';
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  description: string;
  timeSeconds?: number;
  image?: string;
  tip?: string;
}

export interface NutritionInfo {
  calories: number; // kcal
  carbs: number;    // g
  protein: number;  // g
  fat: number;      // g
  sodium: number;   // mg
  sugar: number;    // g
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number; // 1 to 5
  date: string;
  content: string;
  image?: string;
  likes: number;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'korean' | 'western' | 'asian' | 'diet' | 'dessert' | 'quick' | 'airfryer' | 'all';
  categoryLabel: string;
  tags: string[];
  imageUrl: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number; // base servings (default e.g. 2)
  difficulty: '쉬움' | '보통' | '어려움';
  calories: number; // kcal per serving
  rating: number;
  reviewCount: number;
  likesCount: number;
  scrapsCount: number;
  author: {
    name: string;
    avatar: string;
    badge: string;
  };
  ingredients: Ingredient[];
  steps: CookingStep[];
  nutrition: NutritionInfo;
  videoUrl?: string;
  reviews?: Review[];
  mealkitPrice?: number;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  recipeId?: string;
  recipeTitle?: string;
  name: string;
  amountText: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
  };
  coverImage: string;
  images: string[];
  date: string;
  views: number;
  likes: number;
  commentsCount: number;
  tags: string[];
  recipeId?: string;
  recipeTitle?: string;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  replies?: BlogComment[];
}

export interface LiveStreamInfo {
  id: string;
  title: string;
  chefName: string;
  chefAvatar: string;
  viewerCount: number;
  recipeTitle: string;
  streamUrl: string;
  thumbnailUrl: string;
  isLive: boolean;
  scheduledTime?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  badge: string;
  bio?: string;
  scraps?: string[];
  likedRecipes?: string[];
  bookmarkedRecipeIds?: string[];
  myRecipeIds?: string[];
  myPostIds?: string[];
}

export type Language = 'ko' | 'en' | 'ja';

export interface BackendApiSpec {
  id: number;
  category: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ALL';
  endpoint: string;
  title: string;
  description: string;
  techStack: string;
  requestExample?: string;
  responseExample?: string;
  security: string;
}
