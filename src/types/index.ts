import type { KeyLike } from "jose";

interface formData {
  username?: string;
  email: string;
  password: string;
}

type validateResult =
  | {
      success: true;
      data: formData;
    }
  | {
      success: false;
      errors: { field: string; message: string }[];
    };

type jwtConfig = {
  signPrivateKey: KeyLike;
  signPublicKey: KeyLike;
  encryptPrivateKey: KeyLike;
  encryptPublicKey: KeyLike;
};

type databaseConfig = {
  dbConnectionUrl: string;
  dbAuthToken: string;
};

export type { formData, validateResult, jwtConfig, databaseConfig };
