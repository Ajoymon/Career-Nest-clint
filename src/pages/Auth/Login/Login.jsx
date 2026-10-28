import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import Swal from 'sweetalert2';
import useAxios from '../../../hooks/useAxios';

const inputStyle = `w-full h-10 px-3 text-sm rounded-xl text-white placeholder-white/60
  bg-gradient-to-b from-white/30 to-white/10
  border border-white/40 backdrop-blur-md
  shadow-[0_4px_10px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]
  outline-none transition-all duration-200
  focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30`;

const labelStyle = 'block text-white font-semibold text-sm mb-1';
const errorStyle = 'text-red-300 text-xs mt-0.5';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxios();

  const onSubmit = async data => {
    setLoading(true);

    try {
      // ১. Email আর Password ঠিক আছে কিনা দেখা
      const result = await signInUser(data.email, data.password);
      const user = result.user;

      // ২. ইমেইলে OTP পাঠানো
      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };
      const otpRes = await axiosSecure.post('/send-otp', userInfo);

      // ৩. OTP পেজে পাঠানো (from: 'login' দিয়ে বোঝানো হচ্ছে এটা লগইন)
      if (otpRes.data.success) {
        navigate('/verify-otp', { state: { userInfo, from: 'login' } });
      }
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm rounded-[30px] p-1.5 bg-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="rounded-[24px] px-5 py-5">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <div>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                {...register('email', { required: true })}
                className={inputStyle}
                placeholder="Email"
              />
              {errors.email?.type === 'required' && (
                <p role="alert" className={errorStyle}>
                  Email is required
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={labelStyle}>Password</label>
              <input
                type="password"
                {...register('password', { required: true, minLength: 6 })}
                className={inputStyle}
                placeholder="Password"
              />
              {errors.password?.type === 'required' && (
                <p className={errorStyle}>Password is required</p>
              )}
              {errors.password?.type === 'minLength' && (
                <p className={errorStyle}>
                  Password must be 6 characters or longer
                </p>
              )}
            </div>

            <div>
              <a className="link link-hover text-white/90 text-sm cursor-pointer">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-2.5 rounded-xl text-white font-semibold
              bg-gradient-to-r from-purple-600 to-blue-600
              hover:from-purple-700 hover:to-blue-700
              shadow-[0_6px_16px_rgba(147,51,234,0.4),inset_0_1px_0_rgba(255,255,255,0.5)]
              transition-all duration-300 cursor-pointer
              flex items-center justify-center gap-2
              active:scale-95
              disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <p className="text-white/90 text-center text-sm">
              Don't have any account?{' '}
              <Link
                className="text-blue-300 font-semibold underline"
                to="/register"
              >
                Register
              </Link>
            </p>
          </form>

          <div className="mt-3">
            <SocialLogin></SocialLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
