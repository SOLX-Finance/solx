import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import FilterableSales from '../components/FilterableSales';
import KycVerification from '../components/KycVerification';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileSalesTabs } from '../components/ProfileSalesTabs';
import { ProfileStats } from '../components/ProfileStats';
import { useProfile } from '../hooks/useProfile';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserSales, SalesFilter } from '../hooks/useUserSales';

import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { Spinner } from '@/components/ui/spinner';
import { FileType, useFileUploadQuery } from '@/hooks/useFileUploadQuery';
import { stats } from '@/mocks';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const [activeTab, setActiveTab] = useState<SalesFilter>('created');

  const isOwnProfile = !walletAddress;

  const {
    user: currentUser,
    isLoading: isCurrentUserLoading,
    error: currentUserError,
    refetchProfile: refetchCurrentUser,
    updateProfile,
  } = useProfile();

  const {
    user: otherUser,
    isLoading: isOtherUserLoading,
    error: otherUserError,
    refetchProfile: refetchOtherUser,
  } = useUserProfile(walletAddress || '');

  const user = isOwnProfile ? currentUser : otherUser;
  const isLoading = isOwnProfile ? isCurrentUserLoading : isOtherUserLoading;
  const error = isOwnProfile ? currentUserError : otherUserError;
  const refetchProfile = isOwnProfile ? refetchCurrentUser : refetchOtherUser;

  const {
    sales,
    isLoading: salesLoading,
    total,
    currentPage,
    totalPages,
    limit,
    searchQuery,
    sortBy,
    handleNextPage,
    handlePrevPage,
    goToPage,
    changeLimit,
    handleSearchChange,
    handleSortChange,
    refetch: refetchSales,
  } = useUserSales(user?.walletAddress || '', activeTab);

  const { uploadFiles } = useFileUploadQuery();

  useEffect(() => {
    if (user?.walletAddress) {
      refetchSales();
    }
  }, [activeTab, user?.walletAddress, refetchSales]);

  const handleUsernameEdit = async (newUsername: string) => {
    if (!isOwnProfile || !currentUser) return;

    try {
      const previousUsername = currentUser.username;

      queryClient.setQueryData(['profile'], {
        ...currentUser,
        username: newUsername,
      });

      await updateProfile({
        username: newUsername,
      }).catch((error) => {
        console.error('Failed to update username', error);

        queryClient.setQueryData(['profile'], {
          ...currentUser,
          username: previousUsername,
        });
      });
    } catch (error) {
      console.error('Failed to update username', error);
    }
  };

  // Handle profile picture change (only for own profile)
  const handleProfilePictureChange = async (file: File) => {
    if (!isOwnProfile) return;

    try {
      const [uploadedFile] = await uploadFiles(
        [file],
        FileType.PROFILE_PICTURE,
      );

      await updateProfile({
        profilePictureId: uploadedFile.id,
      });

      refetchProfile();
    } catch (error) {
      console.error('Failed to upload profile picture', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !user) {
    navigate('/market');
    return null;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-[40px]">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        onUsernameEdit={isOwnProfile ? handleUsernameEdit : undefined}
        onProfilePictureChange={
          isOwnProfile ? handleProfilePictureChange : undefined
        }
      />

      <ProfileStats stats={stats} />

      <ProfileSalesTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBoughtTab={isOwnProfile}
      />

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {salesLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="w-full">
          {/* FilterableSales component */}
          <FilterableSales
            walletAddress={user?.walletAddress || ''}
            activeTab={activeTab}
            sales={sales || []}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onPageChange={goToPage}
            onLimitChange={changeLimit}
            total={total}
            limit={limit}
            isLoading={salesLoading}
          />
        </div>
      )}

      {/* KYC Verification Section (only for own profile) */}
      {isOwnProfile && (
        <div className="mb-6">
          <details className="bg-white shadow-sm rounded-[40px] p-4">
            <summary className="text-[24px] font-semibold cursor-pointer">
              KYC Verification
            </summary>
            <div className="mt-4">
              <KycVerification
                kycStatus={user.kycStatus}
                onKycUpdated={refetchProfile}
              />
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
