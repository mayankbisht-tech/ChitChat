import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext || !authContext.authUser) {
    navigate('/login');
    return null;
  }

  const { authUser, updateProfile } = authContext;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState<string>(authUser.fullName || '');
  const [bio, setBio] = useState<string>(authUser.bio || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate('/');
      };
      reader.readAsDataURL(selectedImage);
    } else {
      await updateProfile({ fullName: name, bio });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl glass-panel rounded-3xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-10 flex flex-col items-center justify-center relative border-r border-white/5">
            <button
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : authUser.profilePic || assets.avatar_icon
                  }
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white">{name || 'Your Name'}</h2>
                <p className="text-gray-400 mt-2">{authUser.email}</p>
              </div>

              {bio && (
                <div className="glass-input rounded-2xl p-4 max-w-xs">
                  <p className="text-sm text-gray-300">{bio}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
              <p className="text-gray-400">Update your profile information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Profile Picture
                </label>
                <label
                  htmlFor="avatar"
                  className="flex items-center gap-4 p-4 glass-input rounded-xl cursor-pointer hover:bg-white/5 transition"
                >
                  <input
                    onChange={(e) =>
                      setSelectedImage(e.target.files ? e.target.files[0] : null)
                    }
                    type="file"
                    id="avatar"
                    accept=".png,.jpg,.jpeg"
                    hidden
                  />
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {selectedImage ? selectedImage.name : 'Upload new picture'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <textarea
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  placeholder="Tell us about yourself..."
                  required
                  className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none transition resize-none"
                  rows={4}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 glass-input rounded-xl text-gray-300 hover:bg-white/5 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
