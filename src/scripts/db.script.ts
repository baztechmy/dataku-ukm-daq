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
    }
})
