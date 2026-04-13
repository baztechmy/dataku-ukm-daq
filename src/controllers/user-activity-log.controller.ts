// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { UserActivityLog } from "../configs/db.config";

export const createUserActivityLogHandler = Route.asyncHandler(async (req, res) => {
    const { ual_id, ual_activity, ual_ip, user_id, } = req.body;
    const ual_date = new Date();

    const ual = await UserActivityLog.create({ ual_id, ual_activity, ual_ip, ual_date, user_id, });
    if (!ual) throw new Error('Failed to create new user activity log');

    res.status(201).json(ual);
});

export const findAllUserActivityLogHandler = Route.asyncHandler(async (req, res) => {
    const uals = await UserActivityLog.find();
    if (!uals) throw new Error(`Failed to find all user activity logs`);

    res.status(200).json(uals);
});

export const deleteUserActivityLogHandler = Route.asyncHandler(async (req, res) => {
    const ual_id = +req.params.ual_id;
    const ual = await UserActivityLog.deleteByPk(ual_id);
    if (!ual) throw new Error(`Failed to delete user activity log [${ual_id}]`);

    res.status(200).json(ual);
});
