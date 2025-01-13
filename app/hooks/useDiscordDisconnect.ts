import { useMutation } from "@tanstack/react-query";

export const useDiscordDisconnect = () => {
  return useMutation({
    mutationKey: ["discordDisconnect"],
    mutationFn: async () => {
      const response = await fetch("/api/discord/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as { ok: boolean };
    },
  });
};
