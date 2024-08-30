import { useEffect } from 'react';
import axios from 'axios';
import ProductItem from '../ProductItem/ProductItem';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../Spinner/Spinner';

export default function Products() {
  // Queries
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (data) => data.data.data,
  });

  async function getProducts() {
    return await axios.get('https://ecommerce.routemisr.com/api/v1/products');
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <div className="container flex flex-wrap items-center">
        <h3 className="text-3xl font-medium mb-5 w-full">Our Products</h3>
        {data ? (
          data.map((product) => (
            <ProductItem product={product} key={product._id} />
          ))
        ) : (
          <div className="w-full">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}
