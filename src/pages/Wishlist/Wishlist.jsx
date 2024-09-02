import { useContext, useEffect, useState } from 'react';
import { wishlistContext } from '../../context/Wishlist/Wishlist';
import Spinner from '../../components/Spinner/Spinner';

export default function Wishlist() {
  const { getWishlist, deleteWishlistItem } = useContext(wishlistContext);
  const [wishlistProducts, setWishlistProducts] = useState(null);

  async function fetchGetWishlist() {
    const products = await getWishlist();
    setWishlistProducts(products);
  }

  async function fetchDeleteProduct(id) {
    await deleteWishlistItem(id);
    fetchGetWishlist();
  }

  useEffect(() => {
    fetchGetWishlist();
  }, []);

  return (
    <>
      <div className="container mt-10 flex flex-wrap">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-16 py-3">
                  <span className="sr-only">Image</span>
                </th>
                <th scope="col" className="px-6 py-3">
                  Product
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {wishlistProducts ? (
                wishlistProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-3xl h-20 font-bold"
                    >
                      <i className="fas fa-box-open me-3"></i>
                      Wow, such empty!
                    </td>
                  </tr>
                ) : (
                  wishlistProducts?.map((product) => (
                    <tr
                      key={product._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="p-4">
                        <img
                          src={product.imageCover}
                          className="w-16 md:w-32 max-w-full max-h-full rounded-lg"
                          alt="Apple Watch"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => fetchDeleteProduct(product._id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="4" className="py-4">
                    <div>
                      <Spinner />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
