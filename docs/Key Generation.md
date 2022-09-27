# How to Generate Public and Private Keys

The .pem files are generated as follows:

```
openssl genpkey -algorithm RSA -aes-256-cbc -outform PEM -out private_key.pem -pkeyopt rsa_keygen_bits:2048
chmod 400 private_key.pem
openssl rsa -in private_key.pem -pubout -out public_key.pem
openssl rsa -in private_key.pem -out private_key_unencrypted.pem
```

Base64 encode each key (eg with a SublimeText extension)
Paste the public key into dev.env
For the private key, use netlify dev:env set to paste it in or use the netlify web UI
