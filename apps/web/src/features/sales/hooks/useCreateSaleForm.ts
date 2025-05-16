import { useSolanaWallets } from '@privy-io/react-auth';
import { PublicKey } from '@solana/web3.js';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { salesApi } from '../api/salesApi';

import { useCreateSale } from '@/hooks/contracts/useCreateSale';
import { FileType, useFileUploadQuery } from '@/hooks/useFileUploadQuery';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { SOL_MINT } from '@/utils/programs.utils';

const FILE_TYPE_CONFIG = {
  [FileType.SALE_CONTENT]: {
    required: true,
    maxCount: 1,
    missingError: 'You must upload a content ZIP file',
    exceededError: 'You can upload only one content ZIP file',
  },
  [FileType.SALE_DEMO]: {
    required: false,
    maxCount: 1,
    missingError: 'Demo file is missing',
    exceededError: 'You can upload at most 1 demo file',
  },
  [FileType.SALE_PREVIEW]: {
    required: false,
    maxCount: 5,
    missingError: 'Preview file is missing',
    exceededError: 'You can upload only one preview file',
  },
};

export const useCreateSaleForm = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { wallets, ready: walletsReady } = useSolanaWallets();

  const [selectedFiles, setSelectedFiles] = useState<{
    [key in FileType]?: File[];
  }>({});

  const { isUploading, error: uploadError, uploadFiles } = useFileUploadQuery();
  const {
    balance: solBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useSolanaBalance();

  const apiMutation = useMutation({
    mutationFn: async ({
      title,
      description,
      fileIds,
      categories,
    }: {
      title: string;
      description: string;
      fileIds: string[];
      categories: string[];
    }) => {
      return salesApi.createSale({
        title,
        description,
        files: fileIds,
        categories,
      });
    },
  });

  const {
    createSale: createSaleOnchain,
    isPending: isCreatingOnchain,
    error: onchainError,
  } = useCreateSale();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      collateralAmount: 0,
      categories: [] as string[],
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      setSuccessMessage(null);

      try {
        if (!walletsReady || !wallets || wallets.length === 0) {
          setFormError('Please connect your wallet first');
          return { error: 'Please connect your wallet first' };
        }

        if (isBalanceLoading) {
          setFormError('Checking your SOL balance, please wait...');
          return { error: 'Checking your SOL balance, please wait...' };
        }
        if (balanceError) {
          setFormError('Failed to fetch SOL balance. Please try again.');
          return { error: 'Failed to fetch SOL balance. Please try again.' };
        }
        // Validate enough SOL for collateral
        const collateralAmount = Number(value.collateralAmount);
        if (isNaN(collateralAmount) || collateralAmount <= 0) {
          setFormError('Collateral amount must be greater than 0');
          return { error: 'Collateral amount must be greater than 0' };
        }
        if (typeof solBalance === 'number' && solBalance < collateralAmount) {
          setFormError(
            `Insufficient SOL balance. You have ${solBalance} SOL, but the collateral amount is ${collateralAmount} SOL.`,
          );
          return {
            error: `Insufficient SOL balance. You have ${solBalance} SOL, but the collateral amount is ${collateralAmount} SOL.`,
          };
        }

        const filesByType = Object.entries(FILE_TYPE_CONFIG).map(
          ([type, config]) => {
            const files = selectedFiles[type as FileType] || [];
            return { type, files, config };
          },
        );

        for (const { type, files, config } of filesByType) {
          if (config.required && files.length === 0) {
            setFormError(
              config.missingError || `You must upload a ${type} file`,
            );
            return {
              error: config.missingError || `You must upload a ${type} file`,
            };
          }

          if (files.length > config.maxCount) {
            setFormError(
              config.exceededError ||
                `You can upload at most ${config.maxCount} ${type} file(s)`,
            );
            return {
              error:
                config.exceededError ||
                `You can upload at most ${config.maxCount} ${type} file(s)`,
            };
          }

          // Validate that SALE_CONTENT is a ZIP file
          if (type === FileType.SALE_CONTENT && files.length > 0) {
            const contentFile = files[0];
            if (!contentFile.name.toLowerCase().endsWith('.zip')) {
              setFormError('Content file must be a ZIP archive');
              return {
                error: 'Content file must be a ZIP archive',
              };
            }
          }
        }

        // Upload all files now
        const fileIdsPromises = Object.entries(selectedFiles).map(
          async ([type, files]) => {
            if (!files || files.length === 0) return [];
            const uploadedFilesResult = await uploadFiles(
              files,
              type as FileType,
            );
            return uploadedFilesResult.map((file) => file.id);
          },
        );

        const fileIdsArrays = await Promise.all(fileIdsPromises);
        const fileIds = fileIdsArrays.flat();

        // Create the sale in the backend
        const saleResponse = await apiMutation.mutateAsync({
          title: value.title,
          description: value.description,
          fileIds,
          categories: value.categories,
        });

        // Convert SOL to lamports (1 SOL = 10^9 lamports)
        const priceInLamports = BigInt(Math.floor(value.price * 1_000_000_000));
        const collateralInLamports = BigInt(
          Math.floor(value.collateralAmount * 1_000_000_000),
        );

        await createSaleOnchain({
          uuid: saleResponse.id,
          price: priceInLamports,
          collateralAmount: collateralInLamports,
          collateralMint: new PublicKey(SOL_MINT),
        });

        setSuccessMessage('Sale created successfully');
        navigate(`/sales/${saleResponse.id}`);
        return {};
      } catch (err) {
        console.error('Error creating sale:', err);
        setFormError('Failed to create sale. Please try again.');
        return {
          error: 'Failed to create sale. Please try again.',
        };
      }
    },
  });

  const createFileChangeHandler =
    (fileType: FileType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        // Convert FileList to array
        const filesArray = Array.from(e.target.files);

        // For SALE_CONTENT, ensure only one ZIP file is selected
        if (fileType === FileType.SALE_CONTENT) {
          const file = filesArray[0];
          if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
            setFormError('Content file must be a ZIP archive');
            e.target.value = '';
            return;
          }

          // Store only the first file
          setSelectedFiles((prev) => ({
            ...prev,
            [fileType]: [file],
          }));
        } else if (fileType === FileType.SALE_PREVIEW) {
          // Allow up to 5 preview files (any type)
          setSelectedFiles((prev) => {
            const existing = prev[fileType] || [];
            const existingKeys = new Set(
              existing.map((f) => `${f.name}_${f.size}`),
            );
            const uniqueNewFiles = filesArray.filter(
              (f) => !existingKeys.has(`${f.name}_${f.size}`),
            );
            const merged = [...existing, ...uniqueNewFiles];
            if (merged.length > 5) {
              setFormError('You can upload up to 5 preview files');
              e.target.value = '';
              return prev;
            }
            return {
              ...prev,
              [fileType]: merged,
            };
          });
        } else if (fileType === FileType.SALE_DEMO) {
          // Only one demo file (any type)
          const file = filesArray[0];
          setSelectedFiles((prev) => ({
            ...prev,
            [fileType]: [file],
          }));
        } else {
          // Store all selected files for other types (fallback)
          setSelectedFiles((prev) => ({
            ...prev,
            [fileType]: [...(prev[fileType] || []), ...filesArray],
          }));
        }
        // Reset input value so the same file can be selected again after removal
        e.target.value = '';
      }
    };

  const handleContentFileChange = createFileChangeHandler(
    FileType.SALE_CONTENT,
  );
  const handleDemoFileChange = createFileChangeHandler(FileType.SALE_DEMO);
  const handlePreviewFileChange = createFileChangeHandler(
    FileType.SALE_PREVIEW,
  );

  const removeSelectedFile = (fileType: FileType, index: number) => {
    setSelectedFiles((prev) => {
      const updatedFiles = [...(prev[fileType] || [])];
      updatedFiles.splice(index, 1);
      return {
        ...prev,
        [fileType]: updatedFiles,
      };
    });
  };

  const getFilesByType = (fileType: FileType) => {
    return selectedFiles[fileType] || [];
  };

  const validateTitle = (title: string) => {
    if (!title.trim()) {
      return 'Title is required';
    }
    if (title.length > 100) {
      return 'Title cannot exceed 100 characters';
    }
    return undefined;
  };

  const validateDescription = (description: string) => {
    if (!description.trim()) {
      return 'Description is required';
    }
    if (description.length > 5000) {
      return 'Description cannot exceed 5000 characters';
    }
    return undefined;
  };

  const validatePrice = (price: number) => {
    if (price <= 0) {
      return 'Price must be greater than 0';
    }
    return undefined;
  };

  const validateCollateralAmount = (collateralAmount: number) => {
    if (collateralAmount <= 0) {
      return 'Collateral amount must be greater than 0';
    }
    return undefined;
  };

  return {
    form,
    isSubmitting:
      apiMutation.isPending ||
      isCreatingOnchain ||
      isUploading ||
      isBalanceLoading,
    isUploading,
    formError,
    setFormError,
    uploadError,
    onchainError: onchainError ? String(onchainError) : null,
    successMessage,
    handleContentFileChange,
    handleDemoFileChange,
    handlePreviewFileChange,
    removeSelectedFile,
    getFilesByType,
    validateTitle,
    validateDescription,
    validatePrice,
    validateCollateralAmount,
    solBalance,
    isBalanceLoading,
    balanceError,
  };
};
