import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ProductGrid from '@/components/home/ProductGrid';
import ProductShowcase from '@/components/home/ProductShowcase';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <ProductGrid />
      <ProductShowcase />
    </main>
  );
}
