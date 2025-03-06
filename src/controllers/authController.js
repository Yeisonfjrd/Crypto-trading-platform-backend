import speakeasy from 'speakeasy';
import { User } from '../models/index.js';

export const enable2FA = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const secret = speakeasy.generateSecret({ length: 20 });

    await User.update(
      { twoFactorSecret: secret.base32 },
      { where: { id: userId } }
    );

    res.json({
      qrCodeUrl: secret.otpauth_url,
      message: '2FA habilitado exitosamente. Escanea el código QR con tu aplicación autenticadora.',
    });
  } catch (error) {
    console.error('Error al habilitar 2FA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.auth.userId;

    const user = await User.findByPk(userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA no está habilitado para este usuario' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (verified) {
      res.json({ success: true, message: 'Código verificado exitosamente' });
    } else {
      res.status(400).json({ error: 'Código inválido' });
    }
  } catch (error) {
    console.error('Error al verificar 2FA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await User.update(
      { twoFactorSecret: null },
      { where: { id: userId } }
    );

    res.json({ success: true, message: '2FA deshabilitado exitosamente' });
  } catch (error) {
    console.error('Error al deshabilitar 2FA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};