import { Request, Response, NextFunction } from 'express';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const secret =  process.env.SECRET_KEY ?? 'user-key';
const secret_admin =  process.env.SECRET_ADMIN_KEY ?? 'secret-key';

const contractSchema = Joi.object({
  user: Joi.string().required(),
  created_date: Joi.date(),
  pay_date: Joi.date(),
  status: Joi.string().valid("pending","active","unactive","canceled","expired"),
  used: Joi.number(),
  key: Joi.string()
});

const validateContracts = (req: Request, res: Response, next: NextFunction) => {
  const { error } = contractSchema.validate(req.body);
  if (error) {
    return res.status(400).json({status:"error",data: error.details[0].message });
  }
  next();
};

const validateContractsId = (req: Request, res: Response, next: NextFunction) => {
  const idRequired = Joi.object({_id: Joi.number().required()})
  const { error }  = idRequired.validate(req.params);
  if (error) {
    return res.status(400).json({status:"error",data: error.details[0].message });
  }
  next();
};

const handleAuthErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Token inválido o expirado', error: err.message });
  }
  next(err);
};

const generateToken = (payload: any) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

const authenticateToken = expressjwt({
  secret: secret as unknown as GetVerificationKey,
  algorithms: ['HS256'], 
  requestProperty: 'user', 
});

const authenticateTokenAdmin = expressjwt({
  secret: secret_admin as unknown as GetVerificationKey,
  algorithms: ['HS256'], 
  requestProperty: 'auth', 
});

export {validateContracts,validateContractsId,handleAuthErrors,authenticateToken,generateToken,authenticateTokenAdmin}