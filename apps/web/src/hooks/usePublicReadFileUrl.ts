import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';

import { httpClient } from '@/services/httpClient';

interface UsePublicReadFileUrlProps {
  fileId?: string;
  enabled?: boolean;
}

interface ReadUrlResponse {
  url: string;
}

export const usePublicReadFileUrl = ({
  fileId,
  enabled = true,
}: UsePublicReadFileUrlProps) => {
  const [error, setError] = useState<string | null>(null);

  const { data: readUrl, isLoading } = useQuery<ReadUrlResponse>({
    queryKey: ['publicReadFileUrl', fileId],
    queryFn: async () => {
      if (!fileId) {
        throw new Error('File ID is required');
      }

      try {
        const response = await httpClient.get<ReadUrlResponse>(
          `/storage/read-url/public/${fileId}`,
        );
        return response.data;
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || 'Failed to get file URL';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    enabled: !!fileId && enabled,
  });

  return {
    url: readUrl?.url,
    isLoading,
    error,
  };
};
