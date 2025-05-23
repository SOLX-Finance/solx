import React from 'react';

import { useProfileForm } from '../hooks/useProfileForm';

interface ProfileFormProps {
  initialUsername: string | null;
  profilePictureId: string | null;
  onProfileUpdated: () => void;
}

const ProfileForm = (props: ProfileFormProps) => {
  const {
    form,
    isUpdatingProfile,
    isUploading,
    profilePicture,
    successMessage,
    updateProfileError,
    uploadError,
    formError,
    handleProfilePictureChange,
    removeFile,
    validateUsername,
  } = useProfileForm(props);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      {(formError || uploadError || updateProfileError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError ?? uploadError ?? updateProfileError}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {form.Field({
          name: 'username',
          validators: {
            onChange: ({ value }) => validateUsername(value),
            onBlur: ({ value }) => validateUsername(value),
          },
          children: (field) => (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched
                    ? 'border-red-300'
                    : ''
                }`}
                maxLength={50}
              />
              {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
            </div>
          ),
        })}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            onChange={handleProfilePictureChange}
            className="mt-1 block w-full"
            accept="image/*"
            disabled={isUploading}
          />
          {profilePicture && (
            <div className="mt-2 flex items-center">
              <span className="mr-2">{profilePicture.name}</span>
              <button
                type="button"
                onClick={() => removeFile(profilePicture.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isUploading || isUpdatingProfile || !form.state.canSubmit}
          >
            {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
