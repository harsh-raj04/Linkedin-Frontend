import React, { useState } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'

const Singin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post('http://localhost:4000/api/signin', 
                { email, password }
            );
            console.log("Signin Response:", res.data);
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Navigate to home page
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.message || "Sign in failed. Please try again.");
            setLoading(false);
            console.error("Error during signin:", error);
        }
    }

    return (
        <div className='min-h-screen bg-white flex flex-col'>
            {/* LinkedIn Navigation Header */}
            <nav className='px-6 py-3 md:px-16'>
                <div className='flex items-center'>
                    <span className='text-[#0A66C2] font-bold text-3xl tracking-tight'>Linked</span>
                    <span className='text-[#0A66C2] font-bold text-3xl tracking-tight bg-[#0A66C2] text-white px-1 ml-0.5 rounded'>in</span>
                </div>
            </nav>

            {/* Main Content */}
            <div className='flex-1 flex items-center justify-center px-4 py-8 md:py-16'>
                <div className='w-full max-w-md'>
                    {/* Title Section */}
                    <div className='mb-8 text-center md:text-left'>
                        <h1 className='text-3xl md:text-4xl text-gray-800 font-normal mb-2'>
                            Sign in
                        </h1>
                        <p className='text-base text-gray-600'>
                            Stay updated on your professional world
                        </p>
                    </div>

                    {/* Sign In Form */}
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                        <form onSubmit={handleSignin} className='flex flex-col gap-5'>
                            {/* Error Message */}
                            {error && (
                                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm'>
                                    {error}
                                </div>
                            )}

                            {/* Email Input */}
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='email' className='text-sm text-gray-700 font-medium'>
                                    Email
                                </label>
                                <input 
                                    id='email'
                                    className='text-base border border-gray-400 px-3 py-3 outline-none rounded hover:border-gray-600 focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors' 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Email address'
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='password' className='text-sm text-gray-700 font-medium'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input 
                                        id='password'
                                        className='w-full text-base border border-gray-400 px-3 py-3 outline-none rounded hover:border-gray-600 focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors' 
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Password'
                                        required
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-[#0A66C2] font-semibold text-sm hover:underline'
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className='-mt-2'>
                                <a href='#' className='text-[#0A66C2] font-semibold text-sm hover:underline'>
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button 
                                className='bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-full py-3 px-4 cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-2' 
                                type='submit'
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>

                            {/* Divider */}
                            <div className='flex items-center gap-3 my-1'>
                                <div className='flex-1 h-px bg-gray-300'></div>
                                <span className='text-sm text-gray-600'>or</span>
                                <div className='flex-1 h-px bg-gray-300'></div>
                            </div>

                            {/* Google Sign In Button (Placeholder) */}
                            <button 
                                type='button'
                                className='border border-gray-400 hover:border-gray-600 hover:bg-gray-50 bg-white text-gray-700 font-semibold rounded-full py-2.5 px-4 cursor-pointer transition-all flex items-center justify-center gap-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5 h-5'>
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Sign in with Google
                            </button>

                            {/* Apple Sign In Button (Placeholder) */}
                            <button 
                                type='button'
                                className='border border-gray-400 hover:border-gray-600 hover:bg-gray-50 bg-white text-gray-700 font-semibold rounded-full py-2.5 px-4 cursor-pointer transition-all flex items-center justify-center gap-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5 h-5' fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                Sign in with Apple
                            </button>
                        </form>
                    </div>

                    {/* New to LinkedIn Section */}
                    <div className='text-center mt-6'>
                        <p className='text-sm text-gray-600 mb-3'>
                            New to LinkedIn?{' '}
                            <NavLink to='/signup' className='text-[#0A66C2] font-semibold hover:underline'>
                                Join now
                            </NavLink>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='px-6 py-4 text-center'>
                <div className='flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-600'>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>About</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>Accessibility</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>User Agreement</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>Privacy Policy</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>Cookie Policy</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>Copyright Policy</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>Brand Policy</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>Guest Controls</a>
                    <a href='#' className='hover:text-[#0A66C2] hover:underline'>Community Guidelines</a>
                </div>
                <div className='mt-3 text-xs text-gray-600'>
                    <span className='font-semibold'>LinkedIn</span> Corporation © 2026
                </div>
            </footer>
        </div>
    )
}

export default Singin