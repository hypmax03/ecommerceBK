import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/productSchema.js";

dotenv.config();

export const fashionProducts = [
  // --- DRESS & ATELIER COLLECTION 2026 ---
  {
    name: "Sweetheart Puff-Sleeve Floral Midi Dress — Cream & Cornflower",
    price: 3899,
    category: "Summer Dresses",
    gender: "Women",
    stock: 15,
    material: "Natural Cotton-Linen Weave",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967785/elora_collections/dress_1.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967785/elora_collections/dress_1.jpg"
    ],
    description: "An ethereal prairie midi dress crafted with a structured sweetheart neckline, gathered puff sleeves, and subtle micro-floral sprig embroidery. Features a fluid A-line drape and concealed side zip."
  },
  {
    name: "Scalloped Eyelet Broderie Linen Maxi Dress — Pure Ivory",
    price: 4499,
    category: "Summer Dresses",
    gender: "Women",
    stock: 12,
    material: "100% French Flax Linen with Broderie Anglaise",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967786/elora_collections/dress_2.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967786/elora_collections/dress_2.jpg"
    ],
    description: "Cut from breathable pure linen, this ivory summer maxi dress showcases a clean square neckline, short cap sleeves, and exquisite floral broderie anglaise scalloped hemwork."
  },
  {
    name: "Botanical Embroidered Tiered Maxi Dress — Noir Black",
    price: 4899,
    category: "Cocktail Dresses",
    gender: "Women",
    stock: 18,
    material: "Fine Cotton Chiffon with Silk Threadwork",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967788/elora_collections/dress_3.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967788/elora_collections/dress_3.jpg"
    ],
    description: "A striking noir silhouette adorned with contrasting ivory vine and leaf embroidery. Designed with a structured square yoke, delicate pearl buttons, and cascading tiered skirts."
  },
  {
    name: "Lantern-Sleeve Washed Denim Maxi Dress — Vintage Indigo",
    price: 5299,
    category: "Summer Dresses",
    gender: "Women",
    stock: 10,
    material: "Washed Organic Cotton Denim (7.5 oz)",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967789/elora_collections/dress_4.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967789/elora_collections/dress_4.jpg"
    ],
    description: "A vintage-inspired full-length denim dress featuring dramatic lantern sleeves, square neckline, silver snap-button placket, and drawstring waist tie for adjustable definition."
  },
  {
    name: "Victorian Corseted Ruffle Chiffon Gown — Sage & Ivory",
    price: 6899,
    category: "Evening Gowns",
    gender: "Women",
    stock: 8,
    material: "Silk Chiffon & Cotton Velvet Boned Bodice",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967791/elora_collections/dress_5.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967791/elora_collections/dress_5.jpg"
    ],
    description: "A fairytale atelier statement piece combining a structured sage green boned corset bodice with sheer bishop sleeves and a cascading tiered floral ruffle chiffon skirt."
  },
  {
    name: "Relaxed Tailored Wool Two-Piece Suit — Charcoal Slate",
    price: 9499,
    category: "Suits & Tailoring",
    gender: "Men",
    stock: 14,
    material: "Super 120s Italian Virgin Wool",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967792/elora_collections/dress_6.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967792/elora_collections/dress_6.jpg"
    ],
    description: "Contemporary relaxed sartorial tailoring featuring a single-breasted two-button blazer with notched lapels and matching drape-cut wide-leg trousers."
  },
  {
    name: "Oversized Double-Breasted Fluid Suit — Sage Olive",
    price: 9899,
    category: "Suits & Tailoring",
    gender: "Men",
    stock: 11,
    material: "Fluid Worsted Wool & Natural Viscose",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967794/elora_collections/dress_7.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967794/elora_collections/dress_7.jpg"
    ],
    description: "A modern architectural suit cut in an oversized silhouette with peaked lapels, horn buttons, and dramatic double-pleated wide-leg trousers in muted sage olive."
  },
  {
    name: "Fine-Ribbed Silk-Cotton Knit Polo with Pleated Trousers — Noir",
    price: 4599,
    category: "Knitwear",
    gender: "Men",
    stock: 20,
    material: "Mulberry Silk & Combed Mako Cotton",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967796/elora_collections/dress_8.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967796/elora_collections/dress_8.jpg"
    ],
    description: "A luxurious open-collar fine ribbed knit polo paired with high-waisted pleated wool-blend trousers for understated quiet luxury styling."
  },
  {
    name: "Garment-Dyed Relaxed Linen Shirt & Wide Chinos — Olive Green",
    price: 4199,
    category: "Linen & Shirts",
    gender: "Men",
    stock: 16,
    material: "100% French Normandy Flax Linen",
    image: "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967797/elora_collections/dress_9.jpg",
    images: [
      "https://res.cloudinary.com/pqwfws6h/image/upload/v1791967797/elora_collections/dress_9.jpg"
    ],
    description: "A washed French linen button-down shirt in rich military olive, styled with relaxed cream wide-leg linen-cotton trousers for warm-season sophistication."
  }
];

export const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("No MONGO_URI supplied for seed script");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for catalog seed");

    await Product.deleteMany({});
    console.log("Cleared existing catalog");

    const prepared = fashionProducts.map((p) => ({
      ...p,
      status: "approved",
      images: p.images || [p.image]
    }));

    const inserted = await Product.insertMany(prepared);
    console.log(`Successfully seeded ${inserted.length} dress collection items to MongoDB!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed error:", err);
  }
};

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  seedDatabase();
}
