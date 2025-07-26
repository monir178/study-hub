import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

interface QueryConfig<TData> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  options?: Omit<UseQueryOptions<TData, AxiosError>, "queryKey" | "queryFn">;
}

export function useApiQuery<TData>({
  queryKey,
  queryFn,
  options,
}: QueryConfig<TData>): UseQueryResult<TData, AxiosError> {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
