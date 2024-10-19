import {decryptFile, encryptFile} from "../src/main";

describe("Encrypt and Decrypt Test", () => {
    it("should can encrypt", async () => {
        const is_encrypted = await encryptFile("./resources/example.txt", "correctPassword");

        expect(is_encrypted).toBe(true);
    });

    it("should can't encrypt (file not found)", async () => {
        const is_encrypted = await encryptFile("./resources/notFound.txt", "correctPassword");

        expect(is_encrypted).toBe(false);
    });

    it("should can decrypt", async () => {
        const is_decrypted = await decryptFile("./resources/example_encrypted.txt", "correctPassword");

        expect(is_decrypted).toBe(true);
    });

    it("should can't decrypt (wrong password)", async () => {
        const is_decrypted = await decryptFile("./resources/example_encrypted.txt", "wrongPassword");

        expect(is_decrypted).toBe(false);
    });
});