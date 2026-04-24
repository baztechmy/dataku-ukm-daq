// MODULES
import Db, { DataTypes } from '@harrypoggers25/db-postgresql';
import env from './env.config.js';

export const db = Db.config({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: env.DB_PORT
});

export const User = db.define('users', {
    user_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    user_name: { type: DataTypes.VARCHAR(255), allowNull: false },
    user_email: { type: DataTypes.VARCHAR(255), allowNull: false, unique: true },
    user_phone: { type: DataTypes.VARCHAR(255), allowNull: true },
    user_role: { type: DataTypes.VARCHAR(255), allowNull: false, check: "user_role IN ('user', 'admin')" },
    created_at: { type: DataTypes.TIMESTAMP, allowNull: false },
    updated_at: { type: DataTypes.TIMESTAMP, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
});

export const UserSecret = db.define('user_secrets', {
    user_password: { type: DataTypes.VARCHAR(255), allowNull: false },
    user_refresh_token: { type: DataTypes.TEXT, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }
});
UserSecret.setForeignKey(User, 'user_id');

export const UserActivityLog = db.define('user_activity_logs', {
    ual_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    ual_activity: { type: DataTypes.VARCHAR(511), allowNull: false },
    ual_ip: { type: DataTypes.VARCHAR(255), allowNull: false },
    ual_date: { type: DataTypes.TIMESTAMP, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
});
UserActivityLog.setForeignKey(User, 'user_id');

export const Gateway = db.define('gateways', {
    gateway_id: { type: DataTypes.VARCHAR(255), allowNull: false, primaryKey: true },
});

export const GatewayState = db.define('gateway_states', {
    alive: { type: DataTypes.BOOLEAN, allowNull: false },
    uptime: { type: DataTypes.BIGINT, allowNull: false },
    rssi_dbm: { type: DataTypes.BIGINT, allowNull: false },
    updated_at: { type: DataTypes.TIMESTAMP, allowNull: false },
    gateway_id: { type: DataTypes.VARCHAR(255), allowNull: false, unique: true },
});
GatewayState.setForeignKey(Gateway, 'gateway_id');

export const SensorType = db.define('sensor_types', {
    st_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    st_name: { type: DataTypes.VARCHAR(255), allowNull: false, unique: true },
    st_components: { type: DataTypes.TEXT, allowNull: false, defaultValue: "[]" },
    gateway_id: { type: DataTypes.VARCHAR(255), allowNull: false }
});
SensorType.setForeignKey(Gateway, 'gateway_id')

export const Sensor = db.define('sensors', {
    s_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    s_index: { type: DataTypes.INTEGER, allowNull: false }, // s_id can be duplicate for different st_id, but not for the same st_id
    s_addr: { type: DataTypes.INTEGER, allowNull: false },
    st_id: { type: DataTypes.INTEGER, allowNull: false }
});
Sensor.setForeignKey(SensorType, 'st_id');

export const DataLog = db.define('data_logs', {
    dl_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    dl_raw_data: { type: DataTypes.TEXT, allowNull: false },
    dl_date: { type: DataTypes.TIMESTAMP, allowNull: false },
    gateway_id: { type: DataTypes.VARCHAR(255), allowNull: false }
});
DataLog.setForeignKey(Gateway, 'gateway_id');
