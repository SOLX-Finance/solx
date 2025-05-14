import React from 'react';
import { useParams } from 'react-router-dom';

import KycVerification from '../components/KycVerification';
import ProfileForm from '../components/ProfileForm';
import UserSales from '../components/UserSales';
import { useProfile } from '../hooks/useProfile';

import { env } from '@/config/env';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, error, refetchProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>

      <div className="flex items-center mb-4">
        {user.profilePictureId && (
          <div className="mr-4">
            <img
              src={`${env.api.url}/storage/${user.profilePictureId}`}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full"
              crossOrigin="anonymous"
            />
          </div>
        )}
        <div>
          {user.username && (
            <p className="text-xl text-gray-700">Username: {user.username}</p>
          )}
        </div>
      </div>

      {userId ? (
        <p className="text-gray-700 mb-6">
          Viewing profile for user ID: {userId}
        </p>
      ) : (
        <div>
          <div className="mb-6">
            <ProfileForm
              initialUsername={user.username}
              profilePictureId={user.profilePictureId}
              onProfileUpdated={refetchProfile}
            />
          </div>

          <div className="mb-6">
            <KycVerification
              kycStatus={user.kycStatus}
              onKycUpdated={refetchProfile}
            />
          </div>

          <div className="mb-6">
            <UserSales walletAddress={user.walletAddress} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
