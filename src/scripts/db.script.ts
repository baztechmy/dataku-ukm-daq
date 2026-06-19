// MODULES
import ch from "@harrypoggers25/color-utils";
import bcrypt from "bcrypt-ts";

// CONFIGS
import { db, User, UserSecret, Gateway, SensorType, Sensor, DataLog, GatewayState } from "../configs/db.config";
import env from "../configs/env.config";

db.sync({
    alter: true,
    onSuccessAlter: async (transaction) => {
        console.log(ch.green('SCRIPT:'), `Altered db. All previous data have been`, ch.red('deleted'));
        // const currentDate = new Date();
        // const [created_at, updated_at] = [currentDate, currentDate];
        // for (const data of [
        //     { user_id: 1, user_name: 'Admin', user_email: 'admin@dataku.io', user_role: 'admin', created_at, updated_at, created_by: 0 },
        //     { user_id: 2, user_name: 'Test User 1', user_email: 'testuser1@dataku.io', user_role: 'user', created_at, updated_at, created_by: 0 },
        //     { user_id: 3, user_name: 'Test User 2', user_email: 'testuser2@dataku.io', user_role: 'user', created_at, updated_at, created_by: 0 }
        // ] as Array<Partial<ReturnType<typeof User.getEmptyModel>>>) {
        //     const user = await User.create(data, { transaction });
        //     if (!user) {
        //         console.log(ch.red('SCRIPT ERROR:'), `Failed to create user [${data.user_email}]`);
        //         return;
        //     }
        //
        //     const { user_id, user_email } = user;
        //     const user_password = bcrypt.hashSync(user_email, env.BCRYPT_SALT);
        //     const userSecret = await UserSecret.create({ user_id, user_password }, { transaction });
        //     if (!userSecret) {
        //         console.log(ch.red('SCRIPT ERROR:'), `Failed to create user secret [${data.user_email}]`);
        //         return;
        //     }
        // }
        //
        // const gateway_id = '470213';
        // const gateway = await Gateway.create(
        //     { gateway_id },
        //     { transaction }
        // );
        // if (!gateway) {
        //     console.log(ch.red('SCRIPT ERROR:'), `Failed to create gateway [${gateway_id}]`);
        //     return;
        // }
        //
        // const gatewayState = await GatewayState.create(
        //     { gateway_id, alive: true, uptime_s: 32108, rssi_dbm: -73, updated_at: new Date(2026, 3, 12, 7, 10, 17, 503) },
        //     { transaction }
        // );
        // if (!gatewayState) {
        //     console.log(ch.red('SCRIPT ERROR:'), `Failed to create gateway state [${gateway_id}]`);
        //     return;
        // }
        //
        // for (const data of [
        //     { st_name: 'soil', s_names: JSON.stringify(['humidity_pct', 'temperature_c']), gateway_id },
        //     { st_name: 'inclino', s_names: JSON.stringify(['roll', 'pitch', 'yaw']), gateway_id },
        //     { st_name: 'vibration', s_names: JSON.stringify(['ax_g', 'ay_g', 'az_g', 'vx_mm_s', 'vy_mm_s', 'vz_mm_s', 'temperature_c']), gateway_id },
        //     { st_name: 'rain', s_names: JSON.stringify(['rain_mm']), gateway_id },
        // ] as Array<Partial<ReturnType<typeof SensorType.getEmptyModel>>>) {
        //     const sensorType = await SensorType.create(data, { transaction });
        //     if (!sensorType) {
        //         console.log(ch.red('SCRIPT ERROR:'), `Failed to create sensor type [${data.st_name}]`);
        //         return;
        //     }
        // }
        //
        // for (const { s_addr, st_id } of [
        //     { s_addr: 11, st_id: 1 },
        //     { s_addr: 12, st_id: 1 },
        //     { s_addr: 13, st_id: 1 },
        //     { s_addr: 14, st_id: 1 },
        //     { s_addr: 81, st_id: 2 },
        //     { s_addr: 82, st_id: 2 },
        //     { s_addr: 83, st_id: 2 },
        //     { s_addr: 84, st_id: 2 },
        //     { s_addr: 88, st_id: 3 },
        //     { s_addr: 90, st_id: 4 },
        // ]) {
        //     const sensorType = await SensorType.findByPk(st_id, { transaction });
        //     if (!sensorType) {
        //         console.log(ch.red('SCRIPT ERROR:'), `Failed to find sensor type [${st_id}]`);
        //         return;
        //     }
        //
        //     const { s_names } = sensorType;
        //     for (const s_name of JSON.parse(s_names)) {
        //         const sensor = await Sensor.create(
        //             { s_addr, s_name, s_threshold_warning: null, s_threshold_critical: null, s_threshold_active: false, st_id },
        //             { transaction }
        //         );
        //         if (!sensor) {
        //             console.log(ch.red('SCRIPT ERROR:'), `Failed to find sensor ${JSON.stringify({ s_addr, s_name, st_id })}`);
        //             return;
        //         }
        //     }
        // }
        //
        // // const dataLog = await DataLog.create({
        // //     dl_raw_data: JSON.stringify({
        // //         "client_id": "ukmdaq-470213",
        // //         "imei": "867284067470213",
        // //         "uptime_s": 32105,
        // //         "soil": [
        // //             {
        // //                 "addr": 11,
        // //                 "online": true,
        // //                 "humidity_pct": 0,
        // //                 "temperature_c": 28.8,
        // //                 "failures": 0
        // //             },
        // //             {
        // //                 "addr": 12,
        // //                 "online": true,
        // //                 "humidity_pct": 0,
        // //                 "temperature_c": 29.1,
        // //                 "failures": 0
        // //             },
        // //             {
        // //                 "addr": 13,
        // //                 "online": true,
        // //                 "humidity_pct": 0,
        // //                 "temperature_c": 29.2,
        // //                 "failures": 0
        // //             },
        // //             {
        // //                 "addr": 14,
        // //                 "online": true,
        // //                 "humidity_pct": 0,
        // //                 "temperature_c": 29.6,
        // //                 "failures": 0
        // //             }
        // //         ],
        // //         "inclino": [
        // //             {
        // //                 "addr": 81,
        // //                 "online": true,
        // //                 "roll": -0.36,
        // //                 "pitch": 0.02,
        // //                 "yaw": -31.78,
        // //                 "failures": 0
        // //             },
        // //             {
        // //                 "addr": 82,
        // //                 "online": true,
        // //                 "roll": 179.8,
        // //                 "pitch": -0.37,
        // //                 "yaw": -35.13,
        // //                 "failures": 0
        // //             },
        // //             {
        // //                 "addr": 83,
        // //                 "online": true,
        // //                 "roll": 179.59,
        // //                 "pitch": -0.46,
        // //                 "yaw": -13.48,
        // //                 "failures": 0
        // //             },
        // //             {
        // //                 "addr": 84,
        // //                 "online": true,
        // //                 "roll": -179.45,
        // //                 "pitch": -0.01,
        // //                 "yaw": -117.3,
        // //                 "failures": 0
        // //             }
        // //         ],
        // //         "vibration": {
        // //             "addr": 88,
        // //             "online": true,
        // //             "ax_g": 0,
        // //             "ay_g": 0,
        // //             "az_g": 0,
        // //             "vx_mm_s": 0,
        // //             "vy_mm_s": 0,
        // //             "vz_mm_s": 0,
        // //             "temperature_c": 38.74,
        // //             "failures": 0
        // //         },
        // //         "rain": {
        // //             "addr": 90,
        // //             "online": true,
        // //             "rain_mm": 0,
        // //             "failures": 0
        // //         }
        // //     }),
        // //     dl_date: new Date(),
        // //     gateway_id: '470213'
        // // }, { transaction });
        // // if (!dataLog) {
        // //     console.log(ch.red('SCRIPT ERROR:'), `Failed to create data log`);
        // //     return;
        // // }
        //
        // console.log(ch.green('SCRIPT:'), `Altered db. New data have been`, ch.yellow('updated'));
    }
})
