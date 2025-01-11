import { useMutation } from "@tanstack/react-query";

export const useTwitterDisconnect = () => {
  return useMutation({
    mutationKey: ["twitterDisconnect"],
    mutationFn: async () => {
      const response = await fetch("/api/twitter/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as { ok: boolean };
    },
  });
};
