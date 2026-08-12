async function checkAdminMiddleware(req,res,next){
    if (req.headers.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Only admin can access this route"
        });
    }

    next();
}
module.exports = {
    checkAdminMiddleware,
}