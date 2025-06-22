# InRoom
=======
## Get started

1. Install dependencies

   ```bash
   npm install
   ```
2. Configure the database

   2.1 Setup your postgres with a "HoteisWEB" database
   
   2.2 Import the .sql files inside "InRoom-db"
   
   ```bash
    psql -U seu_usuario -d HoteisWEB -f caminho/para/arquivo.sql
   ```
   2.3 Configure the database Pool in server.js
   
4. Start the app

   ```bash
    npx expo start
   ```

5. Start the express backend in another terminal
   
   ```bash
    node InRoom-db/server.js
   ``` 
