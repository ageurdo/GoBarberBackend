import { Router } from "express";
import CreateUserService from "../service/CreateUserService";
import multer from 'multer';
import uploadConfig from '../config/upload'

import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import UpdateUserAvatarService from "../service/UpdateUserAvatarService";

const usersRouter = Router();
const upload = multer(uploadConfig);


usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password
        })

        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }

        return response.json(userWithoutPassword);

    } catch (err) {
        if (err instanceof Error) {
            return response.status(400).json({ error: err.message })
        }
    }
})

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        try {
            const updateUserAvatar = new UpdateUserAvatarService();

            const user = await updateUserAvatar.execute({
                user_id: request.user.id,
                avatarFilename: request.file!.filename,
            });

            const userWithoutPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }

            return response.json(userWithoutPassword);

        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message })
            }
        }
    })

export default usersRouter;


