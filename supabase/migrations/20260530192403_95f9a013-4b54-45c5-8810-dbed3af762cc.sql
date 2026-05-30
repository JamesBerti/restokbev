
-- Fix search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END; $$;

-- Lock down EXECUTE on SECURITY DEFINER helpers (only used internally by RLS / triggers)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_approved_retailer(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_approve_licensee() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Seed retailers
WITH new_retailers AS (
  INSERT INTO public.retailers (name, neighborhood, delivery_minutes) VALUES
    ('Legacy Liquor Store', 'Olympic Village', 30),
    ('Marquis Wine Cellars', 'Davie St', 45),
    ('Brewery Creek Liquor Store', 'Main St', 60),
    ('Firefly Fine Wines & Ales', 'Cambie', 75)
  RETURNING id, name
)
INSERT INTO public.products (retailer_id, name, category, price, ldb_floor, stock, rating, reviews, img, badge, description, ai_trend, ai_note)
SELECT (SELECT id FROM new_retailers WHERE name = d.retailer),
  d.name, d.category, d.price, d.ldb_floor, d.stock, d.rating, d.reviews, d.img, d.badge, d.description, d.ai_trend, d.ai_note
FROM (VALUES
  ('Marquis Wine Cellars','O''Rourke Family Estate Cabernet Franc','Red Wine',28.90,26.50,24,4.8,142,'🍷','Popular','Estate-grown, Lake Country. Dark fruit, cedar, silky tannins.','up','Ordered 3x more this month vs last. Pair with duck & lamb.'),
  ('Legacy Liquor Store','Peak Cellars Pinot Noir','Red Wine',32.50,30.00,18,4.9,89,'🍷','Top Rated','Cool-climate Okanagan. Cherry, earth, elegant finish.','up','High reorder rate. Venues near yours restocked last week.'),
  ('Marquis Wine Cellars','Burrowing Owl Merlot','Red Wine',36.00,33.50,12,4.7,203,'🍷',NULL,'Oliver, BC. Plum, mocha, structured and food-friendly.','flat','Steady demand. 12 bottles left across all retailers.'),
  ('Brewery Creek Liquor Store','Quails'' Gate Pinot Noir','Red Wine',34.75,32.00,30,4.6,167,'🍷',NULL,'Westbank, BC. Raspberry, spice, Burgundian style.','flat','Consistent seller. Good by-the-glass margin at $14.'),
  ('Legacy Liquor Store','Sumac Ridge Cabernet Merlot','Red Wine',22.00,19.50,44,4.3,98,'🍷','Best Value','Summerland. Soft tannins, everyday drinker, great margin.','up','Best price-per-margin ratio in the category right now.'),
  ('Marquis Wine Cellars','O''Rourke Family Estate Chardonnay','White Wine',26.50,24.00,36,4.7,118,'🥂','New','Barrel-fermented, Lake Country. Stone fruit, toasted oak, creamy.','up','New vintage. Early reviews strong. Reorder before it sells out.'),
  ('Legacy Liquor Store','Peak Cellars Pinot Gris','White Wine',22.00,19.50,48,4.5,76,'🥂','Best Value','Okanagan. Pear, ginger, off-dry and versatile.','flat','High-volume mover for by-the-glass programs.'),
  ('Brewery Creek Liquor Store','Tantalus Riesling','White Wine',29.00,26.50,20,4.9,234,'🥂','Top Rated','East Kelowna. Lime zest, petrol, electric acidity.','up','Most-wishlisted white in BC right now. Stock is tightening.'),
  ('Marquis Wine Cellars','Mission Hill Reserve Sauvignon Blanc','White Wine',24.50,22.00,42,4.4,155,'🥂',NULL,'Westbank. Grapefruit, fresh herb, crisp and clean.','flat','Reliable volume seller. Good pairing story for seafood.'),
  ('Marquis Wine Cellars','O''Rourke Family Estate Rosé','Rosé',23.50,21.00,60,4.8,201,'🌸','Popular','Pale salmon. Strawberry, watermelon, bone dry.','up','Seasonal surge — up 40% in orders this week. Patio season.'),
  ('Legacy Liquor Store','Sumac Ridge Rosé','Rosé',19.00,17.00,72,4.3,88,'🌸',NULL,'Summerland. Light, fresh, perfect patio pour.','up','Great BTG option at this price. High stock, fast delivery.'),
  ('Brewery Creek Liquor Store','Fitzpatrick Fitz Brut','Sparkling',38.00,35.00,8,4.8,62,'🍾','Low Stock','Traditional method. Green apple, brioche, fine bubbles.','up','Only 8 cases left across platform. Order now.'),
  ('Legacy Liquor Store','Blue Mountain Brut','Sparkling',42.00,39.00,6,4.9,44,'🍾','Low Stock','Okanagan Falls. Toasty, citrus, exceptional quality.','up','Allocation product. 6 cases remain. Not restocking until fall.'),
  ('Firefly Fine Wines & Ales','Okanagan Spirits Laird of Fintry','Whisky',58.00,54.00,15,4.6,39,'🥃',NULL,'Vernon, BC. Single malt, vanilla, caramel, locally made.','flat','Niche but loyal repeat buyers. Good for whisky-forward menus.'),
  ('Legacy Liquor Store','Johnnie Walker Black Label','Whisky',52.00,48.00,30,4.7,412,'🥃','Popular','Blended Scotch. Smoke, dried fruit, long smooth finish.','flat','Most-ordered whisky on the platform. Safe high-volume bet.'),
  ('Brewery Creek Liquor Store','Lot 40 Canadian Rye Whisky','Whisky',44.00,40.50,22,4.5,87,'🥃',NULL,'100% rye mash. Bold spice, rye bread, long finish.','up','Trending in craft cocktail programs across Vancouver.'),
  ('Firefly Fine Wines & Ales','Legend Distilling Vodka','Vodka & Gin',34.00,31.00,22,4.4,28,'🍸',NULL,'Naramata. Ultra-clean, BC grain, smooth finish.','flat','Local story resonates with guests. Mention Naramata sourcing.'),
  ('Legacy Liquor Store','Grey Goose Vodka','Vodka & Gin',62.00,57.00,28,4.8,334,'🍸','Popular','French wheat vodka. Ultra-pure, exceptionally smooth.','flat','Top-selling premium vodka across all venue types.'),
  ('Brewery Creek Liquor Store','Hendrick''s Gin','Vodka & Gin',56.00,52.00,18,4.9,201,'🍸','Top Rated','Scottish gin. Cucumber, rose, juniper. Iconic.','up','Gin & tonic orders up 28% in your segment this month.'),
  ('Marquis Wine Cellars','Tanqueray No. Ten','Vodka & Gin',50.00,46.00,34,4.7,156,'🍸',NULL,'Fresh citrus, white grapefruit, chamomile. Premium G&T.','flat','Strong performer in upscale brunch programs.'),
  ('Legacy Liquor Store','Appleton Estate 8yr Rum','Rum',46.00,42.00,20,4.6,78,'🍹',NULL,'Jamaican aged rum. Vanilla, tropical fruit, oak.','up','Rum cocktails surging. Venues adding rum-forward menus.'),
  ('Brewery Creek Liquor Store','Bacardi Superior White Rum','Rum',28.00,25.50,50,4.3,189,'🍹','Best Value','Light, clean, versatile. Mojito staple.','flat','Volume mover for high-turnover cocktail programs.'),
  ('Firefly Fine Wines & Ales','Casamigos Blanco Tequila','Tequila & Mezcal',72.00,67.00,12,4.8,267,'🌵','Popular','Highland agave. Clean, smooth, sweet citrus.','up','Tequila category up 35% YOY. Casamigos leads premium tier.'),
  ('Legacy Liquor Store','Patron Silver','Tequila & Mezcal',68.00,63.00,16,4.7,312,'🌵',NULL,'100% blue agave. Crisp, fresh, herbal notes.','up','Most reordered tequila in the system. Keep stocked.'),
  ('Brewery Creek Liquor Store','Del Maguey Vida Mezcal','Tequila & Mezcal',84.00,78.00,8,4.9,54,'🌵','Low Stock','San Luis del Rio. Smoky, earthy, complex.','up','Mezcal growing fast. Differentiate your menu with this.'),
  ('Legacy Liquor Store','Tree Brewing Kelowna''s Own Lager 24pk','Beer',52.00,48.00,40,4.3,112,'🍺',NULL,'Kelowna. Clean, crisp, crowd-pleasing lager.','flat','Volume staple. Good margin at high turnover.'),
  ('Brewery Creek Liquor Store','Parallel 49 Gypsy Tears Ruby Ale 24pk','Beer',58.00,54.00,24,4.5,88,'🍺',NULL,'Vancouver craft. Caramel, toffee, sessionable.','up','Craft beer demand up in your region. Good story for servers.'),
  ('Marquis Wine Cellars','Molson Canadian 24pk','Beer',46.00,42.00,80,4.1,445,'🍺','Best Value','Canadian lager. Reliable, universally known.','flat','Lowest cost high-volume beer on platform. Margin workhorse.'),
  ('Brewery Creek Liquor Store','Summerland Heritage Cider 12pk','Cider',38.00,35.00,28,4.5,67,'🍎',NULL,'Real Okanagan apples. Semi-dry, aromatic, local.','up','Local provenance story strong. Guests respond well.'),
  ('Legacy Liquor Store','Growers Original Cider 12pk','Cider',32.00,29.00,50,4.2,93,'🍎','Best Value','Crisp, refreshing, accessible. Best-selling BC cider.','flat','Reliable volume mover. Good non-wine option for guests.'),
  ('Legacy Liquor Store','White Claw Hard Seltzer Variety 12pk','RTD & Seltzers',34.00,31.00,60,4.4,223,'💧','Popular','Black cherry, mango, lime. 100 cal, 5% ABV.','up','Fastest-growing category on platform. Up 62% YOY.'),
  ('Brewery Creek Liquor Store','Truly Hard Seltzer 12pk','RTD & Seltzers',32.00,29.00,48,4.3,178,'💧',NULL,'Wild berry, lemonade, citrus. Light and refreshing.','up','Low-cal trend driving demand. Stock before summer peak.'),
  ('Firefly Fine Wines & Ales','Long Drink Finnish Cocktail 6pk','RTD & Seltzers',22.00,19.50,30,4.6,56,'💧','New','Finnish citrus spirit drink. Clean, dry, sessionable.','up','New to BC market. Early adopter advantage for your venue.')
) AS d(retailer, name, category, price, ldb_floor, stock, rating, reviews, img, badge, description, ai_trend, ai_note);
