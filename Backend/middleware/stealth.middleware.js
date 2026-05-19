export const stealthGuard = (req, res, next) => {
  const secretKey = req.headers['x-stealth-key'];
  const expectedKey = process.env.LOGS_STEALTH_KEY;

  if (!secretKey || secretKey !== expectedKey) {
    // Devolvemos 404 para que el atacante piense que la ruta no existe
    return res.status(404).json({
      message: `Cannot ${req.method} ${req.originalUrl}`
    });
  }

  next();
};
