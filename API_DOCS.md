# SOC Simulation API Documentation

Base URL: `http://localhost:5000/api`

## Table of Contents

- [Authentication](#authentication)
  - [Register](#post-apiauthregister)
  - [Login](#post-apiauthlogin)
  - [Get Current User](#get-apiauthme)
- [Incidents](#incidents)
  - [Get All Incidents](#get-apiincidents)
  - [Get Incident by ID](#get-apiincidentsid)
  - [Create Incident](#post-apiincidents)
  - [Update Incident](#put-apiincidentsid)
  - [Resolve Incident](#patch-apiincidentsidresolve)
  - [Delete Incident](#delete-apiincidentsid)
- [Dashboard](#dashboard)
  - [Get Dashboard Stats](#get-apidashboardstats)

---

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

### POST /api/auth/register

Register a new user account.

| Property          | Value                |
| ----------------- | -------------------- |
| **Method**        | `POST`               |
| **Endpoint**      | `/api/auth/register` |
| **Auth Required** | No                   |
| **Content-Type**  | `application/json`   |

#### Request Body

| Field      | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| `name`     | string | Yes      | User's full name               |
| `email`    | string | Yes      | User's email address           |
| `password` | string | Yes      | Password (min 6 characters)    |
| `role`     | string | No       | User role (default: "analyst") |

#### Request Example

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "analyst"
}
```

#### Response Example (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "analyst",
      "createdAt": "2026-01-21T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

| Status Code | Description      | Response                                                                    |
| ----------- | ---------------- | --------------------------------------------------------------------------- |
| 400         | Validation Error | `{ "success": false, "message": "Please provide all required fields" }`     |
| 400         | Invalid Email    | `{ "success": false, "message": "Please provide a valid email" }`           |
| 400         | Weak Password    | `{ "success": false, "message": "Password must be at least 6 characters" }` |
| 409         | Email Exists     | `{ "success": false, "message": "User already exists with this email" }`    |
| 500         | Server Error     | `{ "success": false, "message": "Internal server error" }`                  |

---

### POST /api/auth/login

Authenticate user and receive JWT token.

| Property          | Value              |
| ----------------- | ------------------ |
| **Method**        | `POST`             |
| **Endpoint**      | `/api/auth/login`  |
| **Auth Required** | No                 |
| **Content-Type**  | `application/json` |

#### Request Body

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `email`    | string | Yes      | User's email address |
| `password` | string | Yes      | User's password      |

#### Request Example

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "analyst",
      "lastLogin": "2026-01-21T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTFiMmMzZDRlNWY2ZzdoOGk5ajBrMSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.abc123xyz"
  }
}
```

#### Error Responses

| Status Code | Description         | Response                                                               |
| ----------- | ------------------- | ---------------------------------------------------------------------- |
| 400         | Missing Fields      | `{ "success": false, "message": "Please provide email and password" }` |
| 401         | Invalid Credentials | `{ "success": false, "message": "Invalid email or password" }`         |
| 403         | Account Disabled    | `{ "success": false, "message": "Account has been disabled" }`         |
| 500         | Server Error        | `{ "success": false, "message": "Internal server error" }`             |

---

### GET /api/auth/me

Get currently authenticated user's profile.

| Property          | Value          |
| ----------------- | -------------- |
| **Method**        | `GET`          |
| **Endpoint**      | `/api/auth/me` |
| **Auth Required** | Yes            |

#### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "analyst",
    "createdAt": "2026-01-21T10:30:00.000Z",
    "lastLogin": "2026-01-21T14:45:00.000Z"
  }
}
```

#### Error Responses

| Status Code | Description    | Response                                                              |
| ----------- | -------------- | --------------------------------------------------------------------- |
| 401         | No Token       | `{ "success": false, "message": "Access denied. No token provided" }` |
| 401         | Invalid Token  | `{ "success": false, "message": "Invalid or expired token" }`         |
| 404         | User Not Found | `{ "success": false, "message": "User not found" }`                   |
| 500         | Server Error   | `{ "success": false, "message": "Internal server error" }`            |

---

## Incidents

---

### GET /api/incidents

Retrieve all incidents with optional filtering and pagination.

| Property          | Value            |
| ----------------- | ---------------- |
| **Method**        | `GET`            |
| **Endpoint**      | `/api/incidents` |
| **Auth Required** | No               |

#### Query Parameters

| Parameter    | Type    | Default     | Description                                                                                    |
| ------------ | ------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `severity`   | string  | -           | Filter by severity: `low`, `medium`, `high`, `critical`                                        |
| `attackType` | string  | -           | Filter by attack type: `malware`, `phishing`, `ddos`, `intrusion`, `data_breach`, `ransomware` |
| `status`     | string  | -           | Filter by status: `open`, `investigating`, `resolved`, `closed`                                |
| `page`       | integer | 1           | Page number for pagination                                                                     |
| `limit`      | integer | 10          | Number of results per page (max: 100)                                                          |
| `search`     | string  | -           | Search in title and description                                                                |
| `sortBy`     | string  | `createdAt` | Field to sort by                                                                               |
| `sortOrder`  | string  | `desc`      | Sort order: `asc` or `desc`                                                                    |

#### Request Example

```
GET /api/incidents?severity=high&status=open&page=1&limit=10&search=ransomware
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "incidents": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "title": "Ransomware Attack Detected",
        "description": "Suspicious ransomware activity detected on server-01",
        "severity": "high",
        "attackType": "ransomware",
        "status": "open",
        "sourceIP": "192.168.1.105",
        "targetIP": "10.0.0.50",
        "affectedSystems": ["server-01", "workstation-15"],
        "assignedTo": {
          "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
          "name": "Jane Smith"
        },
        "createdAt": "2026-01-21T10:30:00.000Z",
        "updatedAt": "2026-01-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Error Responses

| Status Code | Description   | Response                                                    |
| ----------- | ------------- | ----------------------------------------------------------- |
| 400         | Invalid Query | `{ "success": false, "message": "Invalid severity value" }` |
| 500         | Server Error  | `{ "success": false, "message": "Internal server error" }`  |

---

### GET /api/incidents/:id

Retrieve a specific incident by ID.

| Property          | Value                |
| ----------------- | -------------------- |
| **Method**        | `GET`                |
| **Endpoint**      | `/api/incidents/:id` |
| **Auth Required** | No                   |

#### URL Parameters

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `id`      | string | Incident ID (MongoDB ObjectId) |

#### Request Example

```
GET /api/incidents/64a1b2c3d4e5f6g7h8i9j0k1
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Ransomware Attack Detected",
    "description": "Suspicious ransomware activity detected on server-01. Initial analysis shows encrypted files in shared directories.",
    "severity": "high",
    "attackType": "ransomware",
    "status": "investigating",
    "sourceIP": "192.168.1.105",
    "targetIP": "10.0.0.50",
    "affectedSystems": ["server-01", "workstation-15", "nas-02"],
    "indicators": {
      "iocs": ["suspicious.exe", "ransom_note.txt"],
      "cves": ["CVE-2024-1234"]
    },
    "timeline": [
      {
        "action": "created",
        "timestamp": "2026-01-21T10:30:00.000Z",
        "user": "system"
      },
      {
        "action": "status_changed",
        "timestamp": "2026-01-21T11:00:00.000Z",
        "user": "Jane Smith",
        "details": "Changed status from 'open' to 'investigating'"
      }
    ],
    "assignedTo": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    },
    "createdBy": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "name": "System Alert"
    },
    "createdAt": "2026-01-21T10:30:00.000Z",
    "updatedAt": "2026-01-21T11:00:00.000Z"
  }
}
```

#### Error Responses

| Status Code | Description       | Response                                                        |
| ----------- | ----------------- | --------------------------------------------------------------- |
| 400         | Invalid ID Format | `{ "success": false, "message": "Invalid incident ID format" }` |
| 404         | Not Found         | `{ "success": false, "message": "Incident not found" }`         |
| 500         | Server Error      | `{ "success": false, "message": "Internal server error" }`      |

---

### POST /api/incidents

Create a new incident.

| Property          | Value              |
| ----------------- | ------------------ |
| **Method**        | `POST`             |
| **Endpoint**      | `/api/incidents`   |
| **Auth Required** | Yes                |
| **Content-Type**  | `application/json` |

#### Request Body

| Field             | Type   | Required | Description                                                             |
| ----------------- | ------ | -------- | ----------------------------------------------------------------------- |
| `title`           | string | Yes      | Incident title                                                          |
| `description`     | string | Yes      | Detailed description                                                    |
| `severity`        | string | Yes      | `low`, `medium`, `high`, `critical`                                     |
| `attackType`      | string | Yes      | `malware`, `phishing`, `ddos`, `intrusion`, `data_breach`, `ransomware` |
| `sourceIP`        | string | No       | Source IP address                                                       |
| `targetIP`        | string | No       | Target IP address                                                       |
| `affectedSystems` | array  | No       | List of affected systems                                                |
| `indicators`      | object | No       | IOCs and CVEs                                                           |
| `assignedTo`      | string | No       | User ID to assign                                                       |

#### Request Example

```json
{
  "title": "Phishing Campaign Detected",
  "description": "Multiple employees received phishing emails attempting to harvest credentials",
  "severity": "medium",
  "attackType": "phishing",
  "sourceIP": "203.0.113.50",
  "affectedSystems": ["mail-server", "workstation-01", "workstation-02"],
  "indicators": {
    "iocs": ["malicious-link.com", "fake-login.net"],
    "cves": []
  },
  "assignedTo": "64a1b2c3d4e5f6g7h8i9j0k2"
}
```

#### Response Example (201 Created)

```json
{
  "success": true,
  "message": "Incident created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "title": "Phishing Campaign Detected",
    "description": "Multiple employees received phishing emails attempting to harvest credentials",
    "severity": "medium",
    "attackType": "phishing",
    "status": "open",
    "sourceIP": "203.0.113.50",
    "affectedSystems": ["mail-server", "workstation-01", "workstation-02"],
    "indicators": {
      "iocs": ["malicious-link.com", "fake-login.net"],
      "cves": []
    },
    "assignedTo": "64a1b2c3d4e5f6g7h8i9j0k2",
    "createdBy": "64a1b2c3d4e5f6g7h8i9j0k1",
    "createdAt": "2026-01-21T15:00:00.000Z",
    "updatedAt": "2026-01-21T15:00:00.000Z"
  }
}
```

#### Error Responses

| Status Code | Description         | Response                                                                                             |
| ----------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| 400         | Missing Fields      | `{ "success": false, "message": "Title, description, severity, and attack type are required" }`      |
| 400         | Invalid Severity    | `{ "success": false, "message": "Invalid severity value. Must be: low, medium, high, or critical" }` |
| 400         | Invalid Attack Type | `{ "success": false, "message": "Invalid attack type" }`                                             |
| 401         | Unauthorized        | `{ "success": false, "message": "Access denied. No token provided" }`                                |
| 500         | Server Error        | `{ "success": false, "message": "Internal server error" }`                                           |

---

### PUT /api/incidents/:id

Update an existing incident.

| Property          | Value                |
| ----------------- | -------------------- |
| **Method**        | `PUT`                |
| **Endpoint**      | `/api/incidents/:id` |
| **Auth Required** | Yes                  |
| **Content-Type**  | `application/json`   |

#### URL Parameters

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `id`      | string | Incident ID (MongoDB ObjectId) |

#### Request Body

| Field             | Type   | Required | Description                                   |
| ----------------- | ------ | -------- | --------------------------------------------- |
| `title`           | string | No       | Updated title                                 |
| `description`     | string | No       | Updated description                           |
| `severity`        | string | No       | `low`, `medium`, `high`, `critical`           |
| `attackType`      | string | No       | Attack type                                   |
| `status`          | string | No       | `open`, `investigating`, `resolved`, `closed` |
| `sourceIP`        | string | No       | Source IP address                             |
| `targetIP`        | string | No       | Target IP address                             |
| `affectedSystems` | array  | No       | List of affected systems                      |
| `indicators`      | object | No       | IOCs and CVEs                                 |
| `assignedTo`      | string | No       | User ID to assign                             |
| `notes`           | string | No       | Additional notes                              |

#### Request Example

```json
{
  "status": "investigating",
  "severity": "high",
  "notes": "Escalating severity due to additional affected systems discovered",
  "affectedSystems": [
    "mail-server",
    "workstation-01",
    "workstation-02",
    "workstation-03",
    "workstation-04"
  ]
}
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "message": "Incident updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "title": "Phishing Campaign Detected",
    "description": "Multiple employees received phishing emails attempting to harvest credentials",
    "severity": "high",
    "attackType": "phishing",
    "status": "investigating",
    "sourceIP": "203.0.113.50",
    "affectedSystems": [
      "mail-server",
      "workstation-01",
      "workstation-02",
      "workstation-03",
      "workstation-04"
    ],
    "notes": "Escalating severity due to additional affected systems discovered",
    "timeline": [
      {
        "action": "created",
        "timestamp": "2026-01-21T15:00:00.000Z",
        "user": "John Doe"
      },
      {
        "action": "updated",
        "timestamp": "2026-01-21T16:30:00.000Z",
        "user": "John Doe",
        "details": "Severity changed from 'medium' to 'high'. Status changed to 'investigating'"
      }
    ],
    "updatedAt": "2026-01-21T16:30:00.000Z"
  }
}
```

#### Error Responses

| Status Code | Description       | Response                                                                                |
| ----------- | ----------------- | --------------------------------------------------------------------------------------- |
| 400         | Invalid ID Format | `{ "success": false, "message": "Invalid incident ID format" }`                         |
| 400         | Invalid Fields    | `{ "success": false, "message": "Invalid severity or status value" }`                   |
| 401         | Unauthorized      | `{ "success": false, "message": "Access denied. No token provided" }`                   |
| 403         | Forbidden         | `{ "success": false, "message": "You do not have permission to update this incident" }` |
| 404         | Not Found         | `{ "success": false, "message": "Incident not found" }`                                 |
| 500         | Server Error      | `{ "success": false, "message": "Internal server error" }`                              |

---

### PATCH /api/incidents/:id/resolve

Mark an incident as resolved.

| Property          | Value                        |
| ----------------- | ---------------------------- |
| **Method**        | `PATCH`                      |
| **Endpoint**      | `/api/incidents/:id/resolve` |
| **Auth Required** | Yes                          |
| **Content-Type**  | `application/json`           |

#### URL Parameters

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `id`      | string | Incident ID (MongoDB ObjectId) |

#### Request Body

| Field                | Type   | Required | Description                |
| -------------------- | ------ | -------- | -------------------------- |
| `resolution`         | string | Yes      | Resolution summary         |
| `rootCause`          | string | No       | Root cause analysis        |
| `actionsTaken`       | array  | No       | List of actions taken      |
| `preventionMeasures` | array  | No       | Prevention recommendations |

#### Request Example

```json
{
  "resolution": "Phishing emails blocked and affected credentials reset",
  "rootCause": "Social engineering attack targeting finance department",
  "actionsTaken": [
    "Blocked malicious domains at firewall",
    "Reset passwords for affected users",
    "Deployed additional email filters"
  ],
  "preventionMeasures": [
    "Schedule phishing awareness training",
    "Implement MFA for all users",
    "Enable email authentication (DMARC/DKIM)"
  ]
}
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "message": "Incident resolved successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "title": "Phishing Campaign Detected",
    "status": "resolved",
    "resolution": {
      "summary": "Phishing emails blocked and affected credentials reset",
      "rootCause": "Social engineering attack targeting finance department",
      "actionsTaken": [
        "Blocked malicious domains at firewall",
        "Reset passwords for affected users",
        "Deployed additional email filters"
      ],
      "preventionMeasures": [
        "Schedule phishing awareness training",
        "Implement MFA for all users",
        "Enable email authentication (DMARC/DKIM)"
      ],
      "resolvedBy": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "John Doe"
      },
      "resolvedAt": "2026-01-21T18:00:00.000Z"
    },
    "updatedAt": "2026-01-21T18:00:00.000Z"
  }
}
```

#### Error Responses

| Status Code | Description        | Response                                                              |
| ----------- | ------------------ | --------------------------------------------------------------------- |
| 400         | Missing Resolution | `{ "success": false, "message": "Resolution summary is required" }`   |
| 400         | Already Resolved   | `{ "success": false, "message": "Incident is already resolved" }`     |
| 401         | Unauthorized       | `{ "success": false, "message": "Access denied. No token provided" }` |
| 404         | Not Found          | `{ "success": false, "message": "Incident not found" }`               |
| 500         | Server Error       | `{ "success": false, "message": "Internal server error" }`            |

---

### DELETE /api/incidents/:id

Delete an incident.

| Property          | Value                |
| ----------------- | -------------------- |
| **Method**        | `DELETE`             |
| **Endpoint**      | `/api/incidents/:id` |
| **Auth Required** | Yes                  |
| **Roles**         | Admin only           |

#### URL Parameters

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `id`      | string | Incident ID (MongoDB ObjectId) |

#### Request Example

```
DELETE /api/incidents/64a1b2c3d4e5f6g7h8i9j0k4
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "message": "Incident deleted successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "title": "Phishing Campaign Detected",
    "deletedAt": "2026-01-21T19:00:00.000Z",
    "deletedBy": "64a1b2c3d4e5f6g7h8i9j0k1"
  }
}
```

#### Error Responses

| Status Code | Description       | Response                                                                       |
| ----------- | ----------------- | ------------------------------------------------------------------------------ |
| 400         | Invalid ID Format | `{ "success": false, "message": "Invalid incident ID format" }`                |
| 401         | Unauthorized      | `{ "success": false, "message": "Access denied. No token provided" }`          |
| 403         | Forbidden         | `{ "success": false, "message": "Admin access required to delete incidents" }` |
| 404         | Not Found         | `{ "success": false, "message": "Incident not found" }`                        |
| 500         | Server Error      | `{ "success": false, "message": "Internal server error" }`                     |

---

## Dashboard

---

### GET /api/dashboard/stats

Get dashboard statistics and metrics.

| Property          | Value                  |
| ----------------- | ---------------------- |
| **Method**        | `GET`                  |
| **Endpoint**      | `/api/dashboard/stats` |
| **Auth Required** | No                     |

#### Query Parameters

| Parameter   | Type   | Default | Description                                 |
| ----------- | ------ | ------- | ------------------------------------------- |
| `timeRange` | string | `24h`   | Time range: `1h`, `24h`, `7d`, `30d`, `all` |

#### Request Example

```
GET /api/dashboard/stats?timeRange=7d
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalIncidents": 156,
      "openIncidents": 23,
      "resolvedIncidents": 128,
      "criticalIncidents": 5,
      "averageResolutionTime": "4h 32m"
    },
    "incidentsBySeverity": {
      "critical": 5,
      "high": 18,
      "medium": 67,
      "low": 66
    },
    "incidentsByStatus": {
      "open": 23,
      "investigating": 12,
      "resolved": 108,
      "closed": 13
    },
    "incidentsByAttackType": {
      "malware": 42,
      "phishing": 58,
      "ddos": 12,
      "intrusion": 24,
      "data_breach": 8,
      "ransomware": 12
    },
    "recentActivity": [
      {
        "type": "incident_created",
        "incidentId": "64a1b2c3d4e5f6g7h8i9j0k5",
        "title": "DDoS Attack on Web Server",
        "severity": "high",
        "timestamp": "2026-01-21T19:30:00.000Z"
      },
      {
        "type": "incident_resolved",
        "incidentId": "64a1b2c3d4e5f6g7h8i9j0k4",
        "title": "Phishing Campaign Detected",
        "severity": "medium",
        "timestamp": "2026-01-21T18:00:00.000Z"
      }
    ],
    "trendsData": {
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "incidents": [12, 19, 8, 15, 22, 10, 14],
      "resolved": [10, 15, 12, 14, 18, 8, 11]
    },
    "topAffectedSystems": [
      { "system": "mail-server", "incidentCount": 24 },
      { "system": "web-server-01", "incidentCount": 18 },
      { "system": "database-01", "incidentCount": 12 },
      { "system": "firewall-main", "incidentCount": 9 },
      { "system": "vpn-gateway", "incidentCount": 7 }
    ],
    "topAttackers": [
      { "ip": "203.0.113.50", "country": "Unknown", "incidentCount": 8 },
      { "ip": "198.51.100.23", "country": "Unknown", "incidentCount": 6 },
      { "ip": "192.0.2.100", "country": "Unknown", "incidentCount": 4 }
    ],
    "generatedAt": "2026-01-21T20:00:00.000Z"
  }
}
```

#### Error Responses

| Status Code | Description        | Response                                                                                   |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------ |
| 400         | Invalid Time Range | `{ "success": false, "message": "Invalid time range. Must be: 1h, 24h, 7d, 30d, or all" }` |
| 500         | Server Error       | `{ "success": false, "message": "Internal server error" }`                                 |

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## HTTP Status Codes

| Code | Description                                      |
| ---- | ------------------------------------------------ |
| 200  | OK - Request successful                          |
| 201  | Created - Resource created successfully          |
| 400  | Bad Request - Invalid request data               |
| 401  | Unauthorized - Authentication required or failed |
| 403  | Forbidden - Insufficient permissions             |
| 404  | Not Found - Resource not found                   |
| 409  | Conflict - Resource already exists               |
| 500  | Internal Server Error - Server-side error        |

---

## Rate Limiting

API requests are rate limited to prevent abuse:

| Endpoint Type    | Limit                   |
| ---------------- | ----------------------- |
| Authentication   | 10 requests per minute  |
| Read Operations  | 100 requests per minute |
| Write Operations | 30 requests per minute  |

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642780800
```

---

## Versioning

The current API version is **v1**. The version is included in the base URL:

```
http://localhost:5000/api/v1/...
```

For backward compatibility, requests without version prefix default to v1.
