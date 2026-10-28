import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';
import Swal from 'sweetalert2';

// বারবার লেখা এড়াতে ইনপুটের স্টাইল একবারেই রাখলাম
const inputStyle = `w-full h-10 px-3 text-sm rounded-xl text-white placeholder-white/60
  bg-gradient-to-b from-white/30 to-white/10
  border border-white/40 backdrop-blur-md
  shadow-[0_4px_10px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]
  outline-none transition-all duration-200
  focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30`;

const labelStyle = 'block text-white font-semibold text-sm mb-1';
const errorStyle = 'text-red-300 text-xs mt-0.5';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    const profileImg = data.photo[0];
    setLoading(true);

    try {
      // ১. Firebase-এ একাউন্ট তৈরি
      await registerUser(data.email, data.password);

      // ২. ছবি imgbb-তে আপলোড
      const formData = new FormData();
      formData.append('image', profileImg);
      const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
      const imgRes = await axios.post(image_API_URL, formData);
      const photoURL = imgRes.data.data.url;

      // ৩. Firebase profile আপডেট
      await updateUserProfile({
        displayName: data.name,
        photoURL: photoURL,
      });

      // ৪. OTP পাঠানো
      const userInfo = {
        name: data.name,
        email: data.email,
        photo: photoURL,
        role: data.role,
      };
      console.log('OTP request শুরু হচ্ছে...');

      const otpRes = await axiosSecure.post('/send-otp', userInfo, {
        timeout: 15000,
      });

      console.log('OTP response:', otpRes.data);

      if (otpRes.data.success) {
        navigate('/verify-otp', { state: { userInfo } });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md rounded-[30px] p-1.5 bg-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="rounded-[24px] px-5 py-4">
          <h2 className="text-xl font-bold text-white text-center mb-3">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
            {/* Name + Email পাশাপাশি */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Name</label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className={inputStyle}
                  placeholder="Your name"
                />
                {errors.name && <p className={errorStyle}>Name is required</p>}
              </div>

              <div>
                <label className={labelStyle}>Email</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className={inputStyle}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className={errorStyle}>Email is required</p>
                )}
              </div>
            </div>

            {/* Photo + Account Type পাশাপাশি */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('photo', { required: true })}
                  className="w-full h-10 text-white/90 text-xs rounded-xl
                bg-gradient-to-b from-white/30 to-white/10
                border border-white/40 cursor-pointer
                file:mr-2 file:h-full file:px-3 file:border-0
                file:bg-white/25 file:text-white file:text-xs
                file:font-semibold file:cursor-pointer"
                />
                {errors.photo && (
                  <p className={errorStyle}>Photo is required</p>
                )}
              </div>

              <div>
                <label className={labelStyle}>Account Type</label>
                <select
                  {...register('role', { required: true })}
                  className={`${inputStyle} cursor-pointer`}
                >
                  <option value="" className="bg-white text-black">
                    Select
                  </option>
                  <option value="jobseeker" className="bg-white text-black">
                    Job Seeker
                  </option>
                  <option value="employer" className="bg-white text-black">
                    Employer
                  </option>
                </select>
                {errors.role && <p className={errorStyle}>Required</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelStyle}>Password</label>
              <input
                type="password"
                {...register('password', {
                  required: true,
                  minLength: 6,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                })}
                className={inputStyle}
                placeholder="Password"
              />
              {errors.password?.type === 'required' && (
                <p className={errorStyle}>Password is required</p>
              )}
              {errors.password?.type === 'minLength' && (
                <p className={errorStyle}>Minimum 6 characters</p>
              )}
              {errors.password?.type === 'pattern' && (
                <p className={errorStyle}>
                  Need uppercase, lowercase, number and special character
                </p>
              )}
            </div>

            {/* Register button */}
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
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>

            <p className="text-white/90 text-center text-sm">
              Already have an account?{' '}
              <Link
                className="text-blue-300 font-semibold underline"
                to="/login"
              >
                Login
              </Link>
            </p>
          </form>

          <div className="mt-2">
            <SocialLogin></SocialLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
