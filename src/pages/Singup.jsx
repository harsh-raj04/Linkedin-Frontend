import React, {useState} from 'react'
import axios from 'axios'
import { NavLink , useNavigate} from 'react-router-dom'

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSingup = async (e)=> {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axios.post('https://linkedin-backend3.vercel.app/api/signup',
             { username, email, password })
            console.log("Signup Response:", res.data);
            setSuccess("Account created successfully! Redirecting to sign in...");
            setTimeout(() => {
                navigate('/signin');
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed. Please try again.");
            setLoading(false);
            console.error("Error during signup:", error);
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
                    <h1 className='text-3xl md:text-4xl text-gray-800 font-normal mb-3'>
                        Make the most of your professional life
                    </h1>
                </div>

                {/* Signup Form */}
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <form onSubmit={handleSingup} className='flex flex-col gap-4'>
                        {/* Error Message */}
                        {error && (
                            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm'>
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm'>
                                {success}
                            </div>
                        )}

                        {/* Username Input */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='username' className='text-sm text-gray-700 font-medium'>
                                Username
                            </label>
                            <input 
                                id='username'
                                className='text-base border border-gray-400 px-3 py-2 outline-none rounded hover:border-gray-600 focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors' 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='Enter your username'
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='email' className='text-sm text-gray-700 font-medium'>
                                Email
                            </label>
                            <input 
                                id='email'
                                className='text-base border border-gray-400 px-3 py-2 outline-none rounded hover:border-gray-600 focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors' 
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
                                Password (6+ characters)
                            </label>
                            <input 
                                id='password'
                                className='text-base border border-gray-400 px-3 py-2 outline-none rounded hover:border-gray-600 focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors' 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Terms and Conditions */}
                        <p className='text-xs text-gray-600 text-center mt-2'>
                            By clicking Agree & Join or Continue, you agree to the LinkedIn{' '}
                            <a href='#' className='text-[#0A66C2] font-medium hover:underline'>User Agreement</a>,{' '}
                            <a href='#' className='text-[#0A66C2] font-medium hover:underline'>Privacy Policy</a>, and{' '}
                            <a href='#' className='text-[#0A66C2] font-medium hover:underline'>Cookie Policy</a>.
                        </p>

                        {/* Submit Button */}
                        <button 
                            className='bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-full py-3 px-4 cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-2' 
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Agree & Join'}
                        </button>

                        {/* Divider */}
                        <div className='flex items-center gap-3 my-2'>
                            <div className='flex-1 h-px bg-gray-300'></div>
                            <span className='text-sm text-gray-600'>or</span>
                            <div className='flex-1 h-px bg-gray-300'></div>
                        </div>

                        {/* Google Sign In Button (Placeholder) */}
                        <button 
                            type='button'
                            className='border border-gray-400 hover:border-gray-600 bg-white text-gray-700 font-semibold rounded-full py-2.5 px-4 cursor-pointer transition-colors flex items-center justify-center gap-2'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5 h-5'>
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                </div>

                {/* Sign In Link */}
                <div className='text-center mt-4'>
                    <p className='text-sm'>
                        Already on LinkedIn?{' '}
                        <NavLink to='/signin' className='text-[#0A66C2] font-semibold hover:underline'>
                            Sign in
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

export default Signup