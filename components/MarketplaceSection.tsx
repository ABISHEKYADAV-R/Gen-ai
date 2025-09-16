import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const products = [
  {
    name: "Traditional Ikat Textile",
    price: "$145",
   
  },
  {
    name: "Hand-Carved Sculpture",
    price: "$289",
    
  },
  {
    name: "Silver Bead Necklace",
    price: "$67",
    
  },
  {
    name: "Woven Storage Basket",
    price: "$34",
    
  },
];

export default function MarketplaceSection() {
  return (
    <section id="marketplace" className="py-20 px-10 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-12">Global Marketplace</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {products.map((item, idx) => (
          <motion.div key={idx} whileHover={{ scale: 1.05 }}>
            <Card className="shadow-md">
              <img
                
                alt={item.name}
                className="rounded-t-xl h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="mt-2 font-semibold">{item.price}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button className="mt-10 bg-purple-600 text-white px-6 py-3 rounded-xl text-lg">
        Explore All Products
      </Button>
    </section>
  );
}
