// TODO: desarrollar un middleware que registre los errores en una tabla de logs en la base de datos y que envíe un correo electrónico al administrador del sistema.
// NOTE: investigar sobre twilio para enviar mensajes de texto...
// NOTE: investigar sobre nodemailer para enviar correos electrónicos...
// NOTE: investigar sobre winston para guardar logs en archivos...
// Compare this snippet from src/middleware/errorLogsMiddleware.ts:
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import axios from 'axios';
