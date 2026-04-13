import ch from "@harrypoggers25/color-utils";
import { User, UserSecret, UserActivityLog, Gateway, SensorType, Sensor, DataLog } from "../configs/db.config";

(async () => {
    const append = true;
    const path = './database/dataku-glide-v3.sql';

    const users = await User.backup(path, { fixSequence: 'user_id', orderBy: { user_id: 'ASC' } });
    if (!users) return;

    const userSecrets = await UserSecret.backup(path, { orderBy: { user_id: 'ASC' }, append });
    if (!userSecrets) return;

    const userActivityLogs = await UserActivityLog.backup(path, { fixSequence: 'ual_id', orderBy: { ual_id: 'ASC' }, append });
    if (!userActivityLogs) return;

    const gateway = await Gateway.backup(path, { append });
    if (!gateway) return;

    const sensorType = await SensorType.backup(path, { fixSequence: 'st_id', orderBy: { st_id: 'ASC' }, append });
    if (!sensorType) return;

    const sensor = await Sensor.backup(path, { fixSequence: 's_id', orderBy: { s_id: 'ASC' }, append });
    if (!sensor) return;

    const dataLog = await DataLog.backup(path, { fixSequence: 'dl_id', orderBy: { dl_id: 'ASC' }, append });
    if (!dataLog) return;

    console.log(ch.green('SCRIPT:'), 'All db data has been', ch.green('successfully'), 'backed up');
})()
