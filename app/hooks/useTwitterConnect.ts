import { useMutation } from "@tanstack/react-query";

export const useTwitterConnect = () => {
  return useMutation({
    mutationKey: ["twitterConnect"],
    mutationFn: async () => {
      const response = await fetch("/api/twitter", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return (await response.json()) as {
        url: string;
      };
    },
  });
};
