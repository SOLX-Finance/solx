import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      {userId ? (
        <p className="text-gray-700">Viewing profile for user ID: {userId}</p>
      ) : (
        <p className="text-gray-700">Viewing your profile</p>
      )}
    </div>
  );
};

export default ProfilePage;
