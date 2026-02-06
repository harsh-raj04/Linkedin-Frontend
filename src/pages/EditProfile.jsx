import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        location: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData({
                headline: parsedUser.headline || '',
                bio: parsedUser.bio || '',
                location: parsedUser.location || '',
                skills: parsedUser.skills || []
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await axios.put('https://linkedin-backend3.vercel.app/api/update-profile', {
                userId: user._id,
                ...formData
            });
            
            // Update localStorage with new user data
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-[#F3F2EF] flex flex-col items-center'>
            {/* Navigation */}
            <nav className='bg-white border-b border-gray-300 sticky top-0 z-50 w-full'>
                <div className='max-w-[1128px] mx-auto px-6 py-2 w-full'>
                    <div className='flex items-center justify-between'>
                        <div onClick={() => navigate('/home')} className='flex items-center cursor-pointer'>
                            <span className='text-[#0A66C2] font-bold text-2xl tracking-tight'>Linked</span>
                            <span className='text-[#0A66C2] font-bold text-2xl tracking-tight bg-[#0A66C2] text-white px-1 ml-0.5 rounded'>in</span>
                        </div>
                        <button onClick={() => navigate('/profile')} className='text-gray-600 hover:text-black text-sm'>
                            Cancel
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className='w-full max-w-[800px] px-6 py-6'>
                <div className='bg-white rounded-lg border border-gray-300 p-6'>
                    <h1 className='text-2xl font-semibold mb-6'>Edit Profile</h1>

                    {success && (
                        <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4'>
                            Profile updated successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Headline */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Headline *
                            </label>
                            <input
                                type='text'
                                name='headline'
                                value={formData.headline}
                                onChange={handleChange}
                                className='w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]'
                                placeholder='e.g. Software Engineer at Tech Company'
                                required
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                About
                            </label>
                            <textarea
                                name='bio'
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className='w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] resize-none'
                                placeholder='Tell us about yourself...'
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Location
                            </label>
                            <input
                                type='text'
                                name='location'
                                value={formData.location}
                                onChange={handleChange}
                                className='w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]'
                                placeholder='e.g. San Francisco, CA'
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Skills
                            </label>
                            <div className='flex gap-2 mb-3'>
                                <input
                                    type='text'
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                    className='flex-1 border border-gray-400 rounded px-3 py-2 outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]'
                                    placeholder='Add a skill'
                                />
                                <button
                                    type='button'
                                    onClick={handleAddSkill}
                                    className='bg-[#0A66C2] text-white px-4 py-2 rounded font-semibold hover:bg-[#004182]'>
                                    Add
                                </button>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {formData.skills.map((skill, index) => (
                                    <span key={index} className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2'>
                                        {skill}
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveSkill(skill)}
                                            className='text-gray-500 hover:text-gray-700'>
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className='flex gap-3 pt-4'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='bg-[#0A66C2] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#004182] disabled:bg-gray-300 disabled:cursor-not-allowed'>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type='button'
                                onClick={() => navigate('/profile')}
                                className='border border-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100'>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
