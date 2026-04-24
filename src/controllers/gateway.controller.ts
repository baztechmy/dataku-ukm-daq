// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { db, Gateway, GatewayState } from "../configs/db.config";

export const createGatewayHandler = Route.asyncHandler(async (req, res) => {
    const { gateway_id } = req.body;
    const transaction = await db.transaction({ rollbackOnError: true });

    const gateway = await Gateway.create({ gateway_id }, { transaction });
    if (!gateway) throw new Error(`Failed to create new gateway [${gateway_id}]`);

    const gatewayState = await GatewayState.create({ updated_at: new Date() }, { transaction });
    if (!gatewayState) throw new Error(`Failed to create new gateway. Unable to create gateway state [${gateway_id}]`);

    await transaction.commit();
    res.status(201).json(gateway);
});

export const findAllGatewayHandler = Route.asyncHandler(async (req, res) => {
    const gateways = await Gateway.find();
    if (!gateways) throw new Error(`Failed to find all gateway`);

    res.status(200).json(gateways);
});

export const deleteGatewayHandler = Route.asyncHandler(async (req, res) => {
    const gateway_id = req.params.gateway_id as string;
    const gateway = await Gateway.deleteByPk(gateway_id);
    if (!gateway) throw new Error(`Failed to delete gateway [${gateway_id}]`);

    res.status(200).json(gateway);
});
