import React from 'react';

import { useKycVerificationForm } from '../hooks/useKycVerificationForm';

interface KycVerificationProps {
  kycStatus: string;
  onKycUpdated: () => void;
}

const KycVerification = (props: KycVerificationProps) => {
  const {
    form,
    error,
    successMessage,
    uploadError,
    startKycError,
    isUploading,
    isStartingKyc,
    kycDocuments,
    showForm,
    kycStatusMessage,
    handleKycDocumentChange,
    removeFile,
  } = useKycVerificationForm(props);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">KYC Verification</h2>

      {kycStatusMessage && (
        <div
          className={`mb-4 ${
            props.kycStatus === 'VERIFIED'
              ? 'text-green-700'
              : props.kycStatus === 'IN_PROGRESS'
                ? 'text-yellow-700'
                : props.kycStatus === 'REJECTED'
                  ? 'text-red-700'
                  : 'text-gray-700'
          }`}
        >
          {kycStatusMessage}
        </div>
      )}

      {(error || uploadError || startKycError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || uploadError || startKycError}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              KYC Documents
            </label>
            <input
              type="file"
              onChange={handleKycDocumentChange}
              className="mt-1 block w-full"
              disabled={isUploading}
            />
            {kycDocuments.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Uploaded Documents:
                </h3>
                <ul className="list-disc pl-5 mt-1">
                  {kycDocuments.map((doc) => (
                    <li key={doc.id} className="flex items-center">
                      <span className="mr-2">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(doc.id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isUploading || isStartingKyc}
            >
              {isStartingKyc
                ? 'Starting Verification...'
                : 'Start Verification'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default KycVerification;
