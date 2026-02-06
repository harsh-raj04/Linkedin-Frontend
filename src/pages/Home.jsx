import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Load user from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Fetch posts from database
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://linkedin-backend3.vercel.app/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!postText.trim() || !user) return;

        try {
            const postData = {
                userId: user._id,
                userEmail: user.email,
                author: user.username,
                title: user.headline || "Professional",
                avatar: user.username.substring(0, 2).toUpperCase(),
                content: postText,
            };

            const response = await axios.post('https://linkedin-backend3.vercel.app/api/posts', postData);
            
            // Add new post to the beginning of the posts array
            setPosts([response.data.post, ...posts]);
            setPostText("");
            setShowPostModal(false);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        }
    };

    const handleLike = async (postId) => {
        if (!user) return;

        try {
            const response = await axios.put(`https://linkedin-backend3.vercel.app/api/posts/${postId}/like`, {
                userId: user._id
            });
            
            // Update the post in the UI
            setPosts(posts.map(post => 
                post._id === postId ? response.data.post : post
            ));
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!user) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`https://linkedin-backend3.vercel.app/api/posts/${postId}`, {
                data: { userId: user._id }
            });
            
            // Remove post from UI
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. You can only delete your own posts.");
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const posted = new Date(timestamp);
        const diffInSeconds = Math.floor((now - posted) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        return `${Math.floor(diffInSeconds / 604800)}w`;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/signin');
    };

    return (
        <div className='min-h-screen bg-[#F3F2EF] flex flex-col items-center'>
            {/* LinkedIn Navigation Header */}
            <nav className='bg-white border-b border-gray-300 sticky top-0 z-50 w-full'>
                <div className='max-w-[1128px] mx-auto px-6 py-2 w-full'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center'>
                                <span className='text-[#0A66C2] font-bold text-2xl tracking-tight'>Linked</span>
                                <span className='text-[#0A66C2] font-bold text-2xl tracking-tight bg-[#0A66C2] text-white px-1 ml-0.5 rounded'>in</span>
                            </div>
                            <div className='ml-2 hidden md:block'>
                                <input 
                                    type="text" 
                                    placeholder='Search' 
                                    className='bg-[#EEF3F8] px-4 py-1.5 rounded text-sm outline-none w-64 focus:bg-white focus:ring-1 focus:ring-gray-300'
                                />
                            </div>
                        </div>

                        <div className='flex items-center gap-6'>
                            <NavLink to='/home' className='flex flex-col items-center gap-1 text-gray-600 hover:text-black cursor-pointer'>
                                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z'/>
                                </svg>
                                <span className='text-xs hidden md:block'>Home</span>
                            </NavLink>

                            <div className='flex flex-col items-center gap-1 text-gray-600 hover:text-black cursor-pointer'>
                                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z'/>
                                </svg>
                                <span className='text-xs hidden md:block'>My Network</span>
                            </div>

                            <div className='flex flex-col items-center gap-1 text-gray-600 hover:text-black cursor-pointer'>
                                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z'/>
                                </svg>
                                <span className='text-xs hidden md:block'>Jobs</span>
                            </div>

                            <div className='flex flex-col items-center gap-1 text-gray-600 hover:text-black cursor-pointer'>
                                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z'/>
                                </svg>
                                <span className='text-xs hidden md:block'>Messaging</span>
                            </div>

                            <div className='flex flex-col items-center gap-1 text-gray-600 hover:text-black cursor-pointer'>
                                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z'/>
                                </svg>
                                <span className='text-xs hidden md:block'>Notifications</span>
                            </div>

                            <div className='flex items-center gap-2 border-l pl-4'>
                                <div 
                                    onClick={() => navigate('/profile')}
                                    className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-gray-400'>
                                    {user?.username?.substring(0, 2).toUpperCase() || 'YU'}
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className='text-xs text-gray-600 hover:text-black hidden lg:block'>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className='w-full max-w-[1128px] px-6 py-6'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    {/* Left Sidebar */}
                    <div className='lg:col-span-3 hidden lg:block'>
                        <div className='sticky top-20 space-y-2'>
                        <div 
                            onClick={() => navigate('/profile')}
                            className='bg-white rounded-lg border border-gray-300 overflow-hidden cursor-pointer hover:shadow-md transition-shadow'>
                            <div className='h-16 bg-gradient-to-r from-blue-400 to-blue-600'></div>
                            <div className='px-4 pb-4 text-center -mt-8'>
                                <div className='w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-semibold border-4 border-white'>
                                    {user?.username?.substring(0, 2).toUpperCase() || 'YU'}
                                </div>
                                <h3 className='font-semibold text-gray-800 hover:underline'>Welcome back!</h3>
                                <p className='text-xs text-gray-600 mt-1'>{user?.username || 'Professional'}</p>
                            </div>
                            <div className='border-t border-gray-300 px-4 py-3 hover:bg-gray-50'>
                                <div className='flex justify-between items-center text-xs mb-1'>
                                    <span className='text-gray-600'>Profile viewers</span>
                                    <span className='text-[#0A66C2] font-semibold'>127</span>
                                </div>
                                <div className='flex justify-between items-center text-xs'>
                                    <span className='text-gray-600'>Post impressions</span>
                                    <span className='text-[#0A66C2] font-semibold'>1,842</span>
                                </div>
                            </div>
                            <div className='border-t border-gray-300 px-4 py-3 hover:bg-gray-50 cursor-pointer'>
                                <div className='flex items-center gap-2 text-xs'>
                                    <svg className='w-4 h-4 text-gray-600' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z'/>
                                    </svg>
                                    <span className='text-gray-700 font-semibold'>My items</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-lg border border-gray-300 mt-2 overflow-hidden'>
                            <div className='px-4 py-3 hover:bg-gray-50 cursor-pointer'>
                                <h3 className='text-xs font-semibold text-[#0A66C2] mb-2'>Recent</h3>
                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-gray-700'>👥 JavaScript Developers</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-gray-700'>👥 React Community</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-gray-700'>👥 Tech Careers</span>
                                    </div>
                                </div>
                            </div>
                            <div className='border-t border-gray-300 px-4 py-3 hover:bg-gray-50 cursor-pointer'>
                                <h3 className='text-xs font-semibold text-[#0A66C2] mb-2'>Groups</h3>
                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-gray-700'>👥 Web Developers Network</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-gray-700'>👥 Startup Founders</span>
                                    </div>
                                </div>
                            </div>
                            <div className='border-t border-gray-300 px-4 py-3 text-center hover:bg-gray-50 cursor-pointer'>
                                <span className='text-xs text-gray-600 font-semibold'>Discover more</span>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div className='lg:col-span-6'>
                        {/* Create Post */}
                        <div className='bg-white rounded-lg border border-gray-300 p-4 mb-4'>
                            <div className='flex gap-2'>
                                <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold'>
                                    {user?.username?.substring(0, 2).toUpperCase() || 'YU'}
                                </div>
                                <button 
                                    onClick={() => setShowPostModal(true)}
                                    className='flex-1 border border-gray-400 rounded-full px-4 py-3 text-left text-gray-600 hover:bg-gray-100 cursor-pointer'>
                                    Start a post
                                </button>
                            </div>
                            <div className='flex justify-around mt-3 pt-3 border-t border-gray-300'>
                                <button className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded text-gray-600'>
                                    <svg className='w-6 h-6 text-blue-500' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm-2 8h-4v4h-2v-4H7v-2h4V6h2v4h4z'/>
                                    </svg>
                                    <span className='text-sm font-semibold hidden sm:block'>Photo</span>
                                </button>
                                <button className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded text-gray-600'>
                                    <svg className='w-6 h-6 text-green-500' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm-9 12V8l6 4z'/>
                                    </svg>
                                    <span className='text-sm font-semibold hidden sm:block'>Video</span>
                                </button>
                                <button className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded text-gray-600'>
                                    <svg className='w-6 h-6 text-orange-500' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M3 3v15a3 3 0 003 3h9v-6h-2a1 1 0 110-2h2v-2h-2a1 1 0 110-2h2V7h-2a1 1 0 110-2h2V3zm9 15h3v-3h-3zm0-5h3V7h-3zm6-10v2h2v13h-9v3h9a3 3 0 003-3V3z'/>
                                    </svg>
                                    <span className='text-sm font-semibold hidden sm:block'>Article</span>
                                </button>
                            </div>
                        </div>

                        {/* Post Modal */}
                        {showPostModal && (
                            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                                <div className='bg-white rounded-lg w-full max-w-xl'>
                                    <div className='flex justify-between items-center p-4 border-b'>
                                        <h2 className='text-xl font-semibold'>Create a post</h2>
                                        <button 
                                            onClick={() => setShowPostModal(false)}
                                            className='text-gray-500 hover:text-gray-700'>
                                            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M13.42 12l4.79-4.8a1 1 0 00-1.41-1.41L12 10.58 7.21 5.79a1 1 0 00-1.42 1.41L10.58 12l-4.79 4.79a1 1 0 000 1.42 1 1 0 001.41 0L12 13.41l4.8 4.79a1 1 0 001.41 0 1 1 0 000-1.41z'/>
                                            </svg>
                                        </button>
                                    </div>
                                    <form onSubmit={handleCreatePost}>
                                        <div className='p-4'>
                                            <div className='flex items-center gap-2 mb-4'>
                                                <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold'>
                                                    {user?.username?.substring(0, 2).toUpperCase() || 'YU'}
                                                </div>
                                                <div>
                                                    <h3 className='font-semibold'>{user?.username || 'You'}</h3>
                                                    <p className='text-xs text-gray-600'>Post to anyone</p>
                                                </div>
                                            </div>
                                            <textarea 
                                                value={postText}
                                                onChange={(e) => setPostText(e.target.value)}
                                                className='w-full min-h-32 outline-none text-lg resize-none'
                                                placeholder="What do you want to talk about?"
                                                autoFocus
                                            />
                                        </div>
                                        <div className='border-t p-4 flex justify-end'>
                                            <button 
                                                type='submit'
                                                disabled={!postText.trim()}
                                                className='bg-[#0A66C2] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#004182] disabled:bg-gray-300 disabled:cursor-not-allowed'>
                                                Post
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Posts Feed */}
                        <div className='space-y-2'>
                            {posts.map(post => (
                                <div key={post._id} className='bg-white rounded-lg border border-gray-300 overflow-hidden'>
                                    <div className='p-4'>
                                        <div className='flex gap-2 mb-3'>
                                            <div 
                                                onClick={() => navigate(`/profile?user=${post.userEmail}`)}
                                                className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold flex-shrink-0 cursor-pointer hover:opacity-80'>
                                                {post.avatar}
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex justify-between items-start'>
                                                    <div>
                                                        <h3 
                                                            onClick={() => navigate(`/profile?user=${post.userEmail}`)}
                                                            className='font-semibold text-sm hover:text-[#0A66C2] hover:underline cursor-pointer'>
                                                            {post.author}
                                                        </h3>
                                                        <p className='text-xs text-gray-600'>{post.title}</p>
                                                        <p className='text-xs text-gray-500'>{formatTimeAgo(post.createdAt)} • 🌐</p>
                                                    </div>
                                                    {user && user._id === post.userId && (
                                                        <button 
                                                            onClick={() => handleDeletePost(post._id)}
                                                            className='text-gray-600 hover:bg-gray-100 p-1 rounded'>
                                                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                                                <path d='M3 6v18h18V6H3zm5 14c0 .55-.45 1-1 1s-1-.45-1-1V10c0-.55.45-1 1-1s1 .45 1 1v10zm5 0c0 .55-.45 1-1 1s-1-.45-1-1V10c0-.55.45-1 1-1s1 .45 1 1v10zm5 0c0 .55-.45 1-1 1s-1-.45-1-1V10c0-.55.45-1 1-1s1 .45 1 1v10zm2-18v2H4V2h4.5l1-1h5l1 1H20z'/>
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className='text-sm text-gray-800 whitespace-pre-line'>{post.content}</p>
                                    </div>
                                    <div className='px-4 py-2 flex items-center justify-between text-xs text-gray-600 border-t border-gray-200'>
                                        <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
                                        <div className='flex gap-2'>
                                            <span>{post.comments} comments</span>
                                            <span>{post.reposts} reposts</span>
                                        </div>
                                    </div>
                                    <div className='flex justify-around border-t border-gray-300 py-2'>
                                        <button 
                                            onClick={() => handleLike(post._id)}
                                            className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded flex-1 justify-center ${
                                                user && post.likedBy?.includes(user._id) ? 'text-[#0A66C2] font-semibold' : 'text-gray-600'
                                            }`}>
                                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z'/>
                                            </svg>
                                            <span className='text-sm font-semibold'>Like</span>
                                        </button>
                                        <button className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded text-gray-600 flex-1 justify-center'>
                                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28l5-3.12A4.79 4.79 0 0021 11z'/>
                                            </svg>
                                            <span className='text-sm font-semibold'>Comment</span>
                                        </button>
                                        <button className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded text-gray-600 flex-1 justify-center'>
                                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M23 12l-4.61 7H16l4-6H8a3.92 3.92 0 00-4 3.84V17a4 4 0 00.19 1.24L5.12 21H3l-.73-2.22A6.4 6.4 0 012 16.94 6 6 0 018 11h12l-4-6h2.39z'/>
                                            </svg>
                                            <span className='text-sm font-semibold'>Repost</span>
                                        </button>
                                        <button className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded text-gray-600 flex-1 justify-center'>
                                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z'/>
                                            </svg>
                                            <span className='text-sm font-semibold'>Send</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className='lg:col-span-3 hidden lg:block'>
                        <div className='sticky top-20 space-y-2'>
                        <div className='bg-white rounded-lg border border-gray-300 p-3'>
                            <h3 className='font-semibold text-sm mb-3'>LinkedIn News</h3>
                            <ul className='space-y-3'>
                                <li>
                                    <h4 className='text-sm font-semibold hover:text-[#0A66C2] cursor-pointer'>Top companies hiring now</h4>
                                    <p className='text-xs text-gray-600'>2d ago • 12,458 readers</p>
                                </li>
                                <li>
                                    <h4 className='text-sm font-semibold hover:text-[#0A66C2] cursor-pointer'>Tech layoffs continue</h4>
                                    <p className='text-xs text-gray-600'>5h ago • 8,923 readers</p>
                                </li>
                                <li>
                                    <h4 className='text-sm font-semibold hover:text-[#0A66C2] cursor-pointer'>Remote work trends 2026</h4>
                                    <p className='text-xs text-gray-600'>1d ago • 15,234 readers</p>
                                </li>
                                <li>
                                    <h4 className='text-sm font-semibold hover:text-[#0A66C2] cursor-pointer'>AI skills in demand</h4>
                                    <p className='text-xs text-gray-600'>3d ago • 22,156 readers</p>
                                </li>
                                <li>
                                    <h4 className='text-sm font-semibold hover:text-[#0A66C2] cursor-pointer'>Startups raising funds</h4>
                                    <p className='text-xs text-gray-600'>4d ago • 9,876 readers</p>
                                </li>
                                <li>
                                    <h4 className='text-sm font-semibold hover:text-[#0A66C2] cursor-pointer'>New coding bootcamps</h4>
                                    <p className='text-xs text-gray-600'>5d ago • 7,234 readers</p>
                                </li>
                            </ul>
                            <button className='text-xs text-gray-600 hover:text-[#0A66C2] mt-3 font-semibold'>Show more →</button>
                        </div>
                        
                        <div className='bg-white rounded-lg border border-gray-300 p-3 mt-2'>
                            <div className='flex items-center justify-between mb-3'>
                                <h3 className='font-semibold text-sm'>Today's most viewed courses</h3>
                            </div>
                            <ul className='space-y-3'>
                                <li className='flex gap-2'>
                                    <span className='text-gray-600 text-xs'>1</span>
                                    <div>
                                        <h4 className='text-xs font-semibold hover:text-[#0A66C2] cursor-pointer'>React - The Complete Guide</h4>
                                        <p className='text-xs text-gray-600'>by Maximilian Schwarzmüller</p>
                                    </div>
                                </li>
                                <li className='flex gap-2'>
                                    <span className='text-gray-600 text-xs'>2</span>
                                    <div>
                                        <h4 className='text-xs font-semibold hover:text-[#0A66C2] cursor-pointer'>JavaScript Algorithms</h4>
                                        <p className='text-xs text-gray-600'>by Colt Steele</p>
                                    </div>
                                </li>
                                <li className='flex gap-2'>
                                    <span className='text-gray-600 text-xs'>3</span>
                                    <div>
                                        <h4 className='text-xs font-semibold hover:text-[#0A66C2] cursor-pointer'>Node.js Advanced</h4>
                                        <p className='text-xs text-gray-600'>by Andrew Mead</p>
                                    </div>
                                </li>
                            </ul>
                            <button className='text-xs text-gray-600 hover:text-[#0A66C2] mt-3 font-semibold'>Show more →</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
