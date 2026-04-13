// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { DataLog } from "../configs/db.config";

// LOCAL FUNCTIONS
function generateDate(year: number, month: number, day: number): string {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', });
}

export const createDataLogHandler = Route.asyncHandler(async (req, res) => {
    const dl_date = new Date();
    const { dl_id, dl_raw_data, gateway_id } = req.body;

    const dataLog = await DataLog.create({ dl_id, dl_raw_data, dl_date, gateway_id });
    if (!dataLog) throw new Error('Failed to create new data log');

    res.status(201).json(dataLog);
});

export const findAllDataLogHandler = Route.asyncHandler(async (req, res) => {
    const dataLogs = await DataLog.find();
    if (!dataLogs) throw new Error(`Failed to find all data logs`);

    res.status(200).json(dataLogs);
});

export const findAllDataLogByDateHandler = Route.asyncHandler(async (req, res) => {
    if (['dl_year', 'dl_month'].some(param => Number.isNaN(+req.params[param]))) {
        res.status(400);
        throw new Error(`Failed to find all data logs by date [${req.params.dl_year},${req.params.dl_month}]`);
    }

    const [year, month] = [+req.params.dl_year, +req.params.dl_month];
    const dataLogs = await DataLog.find({
        where: `dl_date >= DATE '${generateDate(year, month, 1)}' AND dl_date <  DATE '${generateDate(year, month + 1, 1)}'`,
        orderBy: { dl_id: 'ASC' }
    });
    if (!dataLogs) throw new Error(`Failed to find all data log logs [${year},${month}]`);

    res.status(200).json(dataLogs);
});

export const findLatestDataLogHandler = Route.asyncHandler(async (req, res) => {
    const dataLogs = await DataLog.find({
        orderBy: { dl_date: 'DESC' },
        limit: 1
    });
    if (!dataLogs) throw new Error('Failed to find latest data log log');
    if (!dataLogs.length) throw new Error('No log data found');

    res.status(200).json(dataLogs[0]);
});

export const deleteDataLogHandler = Route.asyncHandler(async (req, res) => {
    const dl_id = req.params.dl_id as string;
    const dataLog = await DataLog.deleteByPk(dl_id);
    if (!dataLog) throw new Error(`Failed to delete data log [${dl_id}]`);

    res.status(200).json(dataLog);
});
