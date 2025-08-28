import { ProvinceResponse } from "./types";

export async function getProvince() {
  try {
    const res = await fetch('https://provinces.open-api.vn/api/v1/');
    if (!res.ok) {
      throw new Error('Failed to fetch provinces');
    }

    const data = await res.json();

    return data as ProvinceResponse[];
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
}