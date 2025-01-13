import { useMutation } from "@tanstack/react-query";

export const useDiscordConnect = () => {
  return useMutation({
    mutationKey: ["useDiscordConnect"],
    mutationFn: async () => {
      const response = await fetch("/api/discord", {
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
