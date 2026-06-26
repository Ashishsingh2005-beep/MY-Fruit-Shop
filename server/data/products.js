const products = [
  // ─── DRAGON FRUITS ───────────────────────────────
  { name: "Dragon Fruit (White Flesh)", price: 120, originalPrice: 150, category: "Fruits", subCategory: "Dragon", color: "#FF1493", emoji: "🐉", description: "Exotic white-fleshed dragon fruit. Mildly sweet & rich in antioxidants.", rating: 4.8, isFeatured: true, isHot: true, tags: ["exotic", "antioxidant", "vitamin-c"] },
  { name: "Dragon Fruit (Red Flesh)", price: 150, originalPrice: 196, category: "Fruits", subCategory: "Dragon", color: "#C71585", emoji: "🐲", description: "Premium red-fleshed dragon fruit. Rich in antioxidants.", rating: 4.9, isFeatured: true, tags: ["exotic", "premium"] },

  // ─── MANGOES ─────────────────────────────────────
  { name: "Mango Dasheri (Malihabad)", price: 100, originalPrice: 127, category: "Fruits", color: "#FFD700", emoji: "🥭", description: "Famous Dasheri mangoes from Malihabad. Sweet and aromatic.", rating: 4.9, isFeatured: true, isHot: true, tags: ["mango", "summer", "sweet"] },
  { name: "Mango Langra (Banaras)", price: 80, originalPrice: 108, category: "Fruits", color: "#9ACD32", emoji: "🥭", description: "Green-skinned Langra mangoes with unique tangy-sweet flavor.", rating: 4.8, tags: ["mango", "summer"] },
  { name: "Mango Chausa", price: 120, originalPrice: 145, category: "Fruits", color: "#FFC20E", emoji: "🥭", description: "Sweetest sucking mango, golden yellow Chausa.", rating: 4.9, isHot: true, tags: ["mango", "summer", "premium"] },
  { name: "Mango Safeda (Banganapalli)", price: 90, originalPrice: 108, category: "Fruits", color: "#F4C430", emoji: "🥭", description: "Early season Safeda mangoes. Large and pulp-filled.", rating: 4.7, tags: ["mango"] },

  // ─── COMMON FRUITS ────────────────────────────────
  { name: "Kashmiri Apple (Kinnaur)", price: 180, originalPrice: 243, category: "Fruits", color: "#D32F2F", emoji: "🍎", description: "Crispy and sweet red apples from Kinnaur/Kashmir.", rating: 4.8, isFeatured: true, tags: ["apple", "healthy"] },
  { name: "Banana (Chitti)", price: 60, originalPrice: 73, category: "Fruits", color: "#FFE135", emoji: "🍌", description: "Sweet spotted bananas. High energy, potassium-rich.", rating: 4.5, tags: ["banana", "energy"] },
  { name: "Lychee (Shahi)", price: 150, originalPrice: 187, category: "Fruits", color: "#FF4500", emoji: "🍈", description: "Juicy and sweet Shahi Lychee from Muzaffarpur.", rating: 4.7, isHot: true, tags: ["lychee", "summer"] },
  { name: "Pomegranate (Kandhari Anar)", price: 160, originalPrice: 206, category: "Fruits", color: "#DC143C", emoji: "🔴", description: "Deep red ruby pearls, rich in iron and antioxidants.", rating: 4.7, isFeatured: true, tags: ["pomegranate", "iron", "healthy"] },
  { name: "Papaya (Disco)", price: 50, originalPrice: 63, category: "Fruits", color: "#FF8C00", emoji: "🍈", description: "Sweet, ripe papaya. Good for digestion.", rating: 4.6, tags: ["papaya", "digestion"] },
  { name: "Guava (Allahabad Safeda)", price: 60, originalPrice: 73, category: "Fruits", color: "#98FB98", emoji: "🍏", description: "Crunchy guava with sweet white flesh.", rating: 4.4, tags: ["guava"] },
  { name: "Watermelon (Tarbooz)", price: 30, originalPrice: 38, category: "Fruits", color: "#2E8B57", emoji: "🍉", description: "Hydrating red Watermelon. Perfect for summers.", rating: 4.6, isHot: true, tags: ["watermelon", "summer", "hydrating"] },
  { name: "Muskmelon (Kharbuja)", price: 40, originalPrice: 51, category: "Fruits", color: "#F4A460", emoji: "🍈", description: "Sweet and aromatic Kharbuja.", rating: 4.5, tags: ["melon", "summer"] },
  { name: "Strawberry", price: 250, originalPrice: 322, category: "Fruits", color: "#FF0000", emoji: "🍓", description: "Fresh Mahabaleshwar strawberries. (Per Box)", rating: 4.8, isFeatured: true, tags: ["strawberry", "premium"] },
  { name: "Kiwi", price: 40, originalPrice: 49, category: "Fruits", color: "#8B4513", emoji: "🥝", description: "Tangy Zespri Kiwi. (Per Piece)", rating: 4.5, tags: ["kiwi", "vitamin-c"] },
  { name: "Grapes (Black Seedless)", price: 100, originalPrice: 135, category: "Fruits", color: "#4B0082", emoji: "🍇", description: "Sweet black seedless grapes.", rating: 4.7, tags: ["grapes"] },
  { name: "Grapes (Green Sonaka)", price: 80, originalPrice: 96, category: "Fruits", color: "#ADFF2F", emoji: "🍇", description: "Long sweet green grapes.", rating: 4.6, tags: ["grapes"] },
  { name: "Pineapple (Rani)", price: 80, originalPrice: 100, category: "Fruits", color: "#FFD700", emoji: "🍍", description: "Sweet and tangy Rani Pineapple. (Per Piece)", rating: 4.6, tags: ["pineapple", "tropical"] },
  { name: "Orange (Nagpur)", price: 60, originalPrice: 79, category: "Fruits", color: "#FFA500", emoji: "🍊", description: "Famous juicy Nagpur oranges.", rating: 4.5, tags: ["orange", "vitamin-c"] },
  { name: "Blueberry", price: 400, originalPrice: 480, category: "Fruits", color: "#483D8B", emoji: "🫐", description: "Antioxidant rich blueberries. (Per Box)", rating: 4.9, isFeatured: true, tags: ["blueberry", "premium", "antioxidant"] },
  { name: "Avocado (Butter Fruit)", price: 150, originalPrice: 180, category: "Fruits", color: "#556B2F", emoji: "🥑", description: "Creamy ripe avocados. (Per Piece)", rating: 4.7, isFeatured: true, tags: ["avocado", "healthy-fat"] },
  { name: "Cherry (Imported)", price: 300, originalPrice: 399, category: "Fruits", color: "#8B0000", emoji: "🍒", description: "Sweet red cherries. (Per Box)", rating: 4.8, isHot: true, tags: ["cherry", "premium", "imported"] },

  // ─── VEGETABLES ───────────────────────────────────
  { name: "Potato (Old/Pahari)", price: 30, originalPrice: 39, category: "Vegetables", color: "#DEB887", emoji: "🥔", description: "Best for sabzi and fries.", rating: 4.5, tags: ["potato", "daily"] },
  { name: "Onion (Nashik)", price: 40, originalPrice: 52, category: "Vegetables", color: "#C71585", emoji: "🧅", description: "Dry pink onions from Nashik.", rating: 4.4, tags: ["onion", "daily"] },
  { name: "Tomato (Desi)", price: 50, originalPrice: 61, category: "Vegetables", color: "#FF4500", emoji: "🍅", description: "Tangy desi tomatoes.", rating: 4.5, tags: ["tomato", "daily"] },
  { name: "Carrot (Red/Winter)", price: 40, originalPrice: 53, category: "Vegetables", color: "#FF6347", emoji: "🥕", description: "Sweet red carrots for Halwa.", rating: 4.6, tags: ["carrot", "vitamin-a"] },
  { name: "Spinach (Palak)", price: 30, originalPrice: 39, category: "Vegetables", color: "#008000", emoji: "🥬", description: "Fresh leafy spinach. Iron-rich.", rating: 4.5, tags: ["spinach", "iron", "healthy"] },
  { name: "Capsicum (Shimla Mirch)", price: 80, originalPrice: 96, category: "Vegetables", color: "#008000", emoji: "🫑", description: "Crunchy green capsicum.", rating: 4.5, tags: ["capsicum"] },
  { name: "Cucumber (Kheera)", price: 40, originalPrice: 48, category: "Vegetables", color: "#228B22", emoji: "🥒", description: "Cool and crisp cucumber.", rating: 4.6, tags: ["cucumber", "hydrating"] },
  { name: "Garlic (Lahsun)", price: 200, originalPrice: 242, category: "Vegetables", color: "#FFFAFA", emoji: "🧄", description: "Desi aromatic garlic. Immunity booster.", rating: 4.6, tags: ["garlic", "immunity"] },
  { name: "Ginger (Adrak)", price: 120, originalPrice: 159, category: "Vegetables", color: "#D2B48C", emoji: "🫚", description: "Fresh ginger root. Anti-inflammatory.", rating: 4.7, tags: ["ginger", "immunity"] },
  { name: "Peas (Matar)", price: 80, originalPrice: 108, category: "Vegetables", color: "#32CD32", emoji: "🫛", description: "Sweet green peas pods.", rating: 4.7, tags: ["peas", "protein"] },
  { name: "Brinjal (Bharta)", price: 60, originalPrice: 72, category: "Vegetables", color: "#4B0082", emoji: "🍆", description: "Large purple brinjal for Bharta.", rating: 4.5, tags: ["brinjal"] },
  { name: "Bhindi (Okra)", price: 60, originalPrice: 78, category: "Vegetables", color: "#32CD32", emoji: "🟢", description: "Small tender Bhindi.", rating: 4.3, tags: ["okra"] },
  { name: "Lemon (Nimbu)", price: 10, originalPrice: 13, category: "Vegetables", color: "#FFF700", emoji: "🍋", description: "Juicy yellow lemons. (Per Piece)", rating: 4.7, tags: ["lemon", "vitamin-c"] },
];

module.exports = products;
