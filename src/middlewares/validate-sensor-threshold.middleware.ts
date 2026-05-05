import Route from "@harrypoggers25/route";
import { verifySensorThreshold } from "../configs/db.config";

export const validateSensorThresholds = Route.asyncHandler(async (req, res, next) => {
    const { s_threshold_warning, s_threshold_critical } = req.body;
    if (s_threshold_warning !== undefined) {
        const verified = verifySensorThreshold(s_threshold_warning);
        if (!verified.valid) throw new Error(`Failed to validate warning sensor threshold. ${verified.message}`);

        req.body.s_threshold_warning = verified.result;
    }
    if (s_threshold_critical !== undefined) {
        const verified = verifySensorThreshold(s_threshold_critical);
        if (!verified.valid) throw new Error(`Failed to validate critical sensor threshold. ${verified.message}`);

        req.body.s_threshold_critical = verified.result;
    }

    next();
});
