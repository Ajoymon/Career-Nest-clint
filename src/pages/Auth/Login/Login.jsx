import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import Swal from 'sweetalert2';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = data => {
    signInUser(data.email, data.password)
      .then(result => {
        console.log(result.user);
        navigate('/');
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/invalid-credential') {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Email or Password is incorrect!',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Something went wrong. Please try again.',
          });
        }
      });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full mx-auto max-w-sm shrink-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <h2 className="text-2xl font-bold text-center text-black mb-2">
            Welcome Back
          </h2>
          <fieldset className="fieldset">
            {/* Email */}
            <label className="label text-black font-bold text-[18px]">
              Email
            </label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="input bg-white/10 backdrop-blur-md border border-white/30 text-gray-900 placeholder-gray-900"
              placeholder="Email"
            />
            {errors.email?.type === 'required' && (
              <p role="alert" className="text-red-600">
                Email is required
              </p>
            )}

            {/* Password */}
            <label className="label text-black font-bold text-[18px]">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: true, minLength: 6 })}
              className="input bg-white/10 backdrop-blur-md border border-white/30 text-gray-900 placeholder-gray-900"
              placeholder="Password"
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-600">Password is required</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-600">
                Password must be 6 characters or longer
              </p>
            )}

            <div>
              <a className="link link-hover text-white">Forgot password?</a>
            </div>

            {/* iOS style button */}
            <button
              className="px-5 py-2.5 rounded-lg text-white font-semibold
             bg-gradient-to-r from-purple-600 to-blue-600
             hover:from-purple-700 hover:to-blue-700
             shadow-lg shadow-purple-500/20
             transition-all duration-300"
            >
              Login
            </button>

            <p className="text-white">
              Don't have any account?{' '}
              <Link
                className="text-white font-semibold underline"
                to="/register"
              >
                Register
              </Link>
            </p>
          </fieldset>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Login;
