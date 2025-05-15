import { useState } from 'react';

import { httpClient } from '@/services/httpClient';

export enum FileType {
  // User files
  PROFILE_PICTURE = 'PROFILE_PICTURE',
  KYC_DOCUMENT = 'KYC_DOCUMENT',

  // Project files
  SALE_CONTENT = 'SALE_CONTENT',
  SALE_DEMO = 'SALE_DEMO',
  SALE_PREVIEW = 'SALE_PREVIEW',
}

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
}

export const generateUploadUrl = async (
  fileType: FileType,
  contentType: string,
) => {
  const response = await httpClient.post(
    `/storage/upload-url`,
    {},
    {
      params: {
        fileType,
        contentType,
      },
    },
  );
  return response.data;
};

export const uploadFile = async (url: string, file: File) => {
  await httpClient.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (files: File[], fileType: FileType) => {
    setIsUploading(true);
    setError(null);

    try {
      const newUploadedFiles: UploadedFile[] = [];

      for (const file of files) {
        const { url, fileId } = await generateUploadUrl(fileType, file.type);

        await uploadFile(url, file);

        newUploadedFiles.push({
          id: fileId,
          name: file.name,
          type: fileType,
        });
      }

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
      return newUploadedFiles;
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return {
    isUploading,
    uploadedFiles,
    error,
    uploadFiles,
    removeFile,
  };
};
