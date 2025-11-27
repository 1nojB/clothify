import React, { useEffect, useState } from 'react';
import { fetchAllProducts, searchProductsByName } from '../api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useCart } from '../context/CartContext';

const categoriesFromProducts = (products) => {
  const set = new Set(products.map(p => (p.category || 'Uncategorized')));
  return Array.from(set);
};

export default function Home() {
  const { addToCart } = useCart();               // <-- use cart context here
  const [products, setProducts] = useState([]);
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();

    const handler = async (e) => {
      const q = (e.detail || '').trim();
      if (!q) {
        loadProducts();
        return;
      }
      setLoading(true);
      try {
        const result = await searchProductsByName(q);
        setProducts(result);
        setDisplay(result);
        setCategories(['All', ...categoriesFromProducts(result)]);
        setActiveCategory('All');
      } catch (err) {
        setError(err.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('product-search', handler);
    return () => window.removeEventListener('product-search', handler);

  }, []);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
      setDisplay(data);
      setCategories(['All', ...categoriesFromProducts(data)]);
      setActiveCategory('All');
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let list = Array.isArray(products) ? [...products] : [];
    if (activeCategory && activeCategory !== 'All') {
      list = list.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());
    }
    if (sortBy === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    setDisplay(list);
  }, [products, activeCategory, sortBy]);

  const onAddToCart = (product) => {
    addToCart(product, 1);
    window.dispatchEvent(new CustomEvent('toggle-cart'));
  };

  return (
    <section>
      <div className="container">
        
        <div className="hero" role="region" aria-label="Promotional hero">
          <div className="hero-media">
            <picture>
              <img
                src="/images/banners/hero-banner.png"
                alt="Stylish models presenting new collection"
                className="hero-img"
                loading="lazy"
              />
            </picture>

            
            <div className="banner-content" role="article" aria-label="Banner headline and CTA">
              <h1 className="banner-title">Clothify — Modern, comfortable clothing</h1>
              <p className="banner-sub">Discover the latest arrivals — clean styles, premium fabrics. Free shipping over Rs 5,000.</p>
            </div>

          </div>
        </div>

        
        <div className="controls" aria-hidden={loading}>
          <div className="filters" role="toolbar" aria-label="Category filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ color: 'var(--muted)', marginRight: 8 }}>Sort:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        
        {loading && (
          <div className="grid" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (<SkeletonCard key={i} />))}
          </div>
        )}

        {!loading && error && <p className="error">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid" role="list">
            {display.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}




