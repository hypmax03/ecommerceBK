import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/productSchema.js";

dotenv.config();

export const fashionProducts = [
  // --- WOMEN'S ATELIER COLLECTION ---
  {
    name: "Bias-Cut Silk Evening Gown — Obsidian Black",
    price: 6499,
    category: "Evening Gowns",
    gender: "Women",
    stock: 14,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
    description: "A floor-length evening gown cut on the bias from pure heavyweight mulberry silk. Features an architectural cowl neckline, open back, and fluid drape suited for formal occasions."
  },
  {
    name: "Botanical Print Linen Midi Dress — Sage",
    price: 3899,
    category: "Summer Dresses",
    gender: "Women",
    stock: 22,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80",
    description: "A handcrafted cotton-linen midi dress detailed with gentle puff sleeves and a smocked bodice. Features an understated botanical print suitable for warm-weather gatherings."
  },
  {
    name: "Draped Velvet Cocktail Mini Dress — Midnight Black",
    price: 5299,
    category: "Cocktail Dresses",
    gender: "Women",
    stock: 18,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
    description: "A plush silk-blend velvet mini dress with an asymmetrical neckline drape and sculpted waistline. Finished with a clean, fitted silhouette for evening soirees."
  },
  {
    name: "Draped Satin Evening Gown — Crimson Red",
    price: 7199,
    category: "Evening Gowns",
    gender: "Women",
    stock: 9,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    description: "A striking crimson evening gown tailored with a structured bodice, fluid side slit, and crossed back straps. Pairs effortlessly with minimal fine jewelry."
  },
  {
    name: "Tiered Muslin Cotton Maxi Dress — Ivory",
    price: 4799,
    category: "Summer Dresses",
    gender: "Women",
    stock: 15,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
    description: "An airy tiered maxi dress crafted from organic muslin cotton with delicate tone-on-tone embroidery. Designed with a flowing silhouette for relaxed warm-weather dressing."
  },
  {
    name: "Floral Print Chiffon Sundress — Pastel Blue",
    price: 3499,
    category: "Summer Dresses",
    gender: "Women",
    stock: 25,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    description: "A lightweight chiffon sundress featuring delicate tiers and an airy drape. An effortless choice for coastal getaways and relaxed outdoor luncheons."
  },
  {
    name: "One-Shoulder Crepe Evening Gown — Emerald Green",
    price: 6899,
    category: "Evening Gowns",
    gender: "Women",
    stock: 11,
    image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=900&q=80",
    description: "A sculpted one-shoulder evening gown tailored from heavyweight crepe satin. Designed with a gentle train and clean lines for black-tie gatherings."
  },
  {
    name: "Pleated Halter Midi Dress — Lilac",
    price: 4199,
    category: "Cocktail Dresses",
    gender: "Women",
    stock: 17,
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
    description: "A pleated halter-neck dress with fine accordion folds and a cinched waist sash. Moves fluidly from day celebrations into cocktail evenings."
  },
  {
    name: "A-Line Collared Midi Dress — Polka Dot",
    price: 3999,
    category: "Summer Dresses",
    gender: "Women",
    stock: 12,
    image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=900&q=80",
    description: "A classic A-line midi dress tailored with a notched collar, tonal fabric buttons, and a timeless polka print. Wear with leather loafers or strappy sandals."
  },
  {
    name: "Tailored Double-Breasted Blazer Dress — Charcoal",
    price: 5999,
    category: "Blazer Dresses",
    gender: "Women",
    stock: 20,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    description: "A double-breasted dress tailored from virgin wool with satin peak lapels and structured shoulders. Combines modern suiting precision with evening sophistication."
  },
  {
    name: "Tiered Organza Party Dress — Blush Pink",
    price: 4899,
    category: "Cocktail Dresses",
    gender: "Women",
    stock: 16,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
    description: "A tiered organza cocktail dress designed with subtle shimmer and adjustable delicate straps. Features an architectural flared skirt for festive occasions."
  },
  {
    name: "Architectural Silk Column Dress — Ivory White",
    price: 8499,
    category: "Evening Gowns",
    gender: "Women",
    stock: 7,
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=900&q=80",
    description: "A statuesque column gown crafted from heavyweight Italian silk crepe. Features a clean, sculpted silhouette designed for ceremonial galas and formal events."
  },

  // --- MEN'S SARTORIAL COLLECTION ---
  {
    name: "Double-Breasted Wool Suit — Charcoal Mélange",
    price: 9999,
    category: "Suits & Tailoring",
    gender: "Men",
    stock: 12,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
    description: "A bespoke two-piece suit crafted from Super 130s Italian wool. Features unstructured Neapolitan shoulders, hand-pick stitching, and softly tapered trousers."
  },
  {
    name: "Classic Fit Pure Cashmere Overcoat — Camel Tan",
    price: 8999,
    category: "Outerwear & Coats",
    gender: "Men",
    stock: 8,
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80",
    description: "A timeless single-breasted overcoat tailored from heavy cashmere and virgin wool blend. Finished with horn buttons, deep welt pockets, and a cupro lining."
  },
  {
    name: "Bespoke Grosgrain Shawl Tuxedo — Midnight Obsidian",
    price: 11499,
    category: "Suits & Tailoring",
    gender: "Men",
    stock: 6,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    description: "An evening tuxedo crafted from Super 150s wool with pure silk grosgrain shawl lapels. Complete with jetted pockets and matching satin-stripe trousers."
  },
  {
    name: "Relaxed Fit Linen Band-Collar Shirt — Chalk White",
    price: 3299,
    category: "Linen & Shirts",
    gender: "Men",
    stock: 24,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    description: "A breathable French flax linen shirt featuring a modern band collar and mother-of-pearl buttons. Pairs seamlessly with tailored trousers or relaxed chinos."
  },
  {
    name: "Tailored Velvet Dinner Jacket — Burgundy",
    price: 7499,
    category: "Blazers & Jackets",
    gender: "Men",
    stock: 10,
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
    description: "A plush cotton velvet dinner jacket styled with contrast black satin peak lapels and gauntlet cuffs. Designed for black-tie gatherings and festive evenings."
  },
  {
    name: "Full-Grain Nappa Leather Blouson — Matte Black",
    price: 8299,
    category: "Blazers & Jackets",
    gender: "Men",
    stock: 15,
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    description: "A minimalist blouson crafted from butter-soft Tuscan lambskin leather. Features antique silver hardware, a neat stand collar, and silk-lined interior pockets."
  },
  {
    name: "Extrafine Merino Waffle Knit Crewneck — Oatmeal Heather",
    price: 3699,
    category: "Knitwear",
    gender: "Men",
    stock: 20,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80",
    description: "An extrafine Australian merino wool sweater designed with a tactile micro-waffle structure. Offers lightweight warmth and breathable comfort year-round."
  },
  {
    name: "Tailored Hopsack Wool Blazer — Charcoal",
    price: 6899,
    category: "Blazers & Jackets",
    gender: "Men",
    stock: 14,
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=900&q=80",
    description: "A half-canvassed hopsack wool blazer with patch pockets, natural shoulders, and dual rear vents. Designed for versatile smart-casual refinement."
  },
  {
    name: "Classic Fit Two-Ply Cotton Dress Shirt — Crisp White",
    price: 2899,
    category: "Linen & Shirts",
    gender: "Men",
    stock: 30,
    image: "https://images.unsplash.com/photo-1620012253295-c15c429fccf8?auto=format&fit=crop&w=900&q=80",
    description: "A formal dress shirt woven from 100% two-ply Egyptian cotton. Features a structured spread collar and convertible French cuffs."
  },
  {
    name: "Minimalist Belted Storm Trench Coat — Khaki Sand",
    price: 9499,
    category: "Outerwear & Coats",
    gender: "Men",
    stock: 9,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    description: "A storm-flap trench coat crafted from water-repellent gabardine twill. Features a cinched waist belt and a clean, minimalist silhouette for transitional weather."
  },
  {
    name: "Tonal Jacquard Silk Evening Shirt — Black",
    price: 4299,
    category: "Linen & Shirts",
    gender: "Men",
    stock: 16,
    image: "https://images.unsplash.com/photo-1618886614638-80e3c153d31a?auto=format&fit=crop&w=900&q=80",
    description: "A pure silk dress shirt woven with a tonal damask jacquard pattern and hidden front placket. Styled for evening cocktail events and black-tie layering."
  },
  {
    name: "Double-Breasted Herringbone Wool Overcoat — Charcoal Grey",
    price: 9199,
    category: "Outerwear & Coats",
    gender: "Men",
    stock: 11,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    description: "A structured double-breasted coat in a rich charcoal herringbone wool weave. Finished with high peak lapels and deep welt pockets for winter protection."
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Remove existing products and seed both Men's & Women's collections
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    const created = await Product.insertMany(fashionProducts);
    console.log(`Successfully seeded ${created.length} luxury fashion items (Women & Men)!`);

    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding fashion products:", error);
    process.exit(1);
  }
};

if (process.argv[1].includes("seed.js")) {
  seedProducts();
}
