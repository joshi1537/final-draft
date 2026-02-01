import React, { useState } from 'react';
import { Bell, ChevronRight, LogOut, User, Calendar, Heart, Apple, AlertCircle, Save } from 'lucide-react';
import { UserProfile } from '../types';
import { Logo, DIETARY_OPTIONS } from '../constants';
import { supabase } from '../src/lib/supabase';

interface Props {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>({ ...user });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // added sign-out state
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setSignOutError(null);
    setSignOutLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      setSignOutLoading(false);
      if (error) {
        setSignOutError(error.message);
        return;
      }
      setShowLogoutConfirm(false);
      // notify parent; fallback to reload if parent doesn't handle UI state
      if (typeof onLogout === 'function') {
        onLogout();
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setSignOutLoading(false);
      setSignOutError(err?.message ?? 'Failed to sign out.');
    }
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const current = editedUser.dietaryRestrictions || [];
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    setEditedUser({ ...editedUser, dietaryRestrictions: updated });
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-10">
        <Logo size={20} />
        <div className="flex gap-4">
         
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FFDDE2] bg-[#FFDDE2] flex items-center justify-center font-bold text-[#FF2D55]">
            {user.email[0].toUpperCase()}
          </div>
        </div>
      </header>

      <div className="p-6 pb-32">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-serif italic text-[#FF2D55] mb-2">Profile</h1>
            <p className="text-gray-500">Manage your account</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-[#FF2D55] text-white rounded-2xl font-bold hover:bg-[#E02549] transition-colors shadow-md"
            >
              Edit
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={18} className="text-[#FF2D55]" />
            <h3 className="font-bold text-gray-700 text-lg">Account Info</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
              <p className="text-gray-700 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Cycle Info */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={18} className="text-[#FF2D55]" />
            <h3 className="font-bold text-gray-700 text-lg">Cycle Information</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Last Period Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedUser.lastPeriodDate}
                  onChange={(e) => setEditedUser({ ...editedUser, lastPeriodDate: e.target.value })}
                  className="w-full px-4 py-3 bg-pink-50 rounded-2xl border-2 border-transparent focus:border-pink-200 focus:outline-none text-gray-700"
                />
              ) : (
                <p className="text-gray-700 font-medium">
                  {new Date(user.lastPeriodDate).toLocaleDateString('default', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cycle Length (days)</label>
              {isEditing ? (
                <input
                  type="number"
                  min="21"
                  max="40"
                  value={editedUser.cycleLength}
                  onChange={(e) => setEditedUser({ ...editedUser, cycleLength: parseInt(e.target.value) || 28 })}
                  className="w-full px-4 py-3 bg-pink-50 rounded-2xl border-2 border-transparent focus:border-pink-200 focus:outline-none text-gray-700"
                />
              ) : (
                <p className="text-gray-700 font-medium">{user.cycleLength} days</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Period Duration (days)</label>
              {isEditing ? (
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={editedUser.periodDuration}
                  onChange={(e) => setEditedUser({ ...editedUser, periodDuration: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-3 bg-pink-50 rounded-2xl border-2 border-transparent focus:border-pink-200 focus:outline-none text-gray-700"
                />
              ) : (
                <p className="text-gray-700 font-medium">{user.periodDuration} days</p>
              )}
            </div>
          </div>
        </div>

        {/* Health Conditions */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart size={18} className="text-[#FF2D55]" />
            <h3 className="font-bold text-gray-700 text-lg">Health Conditions</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">PCOS</span>
              {isEditing ? (
                <button
                  onClick={() => setEditedUser({ ...editedUser, hasPCOS: !editedUser.hasPCOS })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    editedUser.hasPCOS ? 'bg-[#FF2D55]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    editedUser.hasPCOS ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              ) : (
                <span className={`font-bold ${user.hasPCOS ? 'text-[#FF2D55]' : 'text-gray-400'}`}>
                  {user.hasPCOS ? 'Yes' : 'No'}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Endometriosis</span>
              {isEditing ? (
                <button
                  onClick={() => setEditedUser({ ...editedUser, hasEndometriosis: !editedUser.hasEndometriosis })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    editedUser.hasEndometriosis ? 'bg-[#FF2D55]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    editedUser.hasEndometriosis ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              ) : (
                <span className={`font-bold ${user.hasEndometriosis ? 'text-[#FF2D55]' : 'text-gray-400'}`}>
                  {user.hasEndometriosis ? 'Yes' : 'No'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Apple size={18} className="text-[#FF2D55]" />
            <h3 className="font-bold text-gray-700 text-lg">Dietary Preferences</h3>
          </div>

          {isEditing ? (
            <div className="flex flex-wrap gap-3">
              {DIETARY_OPTIONS.filter(opt => opt !== 'None').map(option => {
                const isSelected = (editedUser.dietaryRestrictions || []).includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleDietaryRestriction(option)}
                    className={`px-5 py-3 rounded-2xl font-medium text-sm transition-all ${
                      isSelected
                        ? 'bg-[#FF2D55] text-white shadow-md'
                        : 'bg-pink-50 text-gray-600 hover:bg-pink-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {user.dietaryRestrictions && user.dietaryRestrictions.length > 0 ? (
                user.dietaryRestrictions.map(restriction => (
                  <div key={restriction} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF2D55] rounded-full"></div>
                    <span className="text-gray-700">{restriction}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No dietary restrictions</p>
              )}
            </div>
          )}
        </div>

        {/* Edit Mode Actions */}
        {isEditing && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#FF2D55] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#E02549] transition-colors shadow-lg"
            >
              <Save size={20} />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="w-full bg-white border-2 border-pink-100 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-[#FF2D55] hover:text-[#FF2D55] transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-pink-50 rounded-full mx-auto mb-4">
              <AlertCircle size={32} className="text-[#FF2D55]" />
            </div>
            <h3 className="text-2xl font-serif italic text-[#FF2D55] text-center mb-2">
              Sign Out?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to sign out? Your data will be saved.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-[#FF2D55] text-white py-4 rounded-2xl font-bold hover:bg-[#E02549] transition-colors"
                disabled={signOutLoading}
              >
                {signOutLoading ? 'Signing out…' : 'Yes, Sign Out'}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                disabled={signOutLoading}
              >
                Cancel
              </button>
            </div>

            {signOutError && (
              <div className="mt-4 text-sm text-red-600 text-center">
                {signOutError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;