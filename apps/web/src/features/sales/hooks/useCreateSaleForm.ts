import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createSale } from '../api/salesApi';

import { FileType, useFileUpload } from '@/hooks/useFileUpload';

const FILE_TYPE_CONFIG = {
  [FileType.SALE_CONTENT]: {
    required: true,
    maxCount: 1,
    missingError: 'You must upload a content file',
    exceededError: 'You can upload only one content file',
  },
  [FileType.SALE_DEMO]: {
    required: false,
    maxCount: 1,
    missingError: 'Demo file is missing',
    exceededError: 'You can upload only one demo file',
  },
  [FileType.SALE_PREVIEW]: {
    required: false,
    maxCount: 1,
    missingError: 'Preview file is missing',
    exceededError: 'You can upload only one preview file',
  },
};

export const useCreateSaleForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    isUploading,
    uploadedFiles,
    error: uploadError,
    uploadFiles,
    removeFile,
  } = useFileUpload();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      const filesByType = Object.entries(FILE_TYPE_CONFIG).map(
        ([type, config]) => {
          const files = uploadedFiles.filter((file) => file.type === type);
          return { type, files, config };
        },
      );

      // Check file constraints
      for (const { type, files, config } of filesByType) {
        // Check required files
        if (config.required && files.length === 0) {
          setSubmitError(
            config.missingError || `You must upload a ${type} file`,
          );
          return;
        }

        // Check max count
        if (files.length > config.maxCount) {
          setSubmitError(
            config.exceededError ||
              `You can upload at most ${config.maxCount} ${type} file(s)`,
          );
          return;
        }
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const fileIds = uploadedFiles.map((file) => file.id);
        const response = await createSale(
          value.title,
          value.description,
          fileIds,
        );

        navigate(`/sales/${response.id}`);
      } catch (err) {
        console.error('Error creating sale:', err);
        setSubmitError('Failed to create sale. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const createFileChangeHandler =
    (fileType: FileType) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        // Remove any existing files of this type
        const existingFiles = uploadedFiles.filter(
          (file) => file.type === fileType,
        );
        for (const file of existingFiles) {
          removeFile(file.id);
        }

        // Upload the new file
        await uploadFiles([e.target.files[0]], fileType);
      }
    };

  const handleContentFileChange = createFileChangeHandler(
    FileType.SALE_CONTENT,
  );
  const handleDemoFileChange = createFileChangeHandler(FileType.SALE_DEMO);
  const handlePreviewFileChange = createFileChangeHandler(
    FileType.SALE_PREVIEW,
  );

  // Get all files of a specific type
  const getFilesByType = (fileType: FileType) => {
    return uploadedFiles.filter((file) => file.type === fileType);
  };

  return {
    form,
    isSubmitting,
    isUploading,
    uploadedFiles,
    submitError,
    uploadError,
    handleContentFileChange,
    handleDemoFileChange,
    handlePreviewFileChange,
    removeFile,
    getFilesByType,
  };
};
