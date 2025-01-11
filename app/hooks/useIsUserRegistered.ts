import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";

export const useIsUserRegistered = (address?: string) => {
  return useQuery({
    queryKey: ["isUserRegistered", address],
    queryFn: async () => {
      const response = await fetch(`/api/sign-read?address=${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return (await response.json()) as {
        registered: boolean;
      };
    },
    enabled: !!address && isAddress(address),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
