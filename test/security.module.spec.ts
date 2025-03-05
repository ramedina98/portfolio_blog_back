import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../src/security/guards/jwt-auth.guard';
import { SecurityModule } from '../src/security/security.module';
import { JwtStrategy } from '../src/security/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';
import { IJwtPlayLoad } from 'src/interfaces/IAuth';
import { SERVER } from 'src/config/config';

describe('SecurityModule', () => {
    let jwtAuthGuard: JwtAuthGuard;
    let jwtStrategy: JwtStrategy;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SecurityModule],
        }).compile();

        jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(jwtAuthGuard).toBeDefined();
        expect(jwtStrategy).toBeDefined();
    });

    it('should validate a valid JWT token', async () => {
        const payload: IJwtPlayLoad = {
            id: '12345',
            email: 'example@mail.com',
            phone: '123-456-7890',
            create: new Date(),
            updated: new Date(),
        };

        // Genera un token válido con la clave secreta configurada.
        const token = jwtService.sign(payload, {
            secret: SERVER.JWTKEY,
            expiresIn: SERVER.JTIME,
        });

        // Mock del contexto
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        authorization: `Bearer ${token}`, // Simula un token válido
                    },
                }),
                getResponse: () => ({}) // Simula la respuesta
            }),
        } as ExecutionContext;

        // Mock de jwtService.verify para devolver un payload válido
        jest.spyOn(jwtService, 'verify').mockImplementation((token) => {
            return jwtService.verify(token, { secret: SERVER.JWTKEY });
        });

        // Verifica que canActivate devuelve true
        const result = await jwtAuthGuard.canActivate(mockContext);
        expect(result).toBe(true);
    });

    it('should throw an error if JWT token is invalid', async () => {
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        authorization: 'Bearer invalid_jwt_token',
                    },
                }),
                getResponse: () => ({})
            }),
        } as ExecutionContext;

        jest.spyOn(jwtService, 'verify').mockRejectedValue(new Error('Unauthorized') as never);

        await expect(jwtAuthGuard.canActivate(mockContext)).rejects.toThrowError('Unauthorized');
    });

    it('should return the payload from the JWT', async () => {
        const payload: IJwtPlayLoad = {
            id: '12345',
            email: 'example@mail.com',
            phone: '123-456-7890',
            create: new Date(),
            updated: new Date(),
        };

        jest.spyOn(jwtService, 'verify').mockResolvedValue(payload as never);

        const result = await jwtStrategy.validate(payload);
        expect(result).toEqual(payload);
    });
});
