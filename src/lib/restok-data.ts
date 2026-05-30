export type Product = {
  id: number;
  name: string;
  category: string;
  retailer: string;
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

export const RETAILERS = [
  "All Retailers",
  "Okanagan Wine Merchants",
  "Kelowna Fine Wines",
  "BC Cellar Direct",
  "Okanagan Spirits Direct",
];

export const DELIVERY_FEE = 19.0;
export const PLATFORM_FEE_RATE = 0.035;

export const PRODUCTS: Product[] = [
  { id: 1, name: "O'Rourke Family Estate Cabernet Franc", category: "Red Wine", retailer: "Okanagan Wine Merchants", price: 28.9, ldbFloor: 26.5, stock: 24, delivery: "45 min", rating: 4.8, reviews: 142, img: "🍷", badge: "Popular", description: "Estate-grown, Lake Country. Dark fruit, cedar, silky tannins.", aiTrend: "up", aiNote: "Ordered 3x more this month vs last. Pair with duck & lamb." },
  { id: 2, name: "Peak Cellars Pinot Noir", category: "Red Wine", retailer: "Kelowna Fine Wines", price: 32.5, ldbFloor: 30.0, stock: 18, delivery: "30 min", rating: 4.9, reviews: 89, img: "🍷", badge: "Top Rated", description: "Cool-climate Okanagan. Cherry, earth, elegant finish.", aiTrend: "up", aiNote: "High reorder rate. Venues near yours restocked last week." },
  { id: 3, name: "Burrowing Owl Merlot", category: "Red Wine", retailer: "Okanagan Wine Merchants", price: 36.0, ldbFloor: 33.5, stock: 12, delivery: "45 min", rating: 4.7, reviews: 203, img: "🍷", badge: null, description: "Oliver, BC. Plum, mocha, structured and food-friendly.", aiTrend: "flat", aiNote: "Steady demand. 12 bottles left across all retailers." },
  { id: 4, name: "Quails' Gate Pinot Noir", category: "Red Wine", retailer: "BC Cellar Direct", price: 34.75, ldbFloor: 32.0, stock: 30, delivery: "60 min", rating: 4.6, reviews: 167, img: "🍷", badge: null, description: "Westbank, BC. Raspberry, spice, Burgundian style.", aiTrend: "flat", aiNote: "Consistent seller. Good by-the-glass margin at $14." },
  { id: 5, name: "Sumac Ridge Cabernet Merlot", category: "Red Wine", retailer: "Kelowna Fine Wines", price: 22.0, ldbFloor: 19.5, stock: 44, delivery: "30 min", rating: 4.3, reviews: 98, img: "🍷", badge: "Best Value", description: "Summerland. Soft tannins, everyday drinker, great margin.", aiTrend: "up", aiNote: "Best price-per-margin ratio in the category right now." },
  { id: 6, name: "O'Rourke Family Estate Chardonnay", category: "White Wine", retailer: "Okanagan Wine Merchants", price: 26.5, ldbFloor: 24.0, stock: 36, delivery: "45 min", rating: 4.7, reviews: 118, img: "🥂", badge: "New", description: "Barrel-fermented, Lake Country. Stone fruit, toasted oak, creamy.", aiTrend: "up", aiNote: "New vintage. Early reviews strong. Reorder before it sells out." },
  { id: 7, name: "Peak Cellars Pinot Gris", category: "White Wine", retailer: "Kelowna Fine Wines", price: 22.0, ldbFloor: 19.5, stock: 48, delivery: "30 min", rating: 4.5, reviews: 76, img: "🥂", badge: "Best Value", description: "Okanagan. Pear, ginger, off-dry and versatile.", aiTrend: "flat", aiNote: "High-volume mover for by-the-glass programs." },
  { id: 8, name: "Tantalus Riesling", category: "White Wine", retailer: "BC Cellar Direct", price: 29.0, ldbFloor: 26.5, stock: 20, delivery: "60 min", rating: 4.9, reviews: 234, img: "🥂", badge: "Top Rated", description: "East Kelowna. Lime zest, petrol, electric acidity.", aiTrend: "up", aiNote: "Most-wishlisted white in BC right now. Stock is tightening." },
  { id: 9, name: "Mission Hill Reserve Sauvignon Blanc", category: "White Wine", retailer: "Okanagan Wine Merchants", price: 24.5, ldbFloor: 22.0, stock: 42, delivery: "45 min", rating: 4.4, reviews: 155, img: "🥂", badge: null, description: "Westbank. Grapefruit, fresh herb, crisp and clean.", aiTrend: "flat", aiNote: "Reliable volume seller. Good pairing story for seafood." },
  { id: 10, name: "O'Rourke Family Estate Rosé", category: "Rosé", retailer: "Okanagan Wine Merchants", price: 23.5, ldbFloor: 21.0, stock: 60, delivery: "45 min", rating: 4.8, reviews: 201, img: "🌸", badge: "Popular", description: "Pale salmon. Strawberry, watermelon, bone dry.", aiTrend: "up", aiNote: "Seasonal surge — up 40% in orders this week. Patio season." },
  { id: 11, name: "Sumac Ridge Rosé", category: "Rosé", retailer: "Kelowna Fine Wines", price: 19.0, ldbFloor: 17.0, stock: 72, delivery: "30 min", rating: 4.3, reviews: 88, img: "🌸", badge: null, description: "Summerland. Light, fresh, perfect patio pour.", aiTrend: "up", aiNote: "Great BTG option at this price. High stock, fast delivery." },
  { id: 12, name: "Fitzpatrick Fitz Brut", category: "Sparkling", retailer: "BC Cellar Direct", price: 38.0, ldbFloor: 35.0, stock: 8, delivery: "60 min", rating: 4.8, reviews: 62, img: "🍾", badge: "Low Stock", description: "Traditional method. Green apple, brioche, fine bubbles.", aiTrend: "up", aiNote: "Only 8 cases left across platform. Order now." },
  { id: 13, name: "Blue Mountain Brut", category: "Sparkling", retailer: "Kelowna Fine Wines", price: 42.0, ldbFloor: 39.0, stock: 6, delivery: "30 min", rating: 4.9, reviews: 44, img: "🍾", badge: "Low Stock", description: "Okanagan Falls. Toasty, citrus, exceptional quality.", aiTrend: "up", aiNote: "Allocation product. 6 cases remain. Not restocking until fall." },
  { id: 14, name: "Okanagan Spirits Laird of Fintry", category: "Whisky", retailer: "Okanagan Spirits Direct", price: 58.0, ldbFloor: 54.0, stock: 15, delivery: "75 min", rating: 4.6, reviews: 39, img: "🥃", badge: null, description: "Vernon, BC. Single malt, vanilla, caramel, locally made.", aiTrend: "flat", aiNote: "Niche but loyal repeat buyers. Good for whisky-forward menus." },
  { id: 15, name: "Johnnie Walker Black Label", category: "Whisky", retailer: "Kelowna Fine Wines", price: 52.0, ldbFloor: 48.0, stock: 30, delivery: "30 min", rating: 4.7, reviews: 412, img: "🥃", badge: "Popular", description: "Blended Scotch. Smoke, dried fruit, long smooth finish.", aiTrend: "flat", aiNote: "Most-ordered whisky on the platform. Safe high-volume bet." },
  { id: 16, name: "Lot 40 Canadian Rye Whisky", category: "Whisky", retailer: "BC Cellar Direct", price: 44.0, ldbFloor: 40.5, stock: 22, delivery: "60 min", rating: 4.5, reviews: 87, img: "🥃", badge: null, description: "100% rye mash. Bold spice, rye bread, long finish.", aiTrend: "up", aiNote: "Trending in craft cocktail programs across Vancouver." },
  { id: 17, name: "Legend Distilling Vodka", category: "Vodka & Gin", retailer: "Okanagan Spirits Direct", price: 34.0, ldbFloor: 31.0, stock: 22, delivery: "75 min", rating: 4.4, reviews: 28, img: "🍸", badge: null, description: "Naramata. Ultra-clean, BC grain, smooth finish.", aiTrend: "flat", aiNote: "Local story resonates with guests. Mention Naramata sourcing." },
  { id: 18, name: "Grey Goose Vodka", category: "Vodka & Gin", retailer: "Kelowna Fine Wines", price: 62.0, ldbFloor: 57.0, stock: 28, delivery: "30 min", rating: 4.8, reviews: 334, img: "🍸", badge: "Popular", description: "French wheat vodka. Ultra-pure, exceptionally smooth.", aiTrend: "flat", aiNote: "Top-selling premium vodka across all venue types." },
  { id: 19, name: "Hendrick's Gin", category: "Vodka & Gin", retailer: "BC Cellar Direct", price: 56.0, ldbFloor: 52.0, stock: 18, delivery: "60 min", rating: 4.9, reviews: 201, img: "🍸", badge: "Top Rated", description: "Scottish gin. Cucumber, rose, juniper. Iconic.", aiTrend: "up", aiNote: "Gin & tonic orders up 28% in your segment this month." },
  { id: 20, name: "Tanqueray No. Ten", category: "Vodka & Gin", retailer: "Okanagan Wine Merchants", price: 50.0, ldbFloor: 46.0, stock: 34, delivery: "45 min", rating: 4.7, reviews: 156, img: "🍸", badge: null, description: "Fresh citrus, white grapefruit, chamomile. Premium G&T.", aiTrend: "flat", aiNote: "Strong performer in upscale brunch programs." },
  { id: 21, name: "Appleton Estate 8yr Rum", category: "Rum", retailer: "Kelowna Fine Wines", price: 46.0, ldbFloor: 42.0, stock: 20, delivery: "30 min", rating: 4.6, reviews: 78, img: "🍹", badge: null, description: "Jamaican aged rum. Vanilla, tropical fruit, oak.", aiTrend: "up", aiNote: "Rum cocktails surging. Venues adding rum-forward menus." },
  { id: 22, name: "Bacardi Superior White Rum", category: "Rum", retailer: "BC Cellar Direct", price: 28.0, ldbFloor: 25.5, stock: 50, delivery: "60 min", rating: 4.3, reviews: 189, img: "🍹", badge: "Best Value", description: "Light, clean, versatile. Mojito staple.", aiTrend: "flat", aiNote: "Volume mover for high-turnover cocktail programs." },
  { id: 23, name: "Casamigos Blanco Tequila", category: "Tequila & Mezcal", retailer: "Okanagan Spirits Direct", price: 72.0, ldbFloor: 67.0, stock: 12, delivery: "75 min", rating: 4.8, reviews: 267, img: "🌵", badge: "Popular", description: "Highland agave. Clean, smooth, sweet citrus.", aiTrend: "up", aiNote: "Tequila category up 35% YOY. Casamigos leads premium tier." },
  { id: 24, name: "Patron Silver", category: "Tequila & Mezcal", retailer: "Kelowna Fine Wines", price: 68.0, ldbFloor: 63.0, stock: 16, delivery: "30 min", rating: 4.7, reviews: 312, img: "🌵", badge: null, description: "100% blue agave. Crisp, fresh, herbal notes.", aiTrend: "up", aiNote: "Most reordered tequila in the system. Keep stocked." },
  { id: 25, name: "Del Maguey Vida Mezcal", category: "Tequila & Mezcal", retailer: "BC Cellar Direct", price: 84.0, ldbFloor: 78.0, stock: 8, delivery: "60 min", rating: 4.9, reviews: 54, img: "🌵", badge: "Low Stock", description: "San Luis del Rio. Smoky, earthy, complex.", aiTrend: "up", aiNote: "Mezcal growing fast. Differentiate your menu with this." },
  { id: 26, name: "Tree Brewing Kelowna's Own Lager 24pk", category: "Beer", retailer: "Kelowna Fine Wines", price: 52.0, ldbFloor: 48.0, stock: 40, delivery: "30 min", rating: 4.3, reviews: 112, img: "🍺", badge: null, description: "Kelowna. Clean, crisp, crowd-pleasing lager.", aiTrend: "flat", aiNote: "Volume staple. Good margin at high turnover." },
  { id: 27, name: "Parallel 49 Gypsy Tears Ruby Ale 24pk", category: "Beer", retailer: "BC Cellar Direct", price: 58.0, ldbFloor: 54.0, stock: 24, delivery: "60 min", rating: 4.5, reviews: 88, img: "🍺", badge: null, description: "Vancouver craft. Caramel, toffee, sessionable.", aiTrend: "up", aiNote: "Craft beer demand up in your region. Good story for servers." },
  { id: 28, name: "Molson Canadian 24pk", category: "Beer", retailer: "Okanagan Wine Merchants", price: 46.0, ldbFloor: 42.0, stock: 80, delivery: "45 min", rating: 4.1, reviews: 445, img: "🍺", badge: "Best Value", description: "Canadian lager. Reliable, universally known.", aiTrend: "flat", aiNote: "Lowest cost high-volume beer on platform. Margin workhorse." },
  { id: 29, name: "Summerland Heritage Cider 12pk", category: "Cider", retailer: "BC Cellar Direct", price: 38.0, ldbFloor: 35.0, stock: 28, delivery: "60 min", rating: 4.5, reviews: 67, img: "🍎", badge: null, description: "Real Okanagan apples. Semi-dry, aromatic, local.", aiTrend: "up", aiNote: "Local provenance story strong. Guests respond well." },
  { id: 30, name: "Growers Original Cider 12pk", category: "Cider", retailer: "Kelowna Fine Wines", price: 32.0, ldbFloor: 29.0, stock: 50, delivery: "30 min", rating: 4.2, reviews: 93, img: "🍎", badge: "Best Value", description: "Crisp, refreshing, accessible. Best-selling BC cider.", aiTrend: "flat", aiNote: "Reliable volume mover. Good non-wine option for guests." },
  { id: 31, name: "White Claw Hard Seltzer Variety 12pk", category: "RTD & Seltzers", retailer: "Kelowna Fine Wines", price: 34.0, ldbFloor: 31.0, stock: 60, delivery: "30 min", rating: 4.4, reviews: 223, img: "💧", badge: "Popular", description: "Black cherry, mango, lime. 100 cal, 5% ABV.", aiTrend: "up", aiNote: "Fastest-growing category on platform. Up 62% YOY." },
  { id: 32, name: "Truly Hard Seltzer 12pk", category: "RTD & Seltzers", retailer: "BC Cellar Direct", price: 32.0, ldbFloor: 29.0, stock: 48, delivery: "60 min", rating: 4.3, reviews: 178, img: "💧", badge: null, description: "Wild berry, lemonade, citrus. Light and refreshing.", aiTrend: "up", aiNote: "Low-cal trend driving demand. Stock before summer peak." },
  { id: 33, name: "Long Drink Finnish Cocktail 6pk", category: "RTD & Seltzers", retailer: "Okanagan Spirits Direct", price: 22.0, ldbFloor: 19.5, stock: 30, delivery: "75 min", rating: 4.6, reviews: 56, img: "💧", badge: "New", description: "Finnish citrus spirit drink. Clean, dry, sessionable.", aiTrend: "up", aiNote: "New to BC market. Early adopter advantage for your venue." },
];

export type Cart = Record<number, number>;
