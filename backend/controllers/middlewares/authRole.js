const authRole = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const userRole = req.user?.rol; // viene del JWT

    if (!userRole) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (rolesPermitidos.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ message: 'No autorizado' });
  };
};

module.exports = authRole;