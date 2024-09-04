import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { cartContext } from '../../context/Cart/Cart';

export function renderStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-300' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  }
  return stars;
}

export default function ProductItem({ product, isWished, handleWishlist }) {
  const { addProduct } = useContext(cartContext);

  return (
    <div className="w-full lg:md:w-1/4 md:w-1/3 sm:w-1/2 mx-auto p-3">
      <div className="relative bg-white mx-auto shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="text-right absolute top-3 left-3">
          <button
            onClick={() => handleWishlist(product._id)}
            className="p-2 rounded-full bg-green-500 bg-opacity-25 hover:bg-opacity-50"
          >
            {isWished ? (
              <i className="fas fa-heart fa-fw fa-lg text-green-600"></i>
            ) : (
              <i className="far fa-heart fa-fw fa-lg text-green-600"></i>
            )}
          </button>
        </div>

        <Link to={`product/${product._id}`}>
          <img
            className="rounded-t-lg"
            src={product.imageCover}
            alt={product.title}
          />
        </Link>
        <div className="px-5 pb-5">
          <Link to={`product/${product._id}`}>
            <h3 className="text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-xl tracking-tight dark:text-white">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-2.5 mb-5">
            <span className="flex">
              {renderStars(Math.round(product.ratingsAverage))}
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
              {product.ratingsAverage}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            <button
              href="#"
              onClick={() => addProduct(product._id)}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
