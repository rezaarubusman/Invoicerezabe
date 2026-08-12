export const errorMiddleware = (err, req, res, next) => {
    req.log.error(err.message);
    const message = err.message || "Something went wrong!";
    const status = err.status || 500;
    res.status(status).send({ message });
};
export const notFoundMiddleware = (req, res) => {
    res.status(404).send({ message: "Route not found" });
};
