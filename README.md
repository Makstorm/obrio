# 🧱 Obrio Project

A scalable backend application built with NestJS and designed around a microservice architecture.  
It leverages asynchronous communication and delayed task scheduling to coordinate background processes seamlessly.

The system is modular, secure, and production-ready — well-suited for event-driven workflows and real-world business logic.

---

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Makstorm/obrio.git
cd obrio
```

### 2. Environment Configuration

Create a `.env` file in the `apps/auth` of the project with the following structure:

```env
# .env

# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/auth"

# JWT Auth
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="3600"

# Application
HTTP_PORT=3000
RABBITMQ_URL=amqp://rabbitmq:5672
NOTIFICATIONS_HOST=notifications
NOTIFICATIONS_PORT=3003
```

To run migrations locally create a `.env.local` file in the `apps/auth` of the project with the following structure:

```env
# .env.local

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth"
```

Create a `.env` file in the `apps/notifications` of the project with the following structure:

```env
# .env

# Application
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_URL=amqp://rabbitmq:5672
WEBHOOK_SITE_URL=write you url from the https://webhook.site
```

### 3. Start the application

From the root folder run following command (demands installed docker)

```bash
docker-compose up
```

## Api overview

After the successful containers initiation you will be able to reach the following endpoint from `localhost:3000`

#### POST `/users`

**Request Body:**

```json
{
  "email": "youremail@example.com",
  "password": "strongpassword",
  "name": "yourname"
}
```

**Response status 201:**

```json
{
  "id": 15,
  "email": "mxm.horobets+8@gmail.com",
  "password": "$2b$10$9hNItLeAu8ecqKpnFZLH3.j.UPYWGRYcTOA.cxl3RZkBaILO85duK",
  "name": "Maksym Horobets 3",
  "createdAt": "2025-05-04T04:45:52.039Z",
  "updatedAt": "2025-05-04T04:45:52.039Z"
}
```

**Response status 400:**

```json
{
  "message": ["name must be a string"],
  "error": "Bad Request",
  "statusCode": 400
}
```

and similar if validations fail

**Response status 422:**

```json
{
  "message": "User with email mxm.horobets+7@gmail.com already exists",
  "error": "Unprocessable Entity",
  "statusCode": 422
}
```

#### POST `/auth/login`

**Request Body:**

```json
{
  "email": "youremail@example.com",
  "password": "strongpassword",
  "name": "yourname"
}
```

**Response status 201:**

```json
{
  "id": 15,
  "email": "mxm.horobets+8@gmail.com",
  "password": "$2b$10$9hNItLeAu8ecqKpnFZLH3.j.UPYWGRYcTOA.cxl3RZkBaILO85duK",
  "name": "Maksym Horobets 3",
  "createdAt": "2025-05-04T04:45:52.039Z",
  "updatedAt": "2025-05-04T04:45:52.039Z"
}
```

**Response status 401:**

```json
{
  "response": {
    "message": "Invalid credentials",
    "error": "Unauthorized",
    "statusCode": 401
  },
  "status": 401,
  "options": {},
  "message": "Invalid credentials",
  "name": "UnauthorizedException"
}
```

After the successful response from `/auth/login` there will be attached a cookies with key `Authentication` and jwt token value which is require to get acces to the protected routes like:

#### GET `/users`

Require the `Authentication` cookie

**Response status 200:**

```json
{
  "id": 15,
  "email": "mxm.horobets+8@gmail.com",
  "password": "$2b$10$9hNItLeAu8ecqKpnFZLH3.j.UPYWGRYcTOA.cxl3RZkBaILO85duK",
  "name": "Maksym Horobets 3",
  "createdAt": "2025-05-04T04:45:52.039Z",
  "updatedAt": "2025-05-04T04:45:52.039Z"
}
```

**Response status 401:**

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

## 🔔 Notifications Flow

After a successful response from `POST /users`, the application sends a message via **RabbitMQ** to the **notifications microservice**.

The notifications microservice handles this event by registering a **delayed job** using the **BullMQ** module. This job is stored in Redis and scheduled to run **24 hours later**.

Once the delay has passed, the job is executed and triggers a **mock push notification** to the API specified in the `WEBHOOK_SITE_URL` environment variable.

## ✅ Summary

I really enjoyed developing this project and putting it all together.  
Hope you found it interesting or helpful — did you like it?

Thanks for checking it out!
