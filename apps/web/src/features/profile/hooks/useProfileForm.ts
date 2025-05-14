import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { useProfile } from './useProfile';

import { FileType, useFileUploadQuery } from '@/hooks/useFileUploadQuery';

export interface ProfileFormValues {
  username: string;
}

export interface UseProfileFormProps {
  initialUsername: string | null;
  profilePictureId: string | null;
  onProfileUpdated: () => void;
}

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 50;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const useProfileForm = ({
  initialUsername,
  profilePictureId,
  onProfileUpdated,
}: UseProfileFormProps) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { updateProfile, isUpdatingProfile, updateProfileError } = useProfile();

  const {
    isUploading,
    uploadedFiles,
    error: uploadError,
    uploadFiles,
    removeFile,
  } = useFileUploadQuery();

  const profilePicture = uploadedFiles.find(
    (file) => file.type === FileType.PROFILE_PICTURE,
  );

  const form = useForm({
    defaultValues: {
      username: initialUsername ?? '',
    },
    onSubmit: async ({ value }) => {
      setSuccessMessage(null);
      setFormError(null);

      try {
        const newProfilePictureId = profilePicture?.id ?? profilePictureId;

        await updateProfile({
          username: value.username,
          profilePictureId: newProfilePictureId ?? undefined,
        });

        setSuccessMessage('Profile updated successfully');
        onProfileUpdated();
        return {};
      } catch (err) {
        console.error('Error updating profile:', err);
        setFormError('Failed to update profile. Please try again.');
        return {
          error: 'Failed to update profile. Please try again.',
        };
      }
    },
  });

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      if (profilePicture) {
        removeFile(profilePicture.id);
      }

      await uploadFiles([e.target.files[0]], FileType.PROFILE_PICTURE);
    }
  };

  const validateUsername = (username: string) => {
    if (!username.trim()) {
      return 'Username is required';
    }

    if (username.length < USERNAME_MIN_LENGTH) {
      return `Username must be at least ${USERNAME_MIN_LENGTH} characters`;
    }

    if (username.length > USERNAME_MAX_LENGTH) {
      return `Username cannot exceed ${USERNAME_MAX_LENGTH} characters`;
    }

    if (!USERNAME_PATTERN.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }

    return undefined;
  };

  return {
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
  };
};
