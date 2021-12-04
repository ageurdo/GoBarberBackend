import { Router } from "express";
import CreateUserService from "../service/CreateUserService";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();

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

usersRouter.patch('/avatar', ensureAuthenticated, async (request, response) => {
    return response.json({ ok: true })
})

export default usersRouter;


