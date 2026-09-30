export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  minOrderQuantity: string;
  features: string[];
}

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Premium Paper Cups (8oz)",
    description: "High-quality, leak-resistant paper cups suitable for hot and cold beverages. Perfect for cafes, offices, and events.",
    category: "Cups",
    minOrderQuantity: "10,000 units",
    features: ["Leak-resistant coating", "Eco-friendly materials", "Custom printing available", "Recyclable"],
  },
  {
    id: "p2",
    name: "Eco-Friendly Paper Plates (9 inch)",
    description: "Sturdy and biodegradable paper plates designed to hold heavy meals without bending. Ideal for catering and large events.",
    category: "Plates",
    minOrderQuantity: "5,000 units",
    features: ["Microwave safe", "Compostable", "Grease-resistant", "Durable construction"],
  },
  {
    id: "p3",
    name: "Kraft Paper Bowls (16oz)",
    description: "Natural kraft paper bowls with optional secure lids. Great for soups, salads, and hot takeaway foods.",
    category: "Bowls",
    minOrderQuantity: "5,000 units",
    features: ["Heat resistant", "Natural rustic look", "Food-grade material", "Matching lids available"],
  },
  {
    id: "p4",
    name: "2-Ply Napkins (White)",
    description: "Soft, absorbent, and elegant 2-ply white napkins for dining and commercial use.",
    category: "Napkins",
    minOrderQuantity: "50,000 units",
    features: ["Soft texture", "High absorbency", "Classic white", "Custom logo embossing available"],
  },
  {
    id: "p5",
    name: "Corrugated Coffee Cup Sleeves",
    description: "Heat-insulating corrugated sleeves designed to fit 8oz to 16oz paper cups. Provides an excellent grip and protects hands from heat.",
    category: "Accessories",
    minOrderQuantity: "20,000 units",
    features: ["Excellent heat insulation", "Universal fit", "Printable surface", "100% Recyclable"],
  },
  {
    id: "p6",
    name: "Biodegradable Cutlery Set",
    description: "Complete set of wooden/paper-based fork, knife, and spoon. A sustainable alternative to plastic cutlery.",
    category: "Accessories",
    minOrderQuantity: "10,000 sets",
    features: ["100% Biodegradable", "Sturdy design", "Splinter-free", "Individually wrapped options"],
  }
];
