import { decrypt as aesDecrypt, encrypt as aesEncrypt } from 'ethereum-cryptography/aes';
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import { HDKey } from 'ethereum-cryptography/hdkey';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { pbkdf2 } from 'ethereum-cryptography/pbkdf2';
import { getRandomBytes } from 'ethereum-cryptography/random';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { bytesToUtf8, hexToBytes, toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

export const TRANSFER_FEE = 0.05;

export interface WalletAccount {
  address: string;
  balance: number;
  created_at: string;
}

export interface WalletData {
  mnemonicPhrase: string;
  privateKey: string;
  publicKey: string;
  address: string;
}
export interface EncryptedWallet {
  encryptedData: string;
  salt: string;
  iv: string;
  address: string;
  version: string;
}

export const generateMnemonicPhrase = () => {
  try {
    const mnemonicPhrase = generateMnemonic(wordlist);

    return mnemonicPhrase;
  } catch (error: any) {
    throw new Error(`Mnemonic generation failed: ${JSON.stringify(error)}`);
  }
};

const getAddress = (publicKey: Uint8Array<ArrayBufferLike>) => {
  try {
    /**
     * Slice first bytes of uncompressed public key (0x04) before hashing
     */
    const publicKeyBytes = publicKey.slice(1);

    const hash = keccak256(publicKeyBytes);

    const address = `0x${toHex(hash.slice(-20))}`;

    return address;
  } catch (error: any) {
    throw new Error(`Getting Ethereum address failed: ${JSON.stringify(error)}`);
  }
};

const createWalletFromMnemonic = async (mnemonicPhrase: string, accountIndex?: number) => {
  try {
    const isValidMnemonicPhrase = validateMnemonic(mnemonicPhrase, wordlist);

    if (!isValidMnemonicPhrase) {
      throw new Error('Invalid mnemonic phrase');
    }

    const seed = await mnemonicToSeed(mnemonicPhrase);

    const hdKey = HDKey.fromMasterSeed(seed);

    const derivationPath = `m/44'/60'/0'/0/${accountIndex || 0}`;

    const derivedKey = hdKey.derive(derivationPath);

    if (!derivedKey.privateKey) {
      throw new Error('Failed to derive private key');
    }

    const privateKey = derivedKey.privateKey;

    if (!derivedKey.publicKey) {
      throw new Error('Failed to derive private key');
    }

    const publicKey = derivedKey.publicKey;

    const address = getAddress(publicKey);

    return {
      mnemonicPhrase,
      privateKey: `0x${toHex(privateKey)}`,
      publicKey: `0x${toHex(publicKey)}`,
      address,
    };
  } catch (error: any) {
    throw new Error(`Wallet creation failed: ${JSON.stringify(error)}`);
  }
};

const deriveKeyFromPassword = async (password: string, salt: Uint8Array<ArrayBufferLike>, iterations?: number) => {
  try {
    const passwordBuffer = utf8ToBytes(password);

    const key = await pbkdf2(passwordBuffer, salt, iterations || 100_000, 16, 'sha256');

    return key;
  } catch (error: any) {
    throw new Error(`Key derivation creation failed: ${JSON.stringify(error)}`);
  }
};

const encryptWallet = async (walletData: WalletData, password: string) => {
  try {
    const salt = await getRandomBytes(32);
    const iv = await getRandomBytes(16);

    const key = await deriveKeyFromPassword(password, salt);

    const dataToEncrypt = utf8ToBytes(
      JSON.stringify({
        mnemonicPhrase: walletData.mnemonicPhrase,
        privateKey: walletData.privateKey,
        publicKey: walletData.publicKey,
        address: walletData.address,
      }),
    );

    const encryptedData = aesEncrypt(dataToEncrypt, key, iv);

    return {
      encryptedData: `0x${toHex(encryptedData)}`,
      salt: `0x${toHex(salt)}`,
      iv: `0x${toHex(iv)}`,
      address: walletData.address,
      version: '1.0',
    };
  } catch (error: any) {
    throw new Error(`Wallet encryption failed: ${JSON.stringify(error)}`);
  }
};

const decryptWallet = async (encryptedWallet: EncryptedWallet, password: string) => {
  try {
    const encryptedData = hexToBytes(encryptedWallet.encryptedData.slice(2));
    const salt = hexToBytes(encryptedWallet.salt.slice(2));
    const iv = hexToBytes(encryptedWallet.iv.slice(2));

    const key = await deriveKeyFromPassword(password, salt);

    const decryptedData = aesDecrypt(encryptedData, key, iv);

    const walletData: WalletData = JSON.parse(bytesToUtf8(decryptedData));

    return walletData;
  } catch (error: any) {
    throw new Error(`Wallet decryption failed: ${JSON.stringify(error)}`);
  }
};

export const createEncryptedWallet = async (mnemonicPhrase: string, password: string, accountIndex?: number) => {
  try {
    const wallet = await createWalletFromMnemonic(mnemonicPhrase, accountIndex || 0);

    const encryptedWallet = await encryptWallet(wallet, password);

    return encryptedWallet;
  } catch (error: any) {
    throw new Error(`Encrypted wallet creation failed: ${JSON.stringify(error)}`);
  }
};

export const restoreWalletFromEncrypted = async (encryptedWallet: EncryptedWallet, password: string) => {
  try {
    const decryptedWallet = await decryptWallet(encryptedWallet, password);

    return decryptedWallet;
  } catch (error: any) {
    throw new Error(`Wallet restoration failed: ${JSON.stringify(error)}`);
  }
};

export const recoverWalletFromMnemonic = async (mnemonicPhrase: string, newPassword: string, accountIndex?: number) => {
  try {
    const recoveredWallet = await createWalletFromMnemonic(mnemonicPhrase, accountIndex || 0);

    const encryptedWallet = await encryptWallet(recoveredWallet, newPassword);

    return encryptedWallet;
  } catch (error: any) {
    throw new Error(`Wallet recovery failed: ${JSON.stringify(error)}`);
  }
};

export const replaceEncryptedWallet = async (
  oldEncryptedWallet: EncryptedWallet,
  mnemonicPhrase: string,
  newPassword: string,
) => {
  try {
    const walletFromMnemonic = await createWalletFromMnemonic(mnemonicPhrase);

    if (walletFromMnemonic.address.toLowerCase() !== oldEncryptedWallet.address.toLowerCase()) {
      throw new Error('Mnemonic does not match the encrypted wallet address');
    }

    const newEncryptedWallet = await encryptWallet(walletFromMnemonic, newPassword);

    return newEncryptedWallet;
  } catch (error: any) {
    throw new Error(`Change password existing wallet failed: ${JSON.stringify(error)}`);
  }
};

const hashMessage = (message: string) => {
  try {
    const messageWithprefix = `\x19Ethereum Signed Message:\n${message.length}${message}`;
    const messageWithprefixBytes = utf8ToBytes(messageWithprefix);
    const messageWithPrefixHash = keccak256(messageWithprefixBytes);

    return messageWithPrefixHash;
  } catch (error: any) {
    throw new Error(`Hashing message failed: ${JSON.stringify(error)}`);
  }
};

export const signMessage = (message: string, privateKey: string) => {
  try {
    const messageHash = hashMessage(message);

    const signature = secp256k1.sign(messageHash, hexToBytes(privateKey.slice(2)));

    return {
      message,
      messageHash: `0x${toHex(messageHash)}`,
      signature: `0x${toHex(signature.toCompactRawBytes())}`,
      recovery: signature.recovery,
    };
  } catch (error: any) {
    throw new Error(`Transaction signing failed: ${JSON.stringify(error)}`);
  }
};

const recoverPublicKey = (messageHash: string, signature: string, recovery: number) => {
  try {
    const publicKey = secp256k1.Signature.fromCompact(hexToBytes(signature))
      .addRecoveryBit(recovery)
      .recoverPublicKey(messageHash)
      .toRawBytes();

    return publicKey;
  } catch (error: any) {
    throw new Error(`Public key recovery failed: ${JSON.stringify(error)}`);
  }
};

export const getAddressFromSignature = (message: string, messageHash: string, signature: string, recovery: number) => {
  try {
    const computedHash = hashMessage(message);

    if (`0x${toHex(computedHash)}` !== messageHash) {
      throw new Error('Invalid message hash');
    }

    const messageHashHex = messageHash.slice(2);
    const signatureHashHex = signature.slice(2);

    const publicKey = recoverPublicKey(messageHashHex, signatureHashHex, recovery);

    const isValid = secp256k1.verify(signatureHashHex, messageHashHex, toHex(publicKey));

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const address = getAddress(publicKey);

    return address;
  } catch (error: any) {
    throw new Error(`Signature verification failed: ${JSON.stringify(error)}`);
  }
};
