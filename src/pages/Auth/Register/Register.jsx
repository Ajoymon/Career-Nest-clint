import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';
import Swal from 'sweetalert2';

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

      // ৪. MongoDB-তে ইউজার সেভ
      const userInfo = {
        name: data.name,
        email: data.email,
        photo: photoURL,
        role: data.role,
      };
      const otpRes = await axiosSecure.post('/send-otp', userInfo);

      console.log('OTP response:', otpRes.data);

      if (otpRes.data.success) {
        navigate('/verify-otp', { state: { userInfo } });
      }
    } catch (error) {
      // যেকোনো ধাপে সমস্যা হলে একটাই error alert
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full mx-auto max-w-sm shrink-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label text-black font-bold text-[18px]">
              Name
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="input bg-white/10 backdrop-blur-md border border-white/30 text-gray-900 placeholder-gray-900"
              placeholder="Your name"
            />
            {errors.name?.type === 'required' && (
              <p role="alert" className="text-red-600">
                First name is required
              </p>
            )}

            {/* Photo */}
            <label className="label text-black font-bold text-[18px]">
              Photo
            </label>
            <input
              type="file"
              {...register('photo', { required: true })}
              className="file-input bg-white/10 backdrop-blur-md border border-white/30 text-gray-900"
            />
            {errors.photo?.type === 'required' && (
              <p role="alert" className="text-red-600">
                First photo is required
              </p>
            )}

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
                First email is required
              </p>
            )}

            {/* Password */}
            <label className="label text-black font-bold text-[18px]">
              Password
            </label>
            <input
              type="password"
              {...register('password', {
                required: true,
                minLength: 6,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
              })}
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
            {errors.password?.type === 'pattern' && (
              <p className="text-red-600">
                Password must have at least one uppercase, one lowercase, one
                number and one special character
              </p>
            )}
            {/* Role (Job Seeker / Employer) */}
            <label className="label text-black font-bold text-[18px]">
              {' '}
              Account Type{' '}
            </label>
            <select
              {...register('role', { required: true })}
              className="select select-bordered bg-white/10 backdrop-blur-md border border-white/30 text-gray-900"
            >
              <option value="" className="bg-white text-black">
                Account Type
              </option>
              <option value="jobseeker" className="bg-white text-black">
                Job Seeker
              </option>
              <option value="employer" className="bg-white text-black">
                Employer
              </option>
            </select>
            {errors.role && <p className="text-red-600">Role is required</p>}

            <div>
              <a className="link link-hover text-white">Forgot password?</a>
            </div>

            {/* iOS style button */}
            <button
              className="px-5 py-2.5 rounded-lg text-white font-semibold
             bg-gradient-to-r from-purple-600 to-blue-600
             hover:from-purple-700 hover:to-blue-700
             shadow-lg shadow-purple-500/20
             transition-all duration-300 cursor-pointer"
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

            <p className="text-white">
              Don't have any account?{' '}
              <Link className="text-white font-semibold underline" to="/login">
                Login
              </Link>
            </p>
          </fieldset>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;
