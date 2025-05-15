import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createSale } from '../api/salesApi';

import { FileType, useFileUploadQuery } from '@/hooks/useFileUploadQuery';

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

export const useCreateSaleFormQuery = () => {
  const navigate = useNavigate();

  const {
    uploadedFiles,
    isUploading,
    error: uploadError,
    uploadFiles,
    removeFile,
  } = useFileUploadQuery();

  const createSaleMutation = useMutation({
    mutationFn: async ({
      title,
      description,
      fileIds,
    }: {
      title: string;
      description: string;
      fileIds: string[];
    }) => {
      return createSale(title, description, fileIds);
    },
    onSuccess: (response) => {
      navigate(`/sales/${response.id}`);
    },
  });

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
          return {
            error: config.missingError || `You must upload a ${type} file`,
          };
        }

        // Check max count
        if (files.length > config.maxCount) {
          return {
            error:
              config.exceededError ||
              `You can upload at most ${config.maxCount} ${type} file(s)`,
          };
        }
      }

      const fileIds = uploadedFiles.map((file) => file.id);

      createSaleMutation.mutate({
        title: value.title,
        description: value.description,
        fileIds,
      });

      return {};
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
    isSubmitting: createSaleMutation.isPending,
    isUploading,
    uploadedFiles,
    submitError: createSaleMutation.error
      ? (createSaleMutation.error as Error).message
      : null,
    uploadError,
    handleContentFileChange,
    handleDemoFileChange,
    handlePreviewFileChange,
    removeFile,
    getFilesByType,
  };
};
