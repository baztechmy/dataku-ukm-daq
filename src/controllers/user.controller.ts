// MODULES
import Route from "@harrypoggers25/route";

// CONFIGS
import { db, User, UserSecret } from "../configs/db.config";
import { hashSync } from "bcrypt-ts";

export const createUserHandler = Route.asyncHandler(async (req, res) => {
    const currentDate = new Date();

    const { user_id, user_name, user_email, user_password, user_phone, user_role, created_by } = req.body;
    const [created_at, updated_at] = [currentDate, currentDate];

    if (!user_email) {
        res.status(400);
        throw new Error('Failed to create new user. User email is required');
    }
    if (!user_password) {
        res.status(400);
        throw new Error('Failed to create new user. User password is required');
    }
    if (!user_role || typeof user_role !== 'string' || !['admin', 'user'].some(role => user_role.toLowerCase() === role)) {
        res.status(400);
        throw new Error('Failed to create new user. Invalid user role');
    }

    const transaction = await db.transaction({ rollbackOnError: true });
    const user = await User.create({ user_id, user_name, user_email, user_phone, user_role: user_role.toLowerCase(), created_at, updated_at, created_by }, { transaction });
    if (!user) throw new Error('Failed to create new user');

    const userSecret = await UserSecret.create({ user_password: hashSync(user_password, 10), user_id: user.user_id }, { transaction });
    if (!userSecret) throw new Error('Failed to create new user password');

    await transaction.commit();
    res.status(201).json(user);
});

export const findUserHandler = Route.asyncHandler(async (req, res) => {
    const user_id = +req.params.user_id;
    const user = await User.findByPk(user_id);
    if (!user) throw new Error(`Failed to find user [${user_id}]`);

    res.status(200).json(user);
});

export const findAllUserHandler = Route.asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) throw new Error(`Failed to find all users`);

    res.status(200).json(users);
});

export const updateUserHandler = Route.asyncHandler(async (req, res) => {
    const user_id = +req.params.user_id;
    const { user_name, user_email, user_password, user_phone, user_role, created_by } = req.body;
    const updated_at = new Date();

    const transaction = await db.transaction({ rollbackOnError: true });

    if (user_password) {
        const userSecret = UserSecret.update({ user_password: hashSync(user_password, 10) }, { where: { user_id }, transaction });
        if (!userSecret) throw new Error(`Failed to update user password [${user_id}]`);
    }

    const user = await User.updateByPk(user_id, { user_name, user_email, user_phone, user_role, updated_at, created_by }, { transaction });
    if (!user) throw new Error(`Failed to update user [${user_id}]`);

    await transaction.commit();
    res.status(200).json(user);
});

export const deleteUserHandler = Route.asyncHandler(async (req, res) => {
    const user_id = +req.params.user_id;
    const user = await User.deleteByPk(user_id);
    if (!user) throw new Error(`Failed to delete user [${user_id}]`);

    res.status(200).json(user);
});
