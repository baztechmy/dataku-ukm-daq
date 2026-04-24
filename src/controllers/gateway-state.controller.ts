// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { GatewayState } from "../configs/db.config";

export const findAllGatewayStateHandler = Route.asyncHandler(async (req, res) => {
    const gatewayState = await GatewayState.find();
    if (!gatewayState) throw new Error(`Failed to find all gateway state`);

    res.status(200).json(gatewayState);
});

export const findGatewayStateHandler = Route.asyncHandler(async (req, res) => {
    const { gateway_id } = req.body;
    const gatewayState = await GatewayState.find({ where: { gateway_id } });
    if (!gatewayState || !gatewayState.length) throw new Error(`Failed to find gateway state [${gateway_id}]`);

    res.status(200).json(gatewayState[0]);
});
