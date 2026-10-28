import React from 'react';
import { Link } from 'react-router';
import logo from '../../assets/Gemini_Generated_Image_2wfx92wfx92wfx92-removebg-preview.png';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img src={logo} alt="Site Logo" className="h-12 w-auto object-contain" />
    </Link>
  );
};

export default Logo;
