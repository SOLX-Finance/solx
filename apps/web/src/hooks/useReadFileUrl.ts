import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';

import { httpClient } from '@/services/httpClient';

interface UseReadFileUrlProps {
  fileId?: string;
  enabled?: boolean;
}

interface ReadUrlResponse {
  url: string;
}

export const useReadFileUrl = ({
  fileId,
  enabled = true,
}: UseReadFileUrlProps) => {
  const [error, setError] = useState<string | null>(null);

  const { data: readUrl, isLoading } = useQuery<ReadUrlResponse>({
    queryKey: ['readFileUrl', fileId],
    queryFn: async () => {
      if (!fileId) {
        throw new Error('File ID is required');
      }

      try {
        const response = await httpClient.get<ReadUrlResponse>(
          `/storage/read-url/${fileId}`,
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
