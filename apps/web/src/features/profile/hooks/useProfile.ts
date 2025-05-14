import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getCurrentUser,
  updateProfile,
  startKycVerification,
} from '../api/profileApi';

const PROFILE_QUERY_KEY = 'profile';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getCurrentUser,
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({
      username,
      profilePictureId,
    }: {
      username?: string;
      profilePictureId?: string;
    }) => updateProfile(username, profilePictureId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY], updatedUser);
    },
  });

  const startKycMutation = useMutation({
    mutationFn: startKycVerification,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY], updatedUser);
    },
  });

  return {
    user,
    isLoading,
    error: error ? error.message : null,
    refetchProfile: refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error
      ? updateProfileMutation.error.message
      : null,
    startKycVerification: startKycMutation.mutateAsync,
    isStartingKyc: startKycMutation.isPending,
    startKycError: startKycMutation.error
      ? startKycMutation.error.message
      : null,
  };
};
