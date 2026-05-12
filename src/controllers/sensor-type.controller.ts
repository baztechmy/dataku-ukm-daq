// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { db, Sensor, SensorType } from "../configs/db.config";
import { parseJson, stringifyJson } from "../helpers/mqtt.helper";

export const createSensorTypeHandler = Route.asyncHandler(async (req, res) => {
    const { st_name, s_names, gateway_id } = req.body;
    if (!s_names) throw new Error('Failed to create new sensor type. s_names is undefined');

    const sensorType = await SensorType.create({ st_name, s_names, gateway_id });
    if (!sensorType) throw new Error('Failed to create new sensor type');

    res.status(201).json(sensorType);
});

export const findSensorTypeHandler = Route.asyncHandler(async (req, res) => {
    const st_id = +req.params.st_id;
    const sensorType = await SensorType.findByPk(st_id);
    if (!sensorType) throw new Error(`Failed to find sensor type [${st_id}]`);

    res.status(200).json(sensorType);
});

export const findAllSensorTypeHandler = Route.asyncHandler(async (req, res) => {
    const sensorTypes = await SensorType.find();
    if (!sensorTypes) throw new Error(`Failed to find all sensor types`);

    res.status(200).json(sensorTypes);
});

export const updateSensorTypeHandler = Route.asyncHandler(async (req, res) => {
    const st_id = +req.params.st_id;
    const { st_name, s_names, gateway_id } = req.body;

    const transaction = await db.transaction({ rollbackOnError: true });
    const sensorType = await SensorType.updateByPk(st_id, { st_name, s_names, gateway_id }, { transaction });
    if (!sensorType) throw new Error(`Failed to update sensor type [${st_id}]`);

    const sensors = await Sensor.find({ where: { st_id }, transaction });
    if (!sensors) throw new Error(`Failed to update sensor type [${st_id}]. Unable to fetch sensors ${stringifyJson({ st_id })}`);

    const sNames = parseJson(s_names) as Array<string>;
    const sAddrs = [...new Set(sensors.map(sensor => sensor.s_addr))];
    const sNamesToAdd = sNames.filter(sName => !sensors.some(sensor => sensor.s_name === sName));
    const sNamesToDelete = [...new Set(sensors.map(sensor => sensor.s_name))].filter(sName => !sNames.includes(sName));

    for (const s_addr of sAddrs) {
        for (const s_name of sNamesToDelete) {
            await Sensor.delete({ where: { s_addr, s_name, st_id }, transaction });
        }
        for (const s_name of sNamesToAdd) {
            await Sensor.create({ s_addr, s_name, st_id }, { transaction });
        }
    }

    await transaction.commit();
    res.status(200).json(sensorType);
});

export const deleteSensorTypeHandler = Route.asyncHandler(async (req, res) => {
    const st_id = +req.params.st_id;
    const sensorType = await SensorType.deleteByPk(st_id);
    if (!sensorType) throw new Error(`Failed to delete sensor type [${st_id}]`);

    res.status(200).json(sensorType);
});
