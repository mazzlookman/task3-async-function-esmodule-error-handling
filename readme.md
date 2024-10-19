# [Task 3] NodeJS, Async Function, ES Module, Error Handling

## Task:
1. Enkripsi File: Menerima path file dan menghasilkan file terenkripsi
   dengan password. ✅
2. Dekripsi File: Menerima file terenkripsi dan menghasilkan file asli. ✅
3. Logging: Semua aktivitas dicatat ke file log. ✅

## Features used:
1. NodeJS File System (fs)
2. NodeJS Path
3. NodeJS Crypto
4. Asynchronous Function
5. Error Handling

## How to run?
### Install all dependencies first:
```shell
npm install
```

### Run the app via CLI:

-  Perfome file encryption:
```shell
# cli syntax:
npm run enc path/to/file.ext yourPassword

# example in this app:
npm run enc resources/example.txt correctPassword
```

Result will be:<br>
![encrypted](https://ik.imagekit.io/aqibmoh/Screenshot%202024-10-19%20221333.png?updatedAt=1729351121982)

- Perfome file decryption:
```shell
# cli syntax:
npm run dec path/to/file_encrypted.ext yourPassword

# example in this app:
npm run dec resources/example_encrypted.txt correctPassword
```

Result will be:<br>
![decrypted](https://ik.imagekit.io/aqibmoh/Screenshot%202024-10-19%20221636.png?updatedAt=1729351121961)

- Run the unit test:
```shell
npm run test tests/main.test.ts
```
Result will be:<br>
![unit-test](https://ik.imagekit.io/aqibmoh/unit-test.png?updatedAt=1729350579424)

**Note:** <br>
If the file path is not found or the password is incorrect when decrypting,
an error message will appear in the console.

**Such as:**<br>
- Wrong password:
![wrong-password](https://ik.imagekit.io/aqibmoh/Screenshot%202024-10-19%20221719.png?updatedAt=1729351121939)

- File path is not found:
![path-file-notfound](https://ik.imagekit.io/aqibmoh/Screenshot%202024-10-19%20221546.png?updatedAt=1729351121961)
## Where do I see the log?
All logs from the application during the encryption and decryption process,
both failed and successfull will go to a file located in the `.logs` folder.

Result will be:<br>
![logs](https://ik.imagekit.io/aqibmoh/Screenshot%202024-10-19%20223045.png?updatedAt=1729351883090)

Thanks ✨