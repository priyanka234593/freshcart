import { useContext, useEffect, useState } from 'react';
import { cartContext } from '../../context/Cart/Cart';

export default function Cart() {
  const { getProducts, deleteProduct, updateProductQuantity } =
    useContext(cartContext);

  const [products, setProducts] = useState([]);

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    main();
  };

  const handleUpdateProductQuantity = async (id, quantity) => {
    await updateProductQuantity(id, quantity);
    main();
  };

  async function main() {
    const products = await getProducts();
    console.log(`Products Updated:`, products.length);
    setProducts(products);
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="container mt-10">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                Qty
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
            {products?.map((product) => (
              <tr
                key={product._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="p-4">
                  <img
                    src={product.product.imageCover}
                    className="w-16 md:w-32 max-w-full max-h-full rounded-lg"
                    alt="Apple Watch"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {product.product.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        handleUpdateProductQuantity(
                          product.product._id,
                          product.count - 1
                        );
                      }}
                      className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                    >
                      <span className="sr-only">Quantity button</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 2"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 1h16"
                        />
                      </svg>
                    </button>
                    <div>
                      <input
                        type="number"
                        id="first_product"
                        disabled
                        className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={product.count}
                        required
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleUpdateProductQuantity(
                          product.product._id,
                          product.count + 1
                        );
                      }}
                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                    >
                      <span className="sr-only">Quantity button</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  ${product.price}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteProduct(product.product._id)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 

[
  {
      "count": 8,
      "_id": "66ce88ff150535ca39370ed5",
      "product": {
          "subcategory": [
              {
                  "_id": "6407f1bcb575d3b90bf95797",
                  "name": "Women's Clothing",
                  "slug": "women's-clothing",
                  "category": "6439d58a0049ad0b52b9003f"
              }
          ],
          "_id": "6428ebc6dc1175abc65ca0b9",
          "title": "Woman Shawl",
          "quantity": 225,
          "imageCover": "https://ecommerce.routemisr.com/Route-Academy-products/1680403397402-cover.jpeg",
          "category": {
              "_id": "6439d58a0049ad0b52b9003f",
              "name": "Women's Fashion",
              "slug": "women's-fashion",
              "image": "https://ecommerce.routemisr.com/Route-Academy-categories/1681511818071.jpeg"
          },
          "brand": {
              "_id": "64089bbe24b25627a253158b",
              "name": "DeFacto",
              "slug": "defacto",
              "image": "https://ecommerce.routemisr.com/Route-Academy-brands/1678285758109.png"
          },
          "ratingsAverage": 4.8,
          "id": "6428ebc6dc1175abc65ca0b9"
      },
      "price": 170
  },
  {
      "count": 1,
      "_id": "66ce88ff150535ca39370ed7",
      "product": {
          "subcategory": [
              {
                  "_id": "6407f1bcb575d3b90bf95797",
                  "name": "Women's Clothing",
                  "slug": "women's-clothing",
                  "category": "6439d58a0049ad0b52b9003f"
              }
          ],
          "_id": "6428ebc6dc1175abc65ca0b9",
          "title": "Woman Shawl",
          "quantity": 225,
          "imageCover": "https://ecommerce.routemisr.com/Route-Academy-products/1680403397402-cover.jpeg",
          "category": {
              "_id": "6439d58a0049ad0b52b9003f",
              "name": "Women's Fashion",
              "slug": "women's-fashion",
              "image": "https://ecommerce.routemisr.com/Route-Academy-categories/1681511818071.jpeg"
          },
          "brand": {
              "_id": "64089bbe24b25627a253158b",
              "name": "DeFacto",
              "slug": "defacto",
              "image": "https://ecommerce.routemisr.com/Route-Academy-brands/1678285758109.png"
          },
          "ratingsAverage": 4.8,
          "id": "6428ebc6dc1175abc65ca0b9"
      },
      "price": 170
  }
]

*/
