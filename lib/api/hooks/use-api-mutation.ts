import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
  error?: string;
}

interface MutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ErrorResponse>, TVariables>,
    "mutationFn"
  >;
  successMessage?: string;
}

export function useApiMutation<TData, TVariables>({
  mutationFn,
  options,
  successMessage,
}: MutationConfig<TData, TVariables>) {
  return useMutation({
    mutationFn,
    onSuccess: async (data, variables, context) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      options?.onSuccess?.(data, variables, context);
    },
    onError: async (error: AxiosError<ErrorResponse>, variables, context) => {
      // Extract error message from API response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred";
      toast.error(errorMessage);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
