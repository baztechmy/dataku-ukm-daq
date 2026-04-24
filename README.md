# Dataku UKM DAQ - Backend system

## Description
- Create a backend for the **UKM Landslide Monitor System** following similar format as Glide Dataku

## Features:
- User authentication/authorization (JWT,Bcrypt)
- User access control (Role access)
- CRUD for:

| COMPONENTS | ENDPOINTS | METHODS | USER ACCESS |
| --------------- | --------------- | --------------- | --------------- |
| Auth login | /auth | POST | |
| Auth logout | /auth/logout | POST | |
| User | /api/users | POST, GET | Admin only |
| User | /api/users/:user_id | GET, PATCH, DELETE | Admin only, GET/PATCH: or Account owner |
| Gateway | /api/gateways | POST, GET | |
| Gateway | /api/gateways/:gateway_id | DELETE | |
| Gateway state | /api/gateway-states | GET | |
| Gateway state | /api/gateway-states/:gateway_id | GET | |
| Sensor type | /api/sensor-types | POST, GET | |
| Sensor type | /api/sensor-types/:st_id | GET, PATCH, DELETE | |
| Sensor | /api/sensors | POST, GET | |
| Sensor | /api/sensors/:s_id | GET, PATCH, DELETE | |
| Sensor | /api/sensor-types/st_id/sensors | GET | |
| Data log | /api/data-logs | POST, GET | |
| Data log | /api/data-logs/:dl_id | DELETE | |
| Data log | /api/data-logs/date/:dl_year/:dl_month | GET | |
| Data log | /api/latest/data-logs | GET | |

- MQTT data store and retrieval capability

## Prerequisites:
- Typescript
- Postgresql
- Custom npm modules authorization key

## Procedures:
1. Open the *.npmrc* file, and add the authorization key
> Token must be requested from the npm module author @harrypoggers25
2. Run `npm run install` to install all the required packages
> Typescript must be installed prior to this script. Run `npm install -g typescript` to install it globally
3. Run `npm run senvbr` to initialize the *.env* file
4. Configure the *.env* file accordingly
5. Run `npm run sdbbr` to initialize the database schemas and tables
> The database must be created prior to this script. DB_NAME from the *.env* configuration must match the name of the database
6. Import the previous database data via sql script (must request from author)
7. Run `npm run br` to start the system
