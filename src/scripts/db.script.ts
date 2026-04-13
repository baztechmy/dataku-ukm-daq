// MODULES
import ch from "@harrypoggers25/color-utils";
import bcrypt from "bcrypt-ts";

// CONFIGS
import { db, User, UserSecret, Gateway, SensorType, Sensor, DataLog } from "../configs/db.config";
import env from "../configs/env.config";

db.sync({
    alter: true,
    onSuccessAlter: async (transaction) => {
        console.log(ch.green('SCRIPT:'), `Altered db. All previous data have been`, ch.red('deleted'));

        const currentDate = new Date();
        const [created_at, updated_at] = [currentDate, currentDate];
        for (const data of [
            { user_id: 1, user_name: 'Admin', user_email: 'admin@dataku.io', user_role: 'admin', created_at, updated_at, created_by: 0 },
            { user_id: 2, user_name: 'Test User 1', user_email: 'testuser1@dataku.io', user_role: 'user', created_at, updated_at, created_by: 0 },
            { user_id: 3, user_name: 'Test User 2', user_email: 'testuser2@dataku.io', user_role: 'user', created_at, updated_at, created_by: 0 }
        ] as Array<Partial<ReturnType<typeof User.getEmptyModel>>>) {
            const user = await User.create(data, { transaction });
            if (!user) {
                console.log(ch.red('SCRIPT ERROR:'), `Failed to create user [${data.user_email}]`);
                return;
            }

            const { user_id, user_email } = user;
            const user_password = bcrypt.hashSync(user_email, env.BCRYPT_SALT);
            const userSecret = await UserSecret.create({ user_id, user_password }, { transaction });
            if (!userSecret) {
                console.log(ch.red('SCRIPT ERROR:'), `Failed to create user secret [${data.user_email}]`);
                return;
            }
        }

        const gateway_id = '470213';
        const gateway = await Gateway.create({ gateway_id, gateway_status_on: true }, { transaction });
        if (!gateway) {
            console.log(ch.red('SCRIPT ERROR:'), `Failed to gateway [470213]`);
            return;
        }

        for (const data of [
            { st_name: 'soil', st_components: JSON.stringify(['addr', 'online', 'humidity', 'temperature_c', 'failures']), gateway_id },
            { st_name: 'inclino', st_components: JSON.stringify(['addr', 'online', 'roll', 'pitch', 'yaw', 'failures']), gateway_id },
            { st_name: 'vibration', st_components: JSON.stringify(['addr', 'online', 'ax_g', 'ay_g', 'az_g', 'vx_mm_s', 'vy_mm_s', 'vz_mm_s', 'temperature_c', 'failures']), gateway_id },
            { st_name: 'rain', st_components: JSON.stringify(['addr', 'online', 'rain_mm', 'failures']), gateway_id },
        ] as Array<Partial<ReturnType<typeof SensorType.getEmptyModel>>>) {
            const sensorType = await SensorType.create(data, { transaction });
            if (!sensorType) {
                console.log(ch.red('SCRIPT ERROR:'), `Failed to create sensor type [${data.st_name}]`);
                return;
            }
        }

        for (const data of [
            { s_index: 1, s_addr: 11, st_id: 1 },
            { s_index: 2, s_addr: 12, st_id: 1 },
            { s_index: 3, s_addr: 13, st_id: 1 },
            { s_index: 4, s_addr: 14, st_id: 1 },
            { s_index: 1, s_addr: 81, st_id: 2 },
            { s_index: 2, s_addr: 82, st_id: 2 },
            { s_index: 3, s_addr: 83, st_id: 2 },
            { s_index: 4, s_addr: 84, st_id: 2 },
            { s_index: 1, s_addr: 88, st_id: 3 },
            { s_index: 1, s_addr: 90, st_id: 4 },
        ] as Array<Partial<ReturnType<typeof Sensor.getEmptyModel>>>) {
            const sensor = await Sensor.create(data, { transaction });
            if (!sensor) {
                console.log(ch.red('SCRIPT ERROR:'), `Failed to create sensor [${data.st_id, data.s_index}]`);
                return;
            }
        }

        const dataLog = await DataLog.create({
            dl_raw_data: JSON.stringify({
                "client_id": "ukmdaq-470213",
                "imei": "867284067470213",
                "uptime_s": 32105,
                "soil": [
                    {
                        "addr": 11,
                        "online": true,
                        "humidity_pct": 0,
                        "temperature_c": 28.8,
                        "failures": 0
                    },
                    {
                        "addr": 12,
                        "online": true,
                        "humidity_pct": 0,
                        "temperature_c": 29.1,
                        "failures": 0
                    },
                    {
                        "addr": 13,
                        "online": true,
                        "humidity_pct": 0,
                        "temperature_c": 29.2,
                        "failures": 0
                    },
                    {
                        "addr": 14,
                        "online": true,
                        "humidity_pct": 0,
                        "temperature_c": 29.6,
                        "failures": 0
                    }
                ],
                "inclino": [
                    {
                        "addr": 81,
                        "online": true,
                        "roll": -0.36,
                        "pitch": 0.02,
                        "yaw": -31.78,
                        "failures": 0
                    },
                    {
                        "addr": 82,
                        "online": true,
                        "roll": 179.8,
                        "pitch": -0.37,
                        "yaw": -35.13,
                        "failures": 0
                    },
                    {
                        "addr": 83,
                        "online": true,
                        "roll": 179.59,
                        "pitch": -0.46,
                        "yaw": -13.48,
                        "failures": 0
                    },
                    {
                        "addr": 84,
                        "online": true,
                        "roll": -179.45,
                        "pitch": -0.01,
                        "yaw": -117.3,
                        "failures": 0
                    }
                ],
                "vibration": {
                    "addr": 88,
                    "online": true,
                    "ax_g": 0,
                    "ay_g": 0,
                    "az_g": 0,
                    "vx_mm_s": 0,
                    "vy_mm_s": 0,
                    "vz_mm_s": 0,
                    "temperature_c": 38.74,
                    "failures": 0
                },
                "rain": {
                    "addr": 90,
                    "online": true,
                    "rain_mm": 0,
                    "failures": 0
                }
            }),
            dl_date: new Date(),
            gateway_id: '470213'
        }, { transaction });
        if (!dataLog) {
            console.log(ch.red('SCRIPT ERROR:'), `Failed to create data log`);
            return;
        }

        console.log(ch.green('SCRIPT:'), `Altered db. New data have been`, ch.yellow('updated'));
    }
})
