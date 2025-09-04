import {
    authRouter,
    userRouter,
    chatRoomRouter,
} from "../../routes/api/index.js";
import {
    authRouter as authDashboardRouter,
    roleRouter,
    adminRouter,
    userRouter as userDashboardRouter,
} from "../../routes/dashboard/index.js";

// sets up api and dashboard routes
export const initializeRoutes = (app) => {
    // api routes
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/chat-rooms", chatRoomRouter);

    // dashboard routes
    app.use("/api/v1/dashboard/auth", authDashboardRouter);
    app.use("/api/v1/dashboard/roles", roleRouter);
    app.use("/api/v1/dashboard/admins", adminRouter);
    app.use("/api/v1/dashboard/users", userDashboardRouter);

    // test route
    app.get("/test", async (req, res) => {});
};
