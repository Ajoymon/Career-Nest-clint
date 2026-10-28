import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import useAxios from '../../../hooks/useAxios';
import Swal from 'sweetalert2';

const SocialLogin = () => {
  const { signInGoogle } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [loading, setLoading] = useState(false);

  const handelGoogleSigenIn = async () => {
    setLoading(true);

    try {
      const result = await signInGoogle();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: 'jobseeker', // Google login-এ role বাছার সুযোগ নেই, তাই ডিফল্ট
      };

      await axiosSecure.post('/users', userInfo);

      navigate('/');
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'লগইন ব্যর্থ হয়েছে',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      {/* Or divider */}
      <div className="flex items-center gap-3 mb-3">
        <span className="flex-1 h-px bg-white/30"></span>
        <p className="text-white/80 text-sm">Or</p>
        <span className="flex-1 h-px bg-white/30"></span>
      </div>

      {/* Google button */}
      <button
        type="button"
        onClick={handelGoogleSigenIn}
        disabled={loading}
        className="w-full px-5 py-2.5 rounded-xl text-white font-semibold
        bg-gradient-to-b from-white/30 to-white/10
        border border-white/40
        shadow-[0_4px_10px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]
        hover:from-white/40 hover:to-white/20
        transition-all duration-300 cursor-pointer
        flex items-center justify-center gap-2
        active:scale-95
        disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white">
            <svg
              aria-label="Google logo"
              width="14"
              height="14"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
          </span>
        )}
        {loading ? 'Please wait...' : 'Continue with Google'}
      </button>
    </div>
  );
};

export default SocialLogin;
