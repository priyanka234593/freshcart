import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductItem from '../ProductItem/ProductItem';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('https://ecommerce.routemisr.com/api/v1/products')
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="container flex flex-wrap items-center">
        {products.map((product) => (
          <ProductItem product={product} key={product._id} />
        ))}
      </div>
    </>
  );
}
