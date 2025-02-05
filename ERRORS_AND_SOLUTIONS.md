# Fixing "Error Starting Userland Proxy: Listen TCP4 0.0.0.0:5432: Bind: Address Already in Use"

## Introduction
When working with PostgreSQL in Docker, you might encounter the error:

```bash
Error response from daemon: driver failed programming external connectivity on endpoint nodejs-app-test-db-1 (64f931b2ed42f905b783f10f0c8ae5b7ce0142065ec869bedbd2b6e504b22a34): Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use
```

This error occurs because another service is already using port **5432**, which is PostgreSQL's default port. The conflict happens when a PostgreSQL instance is running on your host machine while you try to start a PostgreSQL container that binds to the same port.

## Solution
### 1️⃣ Check If PostgreSQL Is Running on the Host
Before running your Docker container, verify if PostgreSQL is active on your host:

```bash
sudo systemctl status postgresql
```

If it is running, PostgreSQL is already using port 5432.

### 2️⃣ Stop and Disable PostgreSQL (If Not Needed on Host)
If you only need PostgreSQL inside Docker, stop the system service:

```bash
sudo systemctl stop postgresql
sudo systemctl disable postgresql
```

Then, restart your Docker container.

### 3️⃣ Change PostgreSQL Port in Docker
If you need PostgreSQL both on the host and in Docker, change the container's port mapping.

#### **Using `docker run`**
```bash
docker run -d --name my_postgres -p 5433:5432 postgres
```
This maps **port 5432 inside the container** to **port 5433 on the host**, avoiding conflicts.

#### **Using `docker-compose.yml`**
Modify the `ports` section in `docker-compose.yml`:
```yaml
services:
  db:
    image: postgres
    restart: always
    ports:
      - "5433:5432"  # Change host port to 5433
```
Then, update your `.env` file:
```env
DATABASE_URL=postgres://bankolejohn:your_db_password@db:5433/mydatabase
```
Restart your app to apply changes.

### 4️⃣ Find and Kill Any Process Using Port 5432
If you're unsure what’s using the port, find and terminate the process:

```bash
sudo lsof -i :5432
```
This will return a process ID (PID). Kill it with:

```bash
sudo kill -9 <PID>
```
Then, retry starting your PostgreSQL container.

## Conclusion
Port conflicts are common when working with Docker and local services. By checking running services, changing ports, or stopping unnecessary processes, you can resolve the **"address already in use"** error and ensure smooth PostgreSQL deployment in Docker.

Let me know in the comments if you have any questions! 🚀

