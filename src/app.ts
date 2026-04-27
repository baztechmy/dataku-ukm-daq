// MODULES
import App from "@harrypoggers25/app-express";
import ch from "@harrypoggers25/color-utils";
import cookieParser from 'cookie-parser';

// CONFIGS
import env from "./configs/env.config";
import { DataLog, db, Gateway, GatewayState } from "./configs/db.config";

// APP
import router from "./routers";
import { mqttClient } from "./configs/mqtt.config";

function parseJson(str: string) {
    try {
        const parsedStr = JSON.parse(str);
        return parsedStr;
    } catch (error: any) {
        return null;
    }
}

App.listen({
    port: env.PORT,
    version: '1.0.0 build 5',
    cors: [env.ORIGIN_URL],
    beforeListen: async (app) => {
        app.use(cookieParser());
        app.use('/', router);
    },
    callback: async (app, server) => {
        await db.sync({ alter: false });

        const gateways = await Gateway.find();
        if (!gateways) {
            console.log(ch.red('INIT ERROR:'), `Failed to retrieve all gateway`);
            return;
        }

        for (const gateway of gateways) {
            const { gateway_id } = gateway;

            const sensorsTopic = `ukmdaq/a7670g/${gateway_id}/sensors`;
            mqttClient.subscribe(sensorsTopic, async (message) => {
                const parsedMessage = parseJson(message);
                if (!parsedMessage) {
                    console.log(ch.red(`RAW DATA PARSE ERROR [${sensorsTopic}]:`), `Failed to parse '${message}'`);
                    return;
                }

                const dl_raw_data = JSON.stringify(parsedMessage);
                const dl_date = new Date();
                const dataLog = await DataLog.create({ dl_raw_data, dl_date, gateway_id });
                if (!dataLog) {
                    console.log(ch.red(`DATA LOG ERROR [${sensorsTopic}]:`), 'Failed to insert raw data into database');
                    return;
                }
            });

            const heartBeatTopic = `ukmdaq/a7670g/${gateway_id}/heartbeat`;
            mqttClient.subscribe(heartBeatTopic, async (message) => {
                const parsedMessage = parseJson(message);
                if (!parsedMessage) {
                    console.log(ch.red(`HEARTBEAT PARSE ERROR [${heartBeatTopic}]:`), `Failed to parse '${message}'`);
                    return;
                }

                const { alive, uptime_s, rssi_dbm } = JSON.parse(message);
                Object.entries({ alive, uptime_s, rssi_dbm }).forEach(([key, val]) => {
                    if (val === undefined) {
                        console.log(ch.red(`HEARTBEAT ERROR [${heartBeatTopic}]:`), `Failed to update gateway state. '${key}' is undefined`);
                        return;
                    }
                });

                const gatewayState = await GatewayState.update({ alive, uptime_s, rssi_dbm, gateway_id }, { where: { gateway_id } });
                if (!gatewayState || !gatewayState.length) {
                    console.log(ch.red(`HEARTBEAT ERROR [${heartBeatTopic}]:`), 'Failed to update gateway state');
                    return;
                }
            });
        }
    }
});

