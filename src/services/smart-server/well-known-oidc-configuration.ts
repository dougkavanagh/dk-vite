// http://localhost:8888/api/smart/.well-known/openid-configuration
import config from "./smart-server-config";
import { Request, Response } from "express";

export default (req: Request, res: Response) => {
  // req.protocol + "://" + req.get("host") + config.servicePath;

  const json = {
    // REQUIRED. URL using the https scheme with no query or fragment component that the OP asserts as
    // its Issuer Identifier. If Issuer discovery is supported (see Section 2), this value MUST be identical
    // to the issuer value returned by WebFinger. This also MUST be identical to the iss Claim value in
    // ID Tokens issued from this Issuer.
    issuer: `${config.fhirUrl}`,

    // REQUIRED. URL of the OPs JSON Web Key Set [JWK] document. This contains the signing key(s) the RP uses
    // to validate signatures from the OP. The JWK Set MAY also contain the Server's encryption key(s),
    // which are used by RPs to encrypt requests to the Server. When both signing and encryption keys are made
    // available, a use (Key Use) parameter value is REQUIRED for all keys in the referenced JWK Set to indicate
    // each keys intended usage. Although some algorithms allow the same key to be used for both signatures and
    // encryption, doing so is NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY be used to provide
    // X.509 representations of keys provided. When used, the bare key values MUST still be present and MUST match
    // those in the certificate.
    jwks_uri: `${config.keysUrl}`,

    // REQUIRED, URL to the OAuth2 authorization endpoint.
    authorization_endpoint: `${config.authUrl}`,

    // REQUIRED, URL to the OAuth2 token endpoint.
    token_endpoint: `${config.tokenUrl}`,

    // REQUIRED. JSON array containing a list of the Subject Identifier types that this OP supports. Valid types include pairwise and public.
    subject_types_supported: ["public"],
  };

  res.json(json);
};
