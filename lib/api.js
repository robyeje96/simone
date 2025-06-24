import axios from "axios";

export const getCryptoData = async () => {
  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur";
  const { data } = await axios.get(url);
  return data;
};
