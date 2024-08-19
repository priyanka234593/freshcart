import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/Auth/Auth';

export default function Register() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserToken } = useContext(authContext);

  const buttonProps = {
    type: 'submit',
    className:
      'text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 select-none',
  };

  const navigate = useNavigate();

  function handleRegister(data) {
    setIsLoading(true);
    axios
      .post('https://ecommerce.routemisr.com/api/v1/auth/signup', data)
      .then((res) => {
        setErr(null);
        setUserToken(data.data.token);
        localStorage.setItem('authToken', data.data.token);
        setIsLoading(false);
        if (res.data.message === 'success') {
          navigate('/login');
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErr(err.response.data.message);
      });
  }

  // function validateInputs(data) {
  //   const errors = {};

  //   const nameRegex = /^[A-Z][a-z]{2,}$/;
  //   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //   const phoneRegex = /^01[0-2|5]{1}[0-9]{8}$/;

  //   if (data.name === "") {
  //     errors.name = "Name is required";
  //   } else if (!nameRegex.test(data.name)) {
  //     errors.name = "Name must start with a capital letter";
  //   }

  //   if (data.email === "") {
  //     errors.email = "Email is required";
  //   } else if (!emailRegex.test(data.email)) {
  //     errors.email = "Email is not valid";
  //   }

  //   if (data.password === "") {
  //     errors.password = "Password is required";
  //   }

  //   if (data.rePassword === "") {
  //     errors.rePassword = "Confirm password is required";
  //   } else if (data.password !== data.rePassword) {
  //     errors.rePassword = "Passwords do not match";
  //   }

  //   if (data.phone === "") {
  //     errors.phone = "Phone number is required";
  //   } else if (!phoneRegex.test(data.phone)) {
  //     errors.phone = "Phone number is not valid";
  //   }

  //   console.log(formik.errors);
  //   console.log(formik.touched);
  //   return errors;
  // }

  const validate = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters'),

    email: Yup.string()
      .required('Email is required')
      .email('Email is not valid'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Za-z]/, 'Password must contain at least one letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(
        /[!@#$%^&*(),.?":{}|<>+\-_]/,
        'Password must contain at least one special character'
      )
      .required('Password is required'),

    rePassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),

    phone: Yup.string()
      .required('Phone number is required')
      .matches(
        /^01[0-2|5]{1}[0-9]{8}$/,
        'Phone number is not valid (123-456-7890)'
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    onSubmit: handleRegister,
    // validate: validateInputs,
    validationSchema: validate,
  });

  return (
    <>
      <form
        method="post"
        className="max-w-md mx-auto"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl text-gray-500 mb-5 mt-8 font-bold">
          Register Now
        </h1>
        {err && <div className="bg-red-300 py-1 mb-4 font-light">{err}</div>}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="name"
            id="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            // required
          />
          <label
            htmlFor="name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
          {formik.errors.name && formik.touched.name && (
            <span className="text-red-600 font-light text-sm">
              {formik.errors.name}
            </span>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            // required
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
          {formik.errors.email && formik.touched.email && (
            <span className="text-red-600 font-light text-sm">
              {formik.errors.email}
            </span>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="password"
            id="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            // required
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          {formik.errors.password && formik.touched.password && (
            <span className="text-red-600 font-light text-sm">
              {formik.errors.password}
            </span>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="rePassword"
            id="rePassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.rePassword}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            // required
          />
          <label
            htmlFor="rePassword"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm password
          </label>
          {formik.errors.rePassword && formik.touched.rePassword && (
            <span className="text-red-600 font-light text-sm">
              {formik.errors.rePassword}
            </span>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="tel"
            // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            name="phone"
            id="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            // required
          />
          <label
            htmlFor="phone"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone number (123-456-7890)
          </label>
          {formik.errors.phone && formik.touched.phone && (
            <span className="text-red-600 font-light text-sm">
              {formik.errors.phone}
            </span>
          )}
        </div>
        {isLoading ? (
          <button {...buttonProps} disabled>
            Loading...
          </button>
        ) : (
          <button {...buttonProps}>Register</button>
        )}
      </form>
    </>
  );
}
