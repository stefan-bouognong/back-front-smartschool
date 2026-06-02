import client from './client';

export interface ChargeData {
  matricule: string;
  amount: number;
  customer_phone: string;
}

export const createCharge = async (data: ChargeData) => {
  const response = await client.post('/finance/charge', data);
  return response.data;
};

export const getPaymentStatus = async (reference: string) => {
  const response = await client.get('/finance/status', { params: { reference } });
  return response.data;
};