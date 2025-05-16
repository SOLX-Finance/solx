import { Sale } from '@/features/sales/api/salesApi';
import { httpClient } from '@/services/httpClient';

export interface User {
  id: string;
  walletAddress: string;
  username: string | null;
  profilePictureId: string | null;
  kycStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';
  kycDetails: unknown | null;
  createdAt: string;
  updatedAt: string;
  earnings?: {
    earned: number;
    spent: number;
    collateral: number;
  };
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await httpClient.get('/users/me');
  return response.data;
};

export const getUserByWalletAddress = async (
  walletAddress: string,
): Promise<User> => {
  const response = await httpClient.get(`/users/wallet/${walletAddress}`);
  return response.data;
};

export const updateProfile = async (
  username?: string,
  profilePictureId?: string,
): Promise<User> => {
  const response = await httpClient.patch('/users/me/profile', {
    username,
    profilePictureId,
  });
  return response.data;
};

export const startKycVerification = async (): Promise<User> => {
  const response = await httpClient.post('/users/me/kyc/start');
  return response.data;
};

export const getUserSales = async (walletAddress: string): Promise<Sale[]> => {
  const response = await httpClient.get(`/sales/user/${walletAddress}`);
  return response.data.sales;
};
