import { MarketFilters } from '@/features/market/hooks/useMarket';
import { httpClient } from '@/services/httpClient';

export interface Sale {
  id: string;
  title: string;
  description: string;
  whatYouWillGet: string;
  priceUsd: string;
  collateralAmount: string;
  collateralMint: string;
  listing: string;
  nftMint: string;
  creator: string;
  buyer: string | null;
  createdAt: string;
  updatedAt: string;
  files?: {
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
  categories?: string[];
  isAudited?: boolean;
}

export interface SalesResponse {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserSalesFilters {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  filter?: 'created' | 'bought';
}

class SalesApi {
  private baseUrl = `/sales`;

  async getActiveSales(filters: MarketFilters): Promise<SalesResponse> {
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append('page', filters.page.toString());
    queryParams.append('limit', filters.limit.toString());

    // Add search param if provided
    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    // Add sort param
    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy);
    }

    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach((category) => {
        queryParams.append('category', category);
      });
    }

    const { data } = await httpClient.get(
      `${this.baseUrl}/active?${queryParams.toString()}`,
    );

    return data;
  }

  async getSalesByUser(
    walletAddress: string,
    filters: UserSalesFilters = { page: 1, limit: 9 },
  ): Promise<SalesResponse> {
    const queryParams = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });

    // Add search param if provided
    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    // Add sort param if provided
    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy);
    }

    // Add filter param if provided
    if (filters.filter) {
      queryParams.append('filter', filters.filter);
    }

    const { data } = await httpClient.get(
      `${this.baseUrl}/user/${walletAddress}?${queryParams.toString()}`,
    );

    return data;
  }

  async getSaleById(id: string): Promise<Sale> {
    const { data } = await httpClient.get(`${this.baseUrl}/${id}`);
    return data;
  }

  async createSale(saleData: {
    title: string;
    description: string;
    files: string[];
    categories?: string[];
    whatYouWillGet: string;
  }): Promise<{ id: string }> {
    const { data } = await httpClient.post(`${this.baseUrl}`, saleData);
    return data;
  }
}

export const salesApi = new SalesApi();
