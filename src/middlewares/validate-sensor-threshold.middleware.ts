import Route from "@harrypoggers25/route";

type SensorThreshold = { threshold: number, symbol: '>=' | '>' | '<=' | '<' | '==' | '!=' };
const verifySensorThreshold = (obj: SensorThreshold | Array<SensorThreshold> | null): { valid: boolean, message: string, result: null | string } => {
    if (obj === null) return { valid: true, message: 'OK', result: null };
    try {
        const sensorThresholds: Array<SensorThreshold> = !Array.isArray(obj) ? [obj] : obj;
        for (let i = 0; i < 2 && i < sensorThresholds.length; i++) {
            const st = sensorThresholds[i];
            if (Number.isNaN(+st.threshold)) throw new Error(`Threshold '${st.threshold}' is invalid. Threshold must be of type number`);
            if (!['>=', '>', '<=', '<', '==', '!='].includes(st.symbol)) throw new Error(`Symbol '${st.symbol}' is invalid. Symbol must be either:  '>=', '>', '<=', '<', '==' or '!='`);
        }

        return { valid: true, message: 'OK', result: JSON.stringify(sensorThresholds) };
    } catch (error: any) {
        return { valid: false, message: error.message ?? error, result: null };
    }
}

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
