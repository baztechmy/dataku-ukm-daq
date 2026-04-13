// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { Gateway } from "../configs/db.config";

export const createGatewayHandler = Route.asyncHandler(async (req, res) => {
    const { gateway_id, gateway_status_on } = req.body;

    const gateway = await Gateway.create({ gateway_id, gateway_status_on });
    if (!gateway) throw new Error('Failed to create new gateway');

    res.status(201).json(gateway);
});

export const findGatewayHandler = Route.asyncHandler(async (req, res) => {
    const gateway_id = req.params.gateway_id as string;
    const gateway = await Gateway.findByPk(gateway_id);
    if (!gateway) throw new Error(`Failed to find gateway [${gateway_id}]`);

    res.status(200).json(gateway);
});

export const findAllGatewayHandler = Route.asyncHandler(async (req, res) => {
    const gateways = await Gateway.find();
    if (!gateways) throw new Error(`Failed to find all gateway`);

    res.status(200).json(gateways);
});

export const updateGatewayHandler = Route.asyncHandler(async (req, res) => {
    const gateway_id = req.params.gateway_id as string;
    const { gateway_status_on } = req.body;

    const gateway = await Gateway.updateByPk(gateway_id, { gateway_status_on });
    if (!gateway) throw new Error(`Failed to update gateway [${gateway_id}]`);

    res.status(200).json(gateway);
});

export const deleteGatewayHandler = Route.asyncHandler(async (req, res) => {
    const gateway_id = req.params.gateway_id as string;
    const gateway = await Gateway.deleteByPk(gateway_id);
    if (!gateway) throw new Error(`Failed to delete gateway [${gateway_id}]`);

    res.status(200).json(gateway);
});
