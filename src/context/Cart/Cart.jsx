import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const cartContext = createContext(null);

export default function CartContextProvider(props) {
  const headers = {
    token: localStorage.getItem('authToken'),
  };

  function getProducts() {
    const config = {
      method: 'get',
      url: 'https://ecommerce.routemisr.com/api/v1/cart',
      headers: headers,
      // data: '',
    };

    return axios(config)
      .then((response) => response.data.data.products)
      .catch((error) => error);
  }

  function addProduct(id) {
    const data = { productId: id };

    const config = {
      method: 'post',
      url: 'https://ecommerce.routemisr.com/api/v1/cart',
      headers: headers,
      data: data,
    };

    return axios(config)
      .then((response) => response.data)
      .catch((error) => error);
  }

  // TODO See what is the problem with this function
  function deleteProduct(id) {
    let config = {
      method: 'delete',
      url: `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      headers: headers,
      // data: '',
    };

    axios
      .request(config)
      .then((response) => response.data)
      .catch((error) => error);
  }

  function updateProductQuantity(id, quantity) {
    let data = { count: quantity };

    let config = {
      method: 'put',
      url: `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      headers: headers,
      data: data,
    };

    axios(config)
      .then((response) => response.data)
      .catch((error) => error);
  }

  return (
    <cartContext.Provider
      value={{ getProducts, addProduct, deleteProduct, updateProductQuantity }}
    >
      {props.children}
    </cartContext.Provider>
  );
}
