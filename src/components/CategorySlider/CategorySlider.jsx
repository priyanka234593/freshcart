import axios from 'axios';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

export default function CategorySlider() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get('https://ecommerce.routemisr.com/api/v1/categories')
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container my-10">
      <h3 className="text-3xl font-medium mb-5">Popular Categories</h3>
      <Slider {...settings}>
        {categories.map((category) => (
          <div
            key={category._id}
            className="rounded-lg px-4 dark:bg-gray-800 dark:border-gray-700"
          >
            <a href="#">
              <img
                className="rounded-lg object-cover object-top w-full h-80"
                src={category.image}
                alt={category.name}
              />
            </a>
            <div className="text-center">
              <a href="#">
                <h3 className="text-gray-900 mt-2 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-xl tracking-tight dark:text-white">
                  {category.name}
                </h3>
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

/* 

{
    "_id": "6439d61c0049ad0b52b90051",
    "name": "Music",
    "slug": "music",
    "image": "https://ecommerce.routemisr.com/Route-Academy-categories/1681511964020.jpeg",
    "createdAt": "2023-04-14T22:39:24.365Z",
    "updatedAt": "2023-04-14T22:39:24.365Z"
}

*/
