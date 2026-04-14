// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { Sensor } from "../configs/db.config";

export const createSensorHandler = Route.asyncHandler(async (req, res) => {
    const { s_index, s_addr, st_id } = req.body;

    const oldSensor = await Sensor.find({ where: { s_index, st_id } });
    if (!oldSensor) throw new Error(`Failed to create new sensor. Unable to find old sensor with value {s_index: ${s_index}, st_id: ${st_id}}`);
    if (oldSensor.length > 0) {
        res.status(409);
        throw new Error(`Failed to create sensor with value {s_index: ${s_index}, st_id: ${st_id}}. Duplicate entry found`);
    }

    const sensor = await Sensor.create({ s_index, s_addr, st_id });
    if (!sensor) throw new Error('Failed to create new sensor');

    res.status(201).json(sensor);
});

export const findSensorHandler = Route.asyncHandler(async (req, res) => {
    const s_id = +req.params.s_id;
    const sensor = await Sensor.findByPk(s_id);
    if (!sensor) throw new Error(`Failed to find sensor [${s_id}]`);

    res.status(200).json(sensor);
});

export const findAllSensorHandler = Route.asyncHandler(async (req, res) => {
    const sensors = await Sensor.find();
    if (!sensors) throw new Error(`Failed to find all sensor`);

    res.status(200).json(sensors);
});

export const findAllSensorByTypeHandler = Route.asyncHandler(async (req, res) => {
    const st_id = +req.params.st_id;
    const sensors = await Sensor.find({ where: { st_id }, orderBy: { s_id: 'ASC' } });
    if (!sensors) throw new Error(`Failed to find all sensor by type [${st_id}]`);

    res.status(200).json(sensors);
});

export const updateSensorHandler = Route.asyncHandler(async (req, res) => {
    const s_id = +req.params.s_id;
    const { s_index, s_addr, st_id } = req.body;

    const oldSensor = await Sensor.find({ where: { s_index, st_id } });
    if (!oldSensor) throw new Error(`Failed to update sensor [${s_id}]. Unable to find old sensor with value {s_index: ${s_index}, st_id: ${st_id}}`);
    if (oldSensor.length > 0) {
        res.status(409);
        throw new Error(`Failed to update sensor [${s_id}] with value {s_index: ${s_index}, st_id: ${st_id}}. Duplicate entry found`);
    }

    const sensor = await Sensor.updateByPk(s_id, { s_index, s_addr, st_id });
    if (!sensor) throw new Error(`Failed to update sensor [${s_id}]`);

    res.status(200).json(sensor);
});

export const deleteSensorHandler = Route.asyncHandler(async (req, res) => {
    const s_id = +req.params.s_id;
    const sensor = await Sensor.deleteByPk(s_id);
    if (!sensor) throw new Error(`Failed to delete sensor [${s_id}]`);

    res.status(200).json(sensor);
});
