import { v4 as uuid } from "uuid";

export const generateMessageToSign = (nonce?: string) => {
  return {
    // TODO signature message
    message: `This signature is required to prove that you are the owner of this account. nonce: ${
      nonce || uuid()
    }`,
  };
};
