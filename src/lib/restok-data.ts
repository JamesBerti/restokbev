export type Product = {
  id: string;
  name: string;
  category: string;
  retailer: string;
  retailer_id: string;
  price: number;
  ldbFloor: number;
  stock: number;
  delivery: string;
  rating: number;
  reviews: number;
  img: string;
  badge: string | null;
  description: string;
  aiTrend: "up" | "down" | "flat";
  aiNote: string;
};

export type Retailer = {
  id: string;
  name: string;
  neighborhood: string | null;
  delivery_minutes: number;
};

export const CATEGORIES = [
  { label: "All", emoji: "🛒" },
  { label: "Red Wine", emoji: "🍷" },
  { label: "White Wine", emoji: "🥂" },
  { label: "Rosé", emoji: "🌸" },
  { label: "Sparkling", emoji: "🍾" },
  { label: "Whisky", emoji: "🥃" },
  { label: "Vodka & Gin", emoji: "🍸" },
  { label: "Rum", emoji: "🍹" },
  { label: "Tequila & Mezcal", emoji: "🌵" },
  { label: "Beer", emoji: "🍺" },
  { label: "Cider", emoji: "🍎" },
  { label: "RTD & Seltzers", emoji: "💧" },
];

export const DELIVERY_FEE = 19.0;
export const PLATFORM_FEE_RATE = 0.035;

export type Cart = Record<string, number>;
