import Carousel from '@/components/home/Carousel';
import Features from '@/components/home/Features';
import ProductGrid from '@/components/home/ProductGrid';
import ProductShowcase from '@/components/home/ProductShowcase';

export default function Home() {
  return (
    <main>
      <Carousel />
      <Features />
      <ProductGrid />
      <ProductShowcase />
    </main>
  );
}
