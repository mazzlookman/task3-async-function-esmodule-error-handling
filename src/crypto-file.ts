import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export class CryptoFile {
    static readonly algorithm: string = 'aes-256-cbc';
    static readonly ivLength: number = 16; // panjang IV (Initialization Vector)
    static readonly logDir: string = "./logs";

    static async logActivity(message: string): Promise<void> {
        const now = new Date();

        const formattedTime = `${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_${now.getMonth() + 1}_${now.getDate()}_${now.getFullYear()}`;
        const logFilePath = path.join(this.logDir, `${formattedTime}.log`);

        // memastikan bahwa direktori logs ada, jika tidak ada maka dibuat
        try {
            await fs.mkdir(this.logDir, { recursive: true });
        } catch (err) {
            console.error('Gagal membuat direktori logs: ', err)
        }

        // menambah pesan ke file log
        try {
            await fs.appendFile(logFilePath, `${new Date().toLocaleString()} - ${message}\n`);
        } catch (err) {
            console.error('Gagal menulis log: ', err)
        }
    }

    static async encryptFile(filePath: string, password: string): Promise<boolean> {
        try {
            await this.logActivity(`Mulai mengenkripsi file ${filePath}`);

            const fileContent = await fs.readFile(filePath);

            // membuat encryption key dari password, dengan panjang key: 32 byte
            const key = crypto.scryptSync(password, 'salt', 32);

            // generate random IV key, panjang 16 byte
            const iv = crypto.randomBytes(this.ivLength);

            // membuat object cipher untuk enkripsi dengan key dan IV
            const cipher = crypto.createCipheriv(this.algorithm, key, iv);

            // mengenkripsi plaintext dari file
            const encryptedData = Buffer.concat([cipher.update(fileContent), cipher.final()]);

            // ../logs/filename_encrypted.txt
            const encryptedFilePath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '_encrypted' + path.extname(filePath));

            // menggabungkan IV dan data terenkripsi menjadi satu buffer untuk disimpan
            const finalData = Buffer.concat([iv, encryptedData]);

            // save the encrypted file
            await fs.writeFile(encryptedFilePath, finalData);
            await this.logActivity(`Berhasil mengenkripsi file ${filePath} menjadi ${encryptedFilePath}`);
            console.log(`File '${filePath}' berhasil dienkripsi menjadi '${encryptedFilePath}'`);

            return true;
        } catch (err) {
            await this.logActivity(`Error ketika mengenkripsi file: ${(err as Error).message}`);
            console.error('Error:\n', (err as Error).message);

            return false;
        }
    }

    static async decryptFile(filePath: string, password: string): Promise<boolean> {
        try {
            await this.logActivity(`Mulai mendekripsi file ${filePath}`);

            const fileContentEncrypted = await fs.readFile(filePath);
            const key = crypto.scryptSync(password, 'salt', 32);

            // memisahkan IV dan original encrypted data dari encrypted data
            const iv = fileContentEncrypted.subarray(0, this.ivLength) // index 0-15
            const encryptedData = fileContentEncrypted.subarray(this.ivLength) // index 16-end

            const decipher = crypto.createDecipheriv(this.algorithm, key, iv)

            // try to decrypting data
            try {
                const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

                const decryptedFilePath = path.join(path.dirname(filePath), path.basename(filePath, '_encrypted' + path.extname(filePath)) + path.extname(filePath));
                await fs.writeFile(decryptedFilePath, decryptedData);

                await this.logActivity(`Berhasil mendekripsi file ${filePath} menjadi ${decryptedFilePath}`);
                console.log(`File '${filePath}' berhasil didekripsi menjadi '${decryptedFilePath}'`);

                const decryptedFileContent = await fs.readFile(decryptedFilePath, 'utf-8');
                console.log(`Isi file:\n`, decryptedFileContent);

                return true;
            } catch (authErr) {
                await this.logActivity('Error: Password yang dimasukkan salah atau file corrupt');
                console.error('Error: Password yang dimasukkan salah atau file corrupt');

                return false;
            }
        } catch (err) {
            await this.logActivity(`Error ketika mendekripsi file: ${(err as Error).message}`);
            console.error('Error:', (err as Error).message);

            return false;
        }
    }

    static async main(): Promise<void> {
        // mengambil argumen dari command line
        const [action, filePath, password] = process.argv.slice(2);

        if (!action || !filePath || !password) {
            console.error('Usage: ts-node index.ts <encrypt|decrypt> <file_path> <password>');
            return;
        }

        if (action === 'encrypt') {
            await this.encryptFile(filePath, password);
        } else if (action === 'decrypt') {
            await this.decryptFile(filePath, password);
        } else {
            console.error('Unknown action:', action);
        }
    }
}