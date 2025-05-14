import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { useProfile } from './useProfile';

import { FileType, useFileUploadQuery } from '@/hooks/useFileUploadQuery';

export interface UseKycVerificationFormProps {
  kycStatus: string;
  onKycUpdated: () => void;
}

export const useKycVerificationForm = ({
  kycStatus,
  onKycUpdated,
}: UseKycVerificationFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { startKycVerification, isStartingKyc, startKycError } = useProfile();

  const {
    isUploading,
    uploadedFiles,
    error: uploadError,
    uploadFiles,
    removeFile,
  } = useFileUploadQuery();

  const kycDocuments = uploadedFiles.filter(
    (file) => file.type === FileType.KYC_DOCUMENT,
  );

  const form = useForm({
    onSubmit: async () => {
      setError(null);
      setSuccessMessage(null);

      // Check if at least one KYC document has been uploaded
      if (kycDocuments.length === 0) {
        setError('Please upload at least one KYC document');
        return {
          error: 'Please upload at least one KYC document',
        };
      }

      try {
        await startKycVerification();
        setSuccessMessage('KYC verification process started successfully');
        onKycUpdated();
        return {};
      } catch (err) {
        console.error('Error starting KYC verification:', err);
        setError('Failed to start KYC verification. Please try again.');
        return {
          error: 'Failed to start KYC verification. Please try again.',
        };
      }
    },
  });

  const handleKycDocumentChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      // Upload the new KYC document
      await uploadFiles([e.target.files[0]], FileType.KYC_DOCUMENT);
    }
  };

  // Only show the form if KYC is not started or rejected
  const showForm = kycStatus === 'NOT_STARTED' || kycStatus === 'REJECTED';

  const getKycStatusMessage = () => {
    switch (kycStatus) {
      case 'NOT_STARTED':
        return 'You have not started the KYC verification process yet. Please upload your KYC documents and start the verification process.';
      case 'IN_PROGRESS':
        return "Your KYC verification is in progress. We will notify you once it's complete.";
      case 'VERIFIED':
        return 'Your KYC verification has been completed successfully.';
      case 'REJECTED':
        return 'Your KYC verification has been rejected. Please upload new documents and try again.';
      default:
        return null;
    }
  };

  return {
    form,
    error,
    successMessage,
    uploadError,
    startKycError,
    isUploading,
    isStartingKyc,
    kycDocuments,
    showForm,
    kycStatusMessage: getKycStatusMessage(),
    handleKycDocumentChange,
    removeFile,
  };
};
