// MODULES
import App from "@harrypoggers25/app-express";
import ch from "@harrypoggers25/color-utils";
import cookieParser from 'cookie-parser';

// CONFIGS
import env from "./configs/env.config";
import { DataLog, db, Gateway } from "./configs/db.config";

// APP
import router from "./routers";
import { mqttClient } from "./configs/mqtt.config";

App.listen({
    port: env.PORT,
    version: '1.0.0 build 3',
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
            const topic = `ukmdaq/a7670g/${gateway_id}/sensors`;

            mqttClient.subscribe(topic, async (message) => {
                try {
                    const dl_date = new Date();
                    const dl_raw_data = JSON.parse(message);
                    const dataLog = await DataLog.create({ dl_raw_data, dl_date, gateway_id });
                    if (!dataLog) {
                        console.log(ch.red(`DATA LOG ERROR:`), 'Failed to insert raw data into database');
                        return
                    }
                } catch (error: any) {
                    console.log(ch.red(`RAW DATA PARSE ERROR ${topic}`), error.message ?? error);
                }
            });
        }
    }
});

