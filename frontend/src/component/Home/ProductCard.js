import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '@material-ui/lab';

const ProductCard = ({ Product }) => {
  const options = {
    value: Product.ratings,
    readOnly: true,
    precision: 0.5,
    size: 'small',
  };

  // Determine badge label
  const isNew     = Product.createdAt && (Date.now() - new Date(Product.createdAt)) < 1000 * 60 * 60 * 24 * 14;
  const isSale    = Product.originalPrice && Product.originalPrice > Product.price;
  const discount  = isSale
    ? Math.round(((Product.originalPrice - Product.price) / Product.originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/product/${Product._id}`}
      className="product-card group flex flex-col bg-white text-gray-900"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {/* ── Image wrapper ── */}
      <div className="card-img-wrap relative bg-gray-50">
        <img
          src={Product.images[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={Product.name}
        />

        {/* Badge */}
        {(isSale || isNew) && (
          <span
            className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold uppercase tracking-widest rounded-full"
            style={{
              background: isSale ? '#ef4444' : '#6366f1',
              color: '#fff',
              letterSpacing: '0.12em',
            }}
          >
            {isSale ? `-${discount}%` : 'New'}
          </span>
        )}

        {/* Quick-add overlay */}
        <div
          className="quick-add absolute bottom-0 left-0 right-0 p-4"
          style={{ background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(4px)' }}
        >
          <span
            className="block w-full text-center text-white text-xs font-semibold uppercase tracking-widest py-2 rounded-full border border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-200 cursor-pointer"
          >
            Quick View
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-4 gap-1.5">
        {/* Category tag */}
        {Product.category && (
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            {Product.category}
          </span>
        )}

        {/* Name */}
        <p
          className="font-semibold text-gray-900 leading-snug line-clamp-2"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem' }}
        >
          {Product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Rating {...options} />
          <span className="text-xs text-gray-400">({Product.numOfReviews})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span
            className="font-bold text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem' }}
          >
            ${Product.price?.toLocaleString()}
          </span>
          {isSale && (
            <span className="text-sm text-gray-400 line-through">
              ${Product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
