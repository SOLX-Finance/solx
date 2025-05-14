import { httpClient } from '@/services/httpClient';

export interface Sale {
  id: string;
  title: string;
  description: string;
  creator: string;
  buyer: string | null;
  files: {
    id: string;
    type: string;
    mimeType: string;
    remoteId: string;
  }[];
  user: {
    id: string;
    walletAddress: string;
    name: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetSalesResponse {
  sales: Sale[];
}

export const createSale = async (
  title: string,
  description: string,
  fileIds: string[],
) => {
  const response = await httpClient.post(`/sales`, {
    title,
    description,
    files: fileIds,
  });
  return response.data;
};

export const getSaleById = async (id: string): Promise<Sale> => {
  const response = await httpClient.get(`/sales/${id}`);
  return response.data;
};

export const getActiveSales = async (): Promise<Sale[]> => {
  const response = await httpClient.get<GetSalesResponse>('/sales/active');
  return response.data.sales;
};
