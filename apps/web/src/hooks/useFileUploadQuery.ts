import { useMutation } from '@tanstack/react-query';
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

// Generate a signed upload URL
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

// Upload a file to the signed URL
export const uploadFile = async (url: string, file: File) => {
  await httpClient.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};

// Upload a single file (generate URL and upload)
export const uploadSingleFile = async (file: File, fileType: FileType) => {
  const { url, fileId } = await generateUploadUrl(fileType, file.type);
  await uploadFile(url, file);
  return {
    id: fileId,
    name: file.name,
    type: fileType,
  };
};

export const useFileUploadQuery = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Mutation for uploading files
  const uploadMutation = useMutation({
    mutationFn: async ({
      files,
      fileType,
    }: {
      files: File[];
      fileType: FileType;
    }) => {
      const newUploadedFiles: UploadedFile[] = [];

      for (const file of files) {
        const uploadedFile = await uploadSingleFile(file, fileType);
        newUploadedFiles.push(uploadedFile);
      }

      return newUploadedFiles;
    },
    onSuccess: (newFiles) => {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    },
  });

  const uploadFiles = async (files: File[], fileType: FileType) => {
    return uploadMutation.mutateAsync({ files, fileType });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return {
    uploadedFiles,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error
      ? (uploadMutation.error as Error).message
      : null,
    uploadFiles,
    removeFile,
  };
};
