import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  instance: axiosInstance,

  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config);
  },
  post: <T>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },
  put: <T>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },

  patch: <T>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(url, data, config);
  },

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },
};
