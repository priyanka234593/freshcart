import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/Auth/Auth';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';

export default function Register() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserToken } = useContext(authContext);

  const buttonProps = {
    type: 'submit',
    className:
      'sm:w-36 w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 select-none',
  };

  const navigate = useNavigate();

  function handleRegister(data) {
    setIsLoading(true);
    axios
      .post('https://ecommerce.routemisr.com/api/v1/auth/signup', data)
      .then((res) => {
        setErr(null);
        toast.success('Account created successfully');
        setUserToken(res.data.token);
        localStorage.setItem('authToken', res.data.token);
        setIsLoading(false);
        if (res.data.message === 'success') {
          navigate('/login');
        }
      })
      .catch((err) => {
        toast.error('Please try again');
        setIsLoading(false);
        setErr(err.response?.data?.message || 'Something went wrong');
      });
  }

  // ✅ Updated validation schema (E.164 international format)
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
        /^\+?[1-9]\d{1,14}$/,
        'Phone number is not valid. Use format like +12015550123'
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
    validationSchema: validate,
  });

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <div className="container">
        <form
          method="post"
          className="max-w-md mx-auto md:mt-12 mt-0"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl text-gray-500 mb-5 font-bold">
            Register Now
          </h1>
          {err && <div className="bg-red-300 py-1 mb-4 font-light">{err}</div>}
          
          {/* Name */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
            >
              Name
            </label>
            {formik.errors.name && formik.touched.name && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
            >
              Email address
            </label>
            {formik.errors.email && formik.touched.email && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
            >
              Password
            </label>
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="rePassword"
              id="rePassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rePassword}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="rePassword"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
            >
              Confirm password
            </label>
            {formik.errors.rePassword && formik.touched.rePassword && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.rePassword}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              name="phone"
              id="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="phone"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
            >
              Phone number (+12015550123)
            </label>
            {formik.errors.phone && formik.touched.phone && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.phone}
              </span>
            )}
          </div>

          {isLoading ? (
            <button {...buttonProps} disabled>
              <i className="fa-solid fa-spinner animate-spin"></i>
            </button>
          ) : (
            <button {...buttonProps}>Register</button>
          )}
        </form>
      </div>
    </>
  );
}
