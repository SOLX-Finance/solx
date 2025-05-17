import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import FilterableSales from '../components/FilterableSales';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileSalesTabs } from '../components/ProfileSalesTabs';
import { ProfileStats } from '../components/ProfileStats';
import { useProfile } from '../hooks/useProfile';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserSales, SalesFilter } from '../hooks/useUserSales';

import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { Spinner } from '@/components/ui/spinner';
import { showToast } from '@/components/ui/toaster';
import { Sale } from '@/features/sales/api/salesApi';
import { FileType, useFileUploadQuery } from '@/hooks/useFileUploadQuery';
import { httpClient } from '@/services/httpClient';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const [activeTab, setActiveTab] = useState<SalesFilter>('created');
  const [loadingContentIds, setLoadingContentIds] = useState<string[]>([]);

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
  } = useUserSales({
    walletAddress: user?.walletAddress || '',
    initialFilter: activeTab,
    initialLimit: 6,
    initialPage: 1,
  });

  const { uploadFiles } = useFileUploadQuery();

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

  // Handle content download for purchased sales
  const handleDownloadContent = async (sale: Sale) => {
    if (!isOwnProfile || activeTab !== 'bought') return;

    try {
      // Find the content file
      const contentFile = sale.files?.find(
        (file) => file.type === 'SALE_CONTENT',
      );

      if (!contentFile?.id) {
        showToast({
          type: 'error',
          title: 'Download Failed',
          description: 'Content file not found for this sale.',
        });
        return;
      }

      // Add sale ID to loading list
      setLoadingContentIds((prev) => [...prev, sale.id]);

      // Get download URL using the authenticated HTTP client
      const { data } = await httpClient.get(
        `/storage/read-url/${contentFile.id}`,
      );

      if (data?.url) {
        // Open download in new tab
        window.open(data.url, '_blank', 'noopener,noreferrer');

        showToast({
          type: 'success',
          title: 'Download Started',
          description: 'Your content download has started.',
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error downloading content:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        description: 'Could not download content. Please try again.',
      });
    } finally {
      // Remove sale ID from loading list
      setLoadingContentIds((prev) => prev.filter((id) => id !== sale.id));
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
    <div className="container mx-auto md:p-4 py-4 px-0 flex flex-col gap-[40px]">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        onUsernameEdit={isOwnProfile ? handleUsernameEdit : undefined}
        onProfilePictureChange={
          isOwnProfile ? handleProfilePictureChange : undefined
        }
      />

      <ProfileStats
        stats={[
          {
            label: 'Earnings',
            value: user.earnings?.earned?.toString?.() || '0',
          },
          {
            label: 'Spent',
            value: user.earnings?.spent?.toString?.() || '0',
          },
          {
            label: 'Collateral',
            value: user.earnings?.collateral?.toString?.() || '0',
          },
        ]}
      />

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
            activeTab={activeTab}
            onDownloadContent={
              isOwnProfile && activeTab === 'bought'
                ? handleDownloadContent
                : undefined
            }
            loadingContentIds={loadingContentIds}
          />
        </div>
      )}

      {/* KYC Verification Section (only for own profile) */}
      {/* {isOwnProfile && (
        <div className="mb-6">
          <details className="bg-white shadow-sm rounded-[40px] py-4 md:p-4">
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
      )} */}
    </div>
  );
};

export default ProfilePage;
