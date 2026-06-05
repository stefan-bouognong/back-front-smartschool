import client from "./client";

export const createCharge = async (data: {
  matricule: string;
  amount: number;
  customer_phone: string;
  id_tranche: number;
}) => {
  const response = await client.post("/finance/charge", data);
  return response.data;
};

export const checkStatus = async (reference: string) => {
  const response = await client.get("/finance/status", {
    params: {
      reference,
    },
  });

  return response.data;
};

export const validatePayment = async (data: {
  reference: string;
  matricule: string;
  id_tranche: number;
  montant_verse: number;
  mode_paiement: string;
}) => {
  const response = await client.post("/finance/validate", data);

  return response.data;
};

export const getStudentByMatricule = async (matricule: string) => {
  const response = await client.get(
    `/etudiant/matricule/${matricule}`
  );

  return response.data;
};