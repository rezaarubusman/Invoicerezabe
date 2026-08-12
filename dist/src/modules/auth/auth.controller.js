export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.register(dto);
            return res
                .status(201)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.login(dto);
            return res
                .status(200)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (_req, res, next) => {
        try {
            const user = res.locals.user;
            const result = await this.authService.logout(user.id);
            return res
                .status(200)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
    me = async (_req, res, next) => {
        try {
            const user = res.locals.user;
            const result = await this.authService.getCurrentUser(user.id);
            return res
                .status(200)
                .json({
                user: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyEmail = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.verifyEmail(dto);
            return res
                .status(200)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
    resendVerification = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.resendVerification(dto);
            return res
                .status(200)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.forgotPassword(dto);
            return res
                .status(200)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.resetPassword(dto);
            return res
                .status(200)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
    changePassword = async (req, res, next) => {
        try {
            const user = res.locals.user;
            const dto = req.body;
            const result = await this.authService.changePassword(user.id, dto);
            return res
                .status(200)
                .json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
