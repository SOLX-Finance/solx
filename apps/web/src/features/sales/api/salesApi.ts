import { httpClient } from '@/services/httpClient';

export interface Sale {
  id: string;
  title: string;
  description: string;
  creator: string;
  buyer: string | null;
  price: number;
  collateralAmount: number;
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

export interface CreateSaleRequest {
  title: string;
  description: string;
  files: string[];
  price: number;
  collateralAmount: number;
}

export interface CreateSaleResponse {
  id: string;
}

export interface GetSalesResponse {
  sales: Sale[];
}

export interface GetSalesByUserResponse {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createSale = async (
  title: string,
  description: string,
  fileIds: string[],
): Promise<CreateSaleResponse> => {
  const response = await httpClient.post<CreateSaleResponse>(`/sales`, {
    title,
    description,
    files: fileIds,
  });
  return response.data;
};

export const getSaleById = async (id: string): Promise<Sale> => {
  const response = await httpClient.get<Sale>(`/sales/${id}`);
  return response.data;
};

export const getActiveSales = async (): Promise<Sale[]> => {
  const response = await httpClient.get<GetSalesResponse>('/sales/active');
  return response.data.sales;
};

export const getUserSales = async (
  walletAddress: string,
  page = 1,
  limit = 9,
): Promise<GetSalesByUserResponse> => {
  const response = await httpClient.get(`/sales/user/${walletAddress}`, {
    params: { page, limit },
  });
  return response.data;
};
