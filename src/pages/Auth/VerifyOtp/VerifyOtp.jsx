import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxios from '../../../hooks/useAxios';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const VerifyOtp = () => {
  const { register, handleSubmit, setValue } = useForm();
  const axiosSecure = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = location.state?.userInfo;
  const [loading, setLoading] = useState(false);

  // ৬টা ঘরের সংখ্যা রাখার জায়গা
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  // ৬ ঘরের সংখ্যা জোড়া লাগিয়ে form এর 'otp' ফিল্ডে রাখা
  const updateOtp = newDigits => {
    setDigits(newDigits);
    setValue('otp', newDigits.join(''));
  };

  // সংখ্যা লিখলে
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = value;
    updateOtp(newDigits);

    // পরের ঘরে কার্সর যাবে
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Backspace দিলে আগের ঘরে ফিরবে
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // পুরো OTP paste করলে
  const handlePaste = e => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!pasted) return;

    const newDigits = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => (newDigits[i] = ch));
    updateOtp(newDigits);
    inputsRef.current[Math.min(pasted.length, 5)].focus();
  };

  const onSubmit = async data => {
    if (!data.otp || data.otp.length < 6) {
      Swal.fire({ icon: 'warning', title: '৬ সংখ্যার OTP দিন' });
      return;
    }

    setLoading(true);

    try {
      const res = await axiosSecure.post('/verify-otp', data);

      if (res.data.success) {
        await axiosSecure.post('/users', userInfo);

        await Swal.fire({
          icon: 'success',
          title: 'ভেরিফিকেশন সফল হয়েছে',
          timer: 1500,
          showConfirmButton: false,
        });

        navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'OTP ভুল হয়েছে',
          text: 'আবার চেষ্টা করুন',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'ভেরিফিকেশন ব্যর্থ হয়েছে',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-[36px] p-2 bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="rounded-[28px] p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>

          <p className="text-white/80 mt-2">
            Enter the 6-digit OTP sent to your email.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            {/* form এর জন্য লুকানো otp ফিল্ড */}
            <input type="hidden" {...register('otp')} />

            {/* ৬টা আলাদা গোল ঘর */}
            <div className="flex justify-center gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onFocus={e => e.target.select()}
                  className="w-11 h-14 text-center text-2xl font-bold text-white
                  rounded-2xl bg-gradient-to-b from-white/35 to-white/10
                  border border-white/40 backdrop-blur-md
                  shadow-[0_6px_14px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]
                  outline-none transition-all duration-200
                  focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/30"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-5 py-3 rounded-2xl text-white font-semibold
bg-gradient-to-r from-purple-600 to-blue-600
hover:from-purple-700 hover:to-blue-700
shadow-[0_8px_20px_rgba(147,51,234,0.4),inset_0_1px_0_rgba(255,255,255,0.5)]
transition-all duration-300 cursor-pointer
flex items-center justify-center gap-2
active:scale-95
disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          <p className="text-white/80 text-sm mt-5">
            Didn't receive the OTP?
            <button
              type="button"
              className="ml-2 text-blue-300 hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
