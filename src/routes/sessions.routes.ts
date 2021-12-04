import { Router } from "express";
import User from "../models/User";
import AuthenticateUserService from "../service/AuthenticateUserService";

const SessionsRouter = Router();

SessionsRouter.post('/', async (request, response) => {
    try {
        const { email, password } = request.body;

        const authenticateUser = new AuthenticateUserService();

        const { user, token } = await authenticateUser.execute({
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

        return response.json({userWithoutPassword, token});


    } catch (err) {
        if (err instanceof Error) {
            return response.status(400).json({ error: err.message })
        }

    }
})

export default SessionsRouter;


