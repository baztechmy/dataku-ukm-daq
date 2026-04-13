// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { SensorType } from "../configs/db.config";

export const createSensorTypeHandler = Route.asyncHandler(async (req, res) => {
    const { st_name, st_components, gateway_id } = req.body;
    if (st_components && typeof st_components !== 'string') throw new Error(`Failed to create new sensor type [${st_name}]. st_components must be a stringified json object`);

    const sensorType = await SensorType.create({ st_name, st_components, gateway_id });
    if (!sensorType) throw new Error('Failed to create new user');

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
    const { st_name, st_components, gateway_id } = req.body;
    if (st_components && typeof st_components !== 'string') throw new Error(`Failed to update sensor type [${st_name}]. st_components must be a stringified json object`);

    const sensorType = await SensorType.updateByPk(st_id, { st_name, st_components, gateway_id });
    if (!sensorType) throw new Error(`Failed to update sensor type [${st_id}]`);

    res.status(200).json(sensorType);
});

export const deleteSensorTypeHandler = Route.asyncHandler(async (req, res) => {
    const st_id = +req.params.st_id;
    const sensorType = await SensorType.deleteByPk(st_id);
    if (!sensorType) throw new Error(`Failed to delete sensor type [${st_id}]`);

    res.status(200).json(sensorType);
});
