import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('posts');
    const [user, setUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(true);
    const [userPosts, setUserPosts] = useState([]);

    // Load logged-in user from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Load profile data based on URL parameter or logged-in user
    useEffect(() => {
        const loadProfile = async () => {
            const userEmail = searchParams.get('user');
            
            if (userEmail && user) {
                // Viewing someone else's profile
                setIsOwnProfile(userEmail === user.email);
                try {
                    const res = await axios.get(`https://linkedin-backend3.vercel.app/api/user-by-email/${userEmail}`);
                    setViewingUser(res.data.user);
                    // Load posts for this user
                    fetchUserPosts(userEmail);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                    setViewingUser(user);
                    setIsOwnProfile(true);
                    fetchUserPosts(user.email);
                }
            } else if (user) {
                // Viewing own profile - reload from database
                try {
                    const res = await axios.get(`https://linkedin-backend3.vercel.app/api/user-by-email/${user.email}`);
                    const updatedUser = res.data.user;
                    setViewingUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    fetchUserPosts(user.email);
                } catch (error) {
                    console.error('Error loading profile:', error);
                    setViewingUser(user);
                    fetchUserPosts(user.email);
                }
                setIsOwnProfile(true);
            }
        };

        if (user) {
            loadProfile();
        }
    }, [searchParams, user]);

    const fetchUserPosts = async (userEmail) => {
        try {
            const response = await axios.get(`https://linkedin-backend3.vercel.app/api/posts/user/${userEmail}`);
            setUserPosts(response.data);
        } catch (error) {
            console.error("Error fetching user posts:", error);
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

    const profileUser = viewingUser || user;

    // User profile data
    const userProfile = {
        name: profileUser?.username || "Your Name",
        headline: profileUser?.headline || "Professional | Tech Enthusiast",
        location: profileUser?.location || "San Francisco Bay Area",
        connections: profileUser?.connections || 500,
        avatar: profileUser?.username?.substring(0, 2).toUpperCase() || "YU",
        coverColor: "from-blue-400 to-blue-600"
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
                            <div className='flex items-center cursor-pointer' onClick={() => navigate('/home')}>
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
                            <div onClick={() => navigate('/home')} className='flex flex-col items-center gap-1 text-gray-600 hover:text-black cursor-pointer'>
                                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z'/>
                                </svg>
                                <span className='text-xs hidden md:block'>Home</span>
                            </div>

                            <div className='flex flex-col items-center gap-1 text-gray-600 hover:text-black cursor-pointer'>
                                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z'/>
                                </svg>
                                <span className='text-xs hidden md:block'>My Network</span>
                            </div>

                            <div className='flex items-center gap-2 border-l pl-4'>
                                <div onClick={() => navigate('/profile')} className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-gray-400'>
                                    {userProfile.avatar}
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
                {/* Profile Card */}
                <div className='bg-white rounded-lg border border-gray-300 overflow-hidden mb-4'>
                    {/* Cover Image */}
                    <div className={`h-32 bg-gradient-to-r ${userProfile.coverColor}`}></div>
                    
                    {/* Profile Info */}
                    <div className='px-6 pb-6'>
                        <div className='flex flex-col sm:flex-row gap-4 -mt-16 mb-4'>
                            <div className='w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-semibold border-4 border-white'>
                                {userProfile.avatar}
                            </div>
                            <div className='flex-1 mt-16 sm:mt-20'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h1 className='text-2xl font-semibold text-gray-800'>{userProfile.name}</h1>
                                        <p className='text-base text-gray-600 mt-1'>{userProfile.headline}</p>
                                        <p className='text-sm text-gray-500 mt-2'>{userProfile.location} • <span className='text-[#0A66C2] font-semibold cursor-pointer hover:underline'>{userProfile.connections}+ connections</span></p>
                                    </div>
                                    {isOwnProfile && (
                                        <button 
                                            onClick={() => navigate('/edit-profile')}
                                            className='bg-[#0A66C2] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#004182] hidden sm:block'>
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-2 mt-4'>
                            <button className='bg-[#0A66C2] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#004182] flex-1 sm:flex-initial'>
                                Open to
                            </button>
                            <button className='border border-[#0A66C2] text-[#0A66C2] px-4 py-2 rounded-full font-semibold hover:bg-blue-50 flex-1 sm:flex-initial'>
                                Add section
                            </button>
                            <button className='border border-gray-400 text-gray-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 flex-1 sm:flex-initial'>
                                More
                            </button>
                        </div>
                    </div>

                    {/* Profile Highlights */}
                    <div className='border-t border-gray-300 px-6 py-4'>
                        <h2 className='font-semibold text-lg mb-3'>About</h2>
                        <p className='text-sm text-gray-700'>
                            {profileUser?.bio || 'Passionate professional with expertise in building innovative solutions. Always eager to learn and contribute to meaningful projects. Let\'s connect and collaborate!'}
                        </p>
                    </div>

                    {/* Experience Section */}
                    <div className='border-t border-gray-300 px-6 py-4'>
                        <h2 className='font-semibold text-lg mb-3'>Experience</h2>
                        {profileUser?.experience && profileUser.experience.length > 0 ? (
                            profileUser.experience.map((exp, index) => (
                                <div key={index} className='flex gap-3 mb-4'>
                                    <div className='w-12 h-12 bg-gray-200 rounded flex-shrink-0'></div>
                                    <div>
                                        <h3 className='font-semibold text-sm'>{exp.title}</h3>
                                        <p className='text-sm text-gray-600'>{exp.company}</p>
                                        <p className='text-xs text-gray-500 mt-1'>
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </p>
                                        <p className='text-xs text-gray-500'>{exp.location}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex gap-3'>
                                <div className='w-12 h-12 bg-gray-200 rounded flex-shrink-0'></div>
                                <div>
                                    <h3 className='font-semibold text-sm'>Senior Developer</h3>
                                    <p className='text-sm text-gray-600'>Tech Company Inc.</p>
                                    <p className='text-xs text-gray-500 mt-1'>Jan 2024 - Present • 1 mo</p>
                                    <p className='text-xs text-gray-500'>San Francisco, CA</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Education Section */}
                    <div className='border-t border-gray-300 px-6 py-4'>
                        <h2 className='font-semibold text-lg mb-3'>Education</h2>
                        {profileUser?.education && profileUser.education.length > 0 ? (
                            profileUser.education.map((edu, index) => (
                                <div key={index} className='flex gap-3 mb-4'>
                                    <div className='w-12 h-12 bg-gray-200 rounded flex-shrink-0'></div>
                                    <div>
                                        <h3 className='font-semibold text-sm'>{edu.school}</h3>
                                        <p className='text-sm text-gray-600'>{edu.degree}, {edu.field}</p>
                                        <p className='text-xs text-gray-500 mt-1'>{edu.startYear} - {edu.endYear}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex gap-3'>
                                <div className='w-12 h-12 bg-gray-200 rounded flex-shrink-0'></div>
                                <div>
                                    <h3 className='font-semibold text-sm'>University Name</h3>
                                    <p className='text-sm text-gray-600'>Bachelor\'s Degree, Computer Science</p>
                                    <p className='text-xs text-gray-500 mt-1'>2018 - 2022</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div className='border-t border-gray-300 px-6 py-4'>
                        <h2 className='font-semibold text-lg mb-3'>Skills</h2>
                        <div className='flex flex-wrap gap-2'>
                            {(profileUser?.skills && profileUser.skills.length > 0 ? profileUser.skills : ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Git', 'REST APIs']).map((skill, index) => (
                                <span key={index} className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium'>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                <div className='bg-white rounded-lg border border-gray-300 overflow-hidden'>
                    <div className='px-6 py-4 border-b border-gray-300'>
                        <h2 className='font-semibold text-lg'>Activity</h2>
                        <p className='text-sm text-gray-600'>{userProfile.connections}+ followers</p>
                    </div>

                    {/* Tabs */}
                    <div className='flex border-b border-gray-300'>
                        <button 
                            onClick={() => setActiveTab('posts')}
                            className={`px-6 py-3 font-semibold text-sm ${activeTab === 'posts' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-gray-800'}`}>
                            Posts
                        </button>
                        <button 
                            onClick={() => setActiveTab('comments')}
                            className={`px-6 py-3 font-semibold text-sm ${activeTab === 'comments' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-gray-800'}`}>
                            Comments
                        </button>
                    </div>

                    {/* Posts */}
                    <div className='divide-y divide-gray-300'>
                        {userPosts.length > 0 ? (
                            userPosts.map(post => (
                                <div key={post._id} className='px-6 py-4 hover:bg-gray-50'>
                                    <p className='text-sm text-gray-800 mb-2 whitespace-pre-line'>{post.content}</p>
                                    <div className='flex items-center gap-4 text-xs text-gray-600'>
                                        <span>{formatTimeAgo(post.createdAt)}</span>
                                        <span>•</span>
                                        <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
                                        <span>•</span>
                                        <span>{post.comments} comments</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='px-6 py-8 text-center text-gray-500'>
                                <p>No posts yet</p>
                            </div>
                        )}
                    </div>

                    {userPosts.length > 0 && (
                        <div className='px-6 py-4 border-t border-gray-300 text-center'>
                            <button className='text-[#0A66C2] font-semibold text-sm hover:underline'>
                                Show all activity →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
