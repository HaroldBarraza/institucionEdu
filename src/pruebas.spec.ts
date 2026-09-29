import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from './prisma/prisma.service.js';
import {
  Dias,
  EstadoDeuda,
  EstadoGrupo,
  EstadoInscripcion,
  EstadoPago,
  EstadoPeriodo,
  EstadoUsuario,
  MetodoPago,
  Role,
} from './generated/prisma/enums.js';

import { EspecialidadService } from './especialidad/especialidad.service.js';
import { TutorService } from './tutor/tutor.service.js';
import { PeriodoService } from './periodo/periodo.service.js';
import { UsuarioService } from './usuario/usuario.service.js';
import { AuthService } from './auth/auth.service.js';
import { AuthController } from './auth/auth.controller.js';
import { LocalAuthGuard } from './auth/guards/local-auth.guard.js';
import { HorarioService } from './horario/horario.service.js';
import { InscripcionService } from './inscripcion/inscripcion.service.js';
import { PagoService } from './pago/pago.service.js';
import { EntregaService } from './entrega/entrega.service.js';
import { JwtService } from '@nestjs/jwt';

// ============================================================
// ESPECIALIDAD SERVICE
// ============================================================
describe('EspecialidadService', () => {
  let service: EspecialidadService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      especialidad: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspecialidadService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<EspecialidadService>(EspecialidadService);
  });

  describe('findall', () => {
    it('devuelve la lista de especialidades', async () => {
      const lista = [
        { id_especialidad: 1, nombre: 'Matemática' },
        { id_especialidad: 2, nombre: 'Física' },
      ];
      prismaMock.especialidad.findMany.mockResolvedValue(lista);

      const resultado = await service.findall();

      expect(resultado).toEqual(lista);
      expect(prismaMock.especialidad.findMany).toHaveBeenCalledOnce();
    });
  });

  describe('findone', () => {
    it('devuelve la especialidad cuando existe', async () => {
      const esp = { id_especialidad: 1, nombre: 'Matemática' };
      prismaMock.especialidad.findUnique.mockResolvedValue(esp);

      const resultado = await service.findone(1);

      expect(resultado).toEqual(esp);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      prismaMock.especialidad.findUnique.mockResolvedValue(null);

      await expect(service.findone(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('crea la especialidad si el nombre no existe', async () => {
      prismaMock.especialidad.findFirst.mockResolvedValue(null);
      prismaMock.especialidad.create.mockResolvedValue({
        id_especialidad: 1,
        nombre: 'Matemática',
      });

      const resultado = await service.create({ nombre: 'Matemática' });

      expect(resultado.nombre).toBe('Matemática');
      expect(prismaMock.especialidad.create).toHaveBeenCalledOnce();
    });

    it('lanza ConflictException si el nombre ya existe', async () => {
      prismaMock.especialidad.findFirst.mockResolvedValue({
        id_especialidad: 1,
        nombre: 'Matemática',
      });

      await expect(service.create({ nombre: 'Matemática' })).rejects.toThrow(
        ConflictException,
      );
    });
  });
});

// ============================================================
// TUTOR SERVICE
// ============================================================
describe('TutorService', () => {
  let service: TutorService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      tutor: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TutorService>(TutorService);
  });

  describe('findAll', () => {
    it('devuelve la lista de tutores', async () => {
      prismaMock.tutor.findMany.mockResolvedValue([
        { id_tutor: 1, nombre: 'Carlos' },
      ]);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('devuelve el tutor cuando existe', async () => {
      prismaMock.tutor.findFirst.mockResolvedValue({
        id_tutor: 1,
        nombre: 'Carlos',
      });

      const resultado = await service.findOne(1);

      expect(resultado.id_tutor).toBe(1);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      prismaMock.tutor.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('crea un tutor correctamente', async () => {
      const dto = {
        nombre: 'Carlos',
        appaterno: 'Ramírez',
        apmaterno: 'Soto',
        telefono: '987654321',
        email: 'carlos@example.com',
      };
      prismaMock.tutor.create.mockResolvedValue({ id_tutor: 1, ...dto });

      const resultado = await service.create(dto);

      expect(resultado.id_tutor).toBe(1);
      expect(prismaMock.tutor.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('update', () => {
    it('actualiza el tutor si existe', async () => {
      prismaMock.tutor.findUnique.mockResolvedValue({ id_tutor: 1 });
      prismaMock.tutor.update.mockResolvedValue({
        id_tutor: 1,
        nombre: 'Actualizado',
      });

      const resultado = await service.update(1, { nombre: 'Actualizado' });

      expect(resultado.nombre).toBe('Actualizado');
    });

    it('lanza NotFoundException si no existe', async () => {
      prismaMock.tutor.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { nombre: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

// ============================================================
// PERIODO SERVICE
// ============================================================
describe('PeriodoService', () => {
  let service: PeriodoService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      periodo: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodoService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PeriodoService>(PeriodoService);
  });

  describe('findAll', () => {
    it('devuelve la lista de periodos', async () => {
      prismaMock.periodo.findMany.mockResolvedValue([
        { id_periodo: 1, nombre: 'Primer Semestre 2026' },
      ]);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException cuando no existe', async () => {
      prismaMock.periodo.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('devuelve el periodo cuando existe', async () => {
      prismaMock.periodo.findUnique.mockResolvedValue({
        id_periodo: 1,
        nombre: 'Primer Semestre 2026',
      });

      const resultado = await service.findOne(1);

      expect(resultado.id_periodo).toBe(1);
    });
  });

  describe('create', () => {
    it('lanza ConflictException si el año ya tiene periodos', async () => {
      prismaMock.periodo.findFirst.mockResolvedValue({ id_periodo: 1 });

      await expect(service.create({ year: 2026 })).rejects.toThrow(
        ConflictException,
      );
    });

    it('crea los dos semestres del año', async () => {
      prismaMock.periodo.findFirst.mockResolvedValue(null);
      prismaMock.$transaction.mockResolvedValue([
        { id_periodo: 1, numero: 1, nombre: 'Primer Semestre 2026' },
        { id_periodo: 2, numero: 2, nombre: 'Segundo Semestre 2026' },
      ]);

      const resultado = await service.create({ year: 2026 });

      expect(resultado).toHaveLength(2);
      expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    });
  });

  describe('updateEstado', () => {
    it('lanza error si el periodo ya está en ese estado', async () => {
      prismaMock.periodo.findUnique.mockResolvedValue({
        id_periodo: 1,
        estado: EstadoPeriodo.ACTIVO,
        nombre: 'Primer Semestre 2026',
      });

      await expect(
        service.updateEstado(1, { estado: EstadoPeriodo.ACTIVO }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si la transición no es válida (PREPARADO → CERRADO)', async () => {
      prismaMock.periodo.findUnique.mockResolvedValue({
        id_periodo: 1,
        estado: EstadoPeriodo.PREPARADO,
        nombre: 'Primer Semestre 2026',
      });

      await expect(
        service.updateEstado(1, { estado: EstadoPeriodo.CERRADO }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si ya hay otro ACTIVO', async () => {
      prismaMock.periodo.findUnique.mockResolvedValue({
        id_periodo: 2,
        estado: EstadoPeriodo.PREPARADO,
        nombre: 'Segundo Semestre 2026',
      });
      prismaMock.periodo.findFirst.mockResolvedValue({
        id_periodo: 1,
        nombre: 'Primer Semestre 2026',
      });

      await expect(
        service.updateEstado(2, { estado: EstadoPeriodo.ACTIVO }),
      ).rejects.toThrow(BadRequestException);
    });

    it('actualiza el estado cuando la transición es válida', async () => {
      prismaMock.periodo.findUnique.mockResolvedValue({
        id_periodo: 1,
        estado: EstadoPeriodo.PREPARADO,
        nombre: 'Primer Semestre 2026',
      });
      prismaMock.periodo.findFirst.mockResolvedValue(null);
      prismaMock.periodo.update.mockResolvedValue({
        id_periodo: 1,
        estado: EstadoPeriodo.ACTIVO,
      });

      const resultado = await service.updateEstado(1, {
        estado: EstadoPeriodo.ACTIVO,
      });

      expect(resultado.estado).toBe(EstadoPeriodo.ACTIVO);
    });
  });
});

// ============================================================
// USUARIO SERVICE
// ============================================================
describe('UsuarioService', () => {
  let service: UsuarioService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      usuario: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  describe('findAll', () => {
    it('devuelve la lista de usuarios', async () => {
      prismaMock.usuario.findMany.mockResolvedValue([
        { id_usuario: 1, email: 'a@sgaf.com' },
      ]);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('hashea la password antes de guardar', async () => {
      const dto = {
        email: 'juan@sgaf.com',
        password: 'password123',
        nombre: 'Juan',
        appaterno: 'Pérez',
        apmaterno: 'Gómez',
        telefono: '+51987654321',
        rol: Role.PROFESOR,
      };

      let passwordHasheada = '';
      prismaMock.usuario.create.mockImplementation(({ data }: any) => {
        passwordHasheada = data.password;
        return Promise.resolve({ id_usuario: 1, ...data });
      });

      await service.create(dto);

      expect(passwordHasheada).not.toBe('password123');
      expect(await bcrypt.compare('password123', passwordHasheada)).toBe(true);
    });

    it('no devuelve la password en la respuesta', async () => {
      const dto = {
        email: 'juan@sgaf.com',
        password: 'password123',
        nombre: 'Juan',
        appaterno: 'Pérez',
        apmaterno: 'Gómez',
        telefono: '+51987654321',
        rol: Role.PROFESOR,
      };

      prismaMock.usuario.create.mockResolvedValue({
        id_usuario: 1,
        email: dto.email,
        nombre: dto.nombre,
        rol: dto.rol,
      });

      const resultado = await service.create(dto);

      expect(resultado).not.toHaveProperty('password');
    });
  });

  describe('update', () => {
    it('lanza NotFoundException si no existe', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { nombre: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findemail', () => {
    it('devuelve el usuario con su password para autenticación', async () => {
      const usuario = {
        id_usuario: 1,
        email: 'a@sgaf.com',
        password: 'hash',
      };
      prismaMock.usuario.findUnique.mockResolvedValue(usuario);

      const resultado = await service.findemail('a@sgaf.com');

      expect(resultado).toHaveProperty('password');
      expect(resultado?.email).toBe('a@sgaf.com');
    });

    it('devuelve null si no existe', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      const resultado = await service.findemail('noexiste@sgaf.com');

      expect(resultado).toBeNull();
    });
  });
});

// ============================================================
// AUTH SERVICE
// ============================================================
describe('AuthService', () => {
  let service: AuthService;
  let usuarioServiceMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    usuarioServiceMock = { findemail: vi.fn() };
    jwtServiceMock = { sign: vi.fn().mockReturnValue('fake-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuarioService, useValue: usuarioServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('devuelve el usuario sin password si las credenciales son válidas', async () => {
      const hash = await bcrypt.hash('password123', 10);
      usuarioServiceMock.findemail.mockResolvedValue({
        id_usuario: 1,
        email: 'admin@sgaf.com',
        password: hash,
        rol: 'ADMINISTRADOR',
      });

      const resultado = await service.validateUser(
        'admin@sgaf.com',
        'password123',
      );

      expect(resultado).not.toBeNull();
      expect(resultado).not.toHaveProperty('password');
      expect(resultado.email).toBe('admin@sgaf.com');
    });

    it('devuelve null si el usuario no existe', async () => {
      usuarioServiceMock.findemail.mockResolvedValue(null);

      const resultado = await service.validateUser(
        'no@sgaf.com',
        'password123',
      );

      expect(resultado).toBeNull();
    });

    it('devuelve null si la password no coincide', async () => {
      const hash = await bcrypt.hash('password123', 10);
      usuarioServiceMock.findemail.mockResolvedValue({
        id_usuario: 1,
        email: 'admin@sgaf.com',
        password: hash,
      });

      const resultado = await service.validateUser('admin@sgaf.com', 'wrong');

      expect(resultado).toBeNull();
    });
  });

  describe('login', () => {
    it('devuelve un access_token', async () => {
      const resultado = await service.login({
        id_usuario: 1,
        email: 'admin@sgaf.com',
        rol: 'ADMINISTRADOR',
      });

      expect(resultado).toHaveProperty('access_token');
      expect(jwtServiceMock.sign).toHaveBeenCalledOnce();
    });
  });
});

// ============================================================
// AUTH CONTROLLER
// ============================================================
describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = { login: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('login llama a authService.login con el usuario del request', async () => {
    const usuario = {
      id_usuario: 1,
      email: 'a@sgaf.com',
      rol: 'ADMINISTRADOR',
    };
    authServiceMock.login.mockResolvedValue({ access_token: 'token' });

    const resultado = await controller.login({ user: usuario } as any);

    expect(resultado).toEqual({ access_token: 'token' });
    expect(authServiceMock.login).toHaveBeenCalledWith(usuario);
  });
});

// ============================================================
// HORARIO SERVICE
// ============================================================
describe('HorarioService', () => {
  let service: HorarioService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      horarioGrupo: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HorarioService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<HorarioService>(HorarioService);
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      prismaMock.horarioGrupo.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('lanza error si hora_inicio >= hora_fin', async () => {
      await expect(
        service.create({
          grupo_id: 1,
          dia_semana: Dias.LUNES,
          hora_inicio: '10:00',
          hora_fin: '08:00',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('crea el horario cuando las horas son válidas', async () => {
      prismaMock.horarioGrupo.create.mockResolvedValue({ id_horario: 1 });

      const resultado = await service.create({
        grupo_id: 1,
        dia_semana: Dias.LUNES,
        hora_inicio: '08:00',
        hora_fin: '10:00',
      });

      expect(resultado.id_horario).toBe(1);
      expect(prismaMock.horarioGrupo.create).toHaveBeenCalledOnce();
    });
  });

  describe('update', () => {
    it('lanza error si la nueva hora de fin es menor o igual a la de inicio', async () => {
      prismaMock.horarioGrupo.findUnique.mockResolvedValue({
        id_horario: 1,
        hora_inicio: new Date('1970-01-01T08:00:00Z'),
        hora_fin: new Date('1970-01-01T10:00:00Z'),
      });

      await expect(service.update(1, { hora_fin: '07:00' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

// ============================================================
// INSCRIPCION SERVICE
// ============================================================
describe('InscripcionService', () => {
  let service: InscripcionService;
  let prismaMock: any;

  const grupoBase = {
    id_grupo: 1,
    materia_id: 1,
    periodo_id: 1,
    docente_id: 3,
    codigo: 'A',
    cupo_maximo: 30,
    estado: EstadoGrupo.ABIERTO,
    materia: { id_materia: 1, creditos: 4, nombre: 'Matemática I' },
    periodo: {
      id_periodo: 1,
      nombre: 'Primer Semestre 2026',
      estado: EstadoPeriodo.ACTIVO,
      limite_creditos: 22,
    },
    horarios: [
      {
        dia_semana: 'LUNES',
        hora_inicio: new Date('1970-01-01T08:00:00Z'),
        hora_fin: new Date('1970-01-01T10:00:00Z'),
      },
    ],
  };

  const estudianteBase = {
    id_estudiante: 5,
    codigo_matricula: 'MAT-2026-00001',
    usuario: { id_usuario: 5, estado: EstadoUsuario.ACTIVO },
  };

  beforeEach(async () => {
    prismaMock = {
      grupo: { findUnique: vi.fn() },
      estudiante: { findUnique: vi.fn() },
      inscripcion: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscripcionService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<InscripcionService>(InscripcionService);
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      prismaMock.inscripcion.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('lanza error si el grupo no existe', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 999 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el grupo no está ABIERTO', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue({
        ...grupoBase,
        estado: EstadoGrupo.CERRADO,
      });

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el periodo no está ACTIVO', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue({
        ...grupoBase,
        periodo: { ...grupoBase.periodo, estado: EstadoPeriodo.PREPARADO },
      });

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el estudiante no existe', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue(grupoBase);
      prismaMock.estudiante.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el estudiante no está ACTIVO', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue(grupoBase);
      prismaMock.estudiante.findUnique.mockResolvedValue({
        ...estudianteBase,
        usuario: { estado: EstadoUsuario.SUSPENDIDO_MORA },
      });

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el grupo está lleno', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue({
        ...grupoBase,
        cupo_maximo: 2,
      });
      prismaMock.estudiante.findUnique.mockResolvedValue(estudianteBase);
      prismaMock.inscripcion.count.mockResolvedValue(2);

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si ya está inscrito en la misma materia', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue(grupoBase);
      prismaMock.estudiante.findUnique.mockResolvedValue(estudianteBase);
      prismaMock.inscripcion.count.mockResolvedValue(0);
      prismaMock.inscripcion.findMany.mockResolvedValue([
        {
          grupo: {
            materia_id: 1,
            materia: { creditos: 4 },
            horarios: [],
          },
        },
      ]);

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si supera el límite de créditos', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue({
        ...grupoBase,
        materia: { id_materia: 2, creditos: 5 },
        materia_id: 2,
      });
      prismaMock.estudiante.findUnique.mockResolvedValue(estudianteBase);
      prismaMock.inscripcion.count.mockResolvedValue(0);
      prismaMock.inscripcion.findMany.mockResolvedValue([
        {
          grupo: {
            materia_id: 99,
            materia: { creditos: 20 },
            horarios: [],
          },
        },
      ]);

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si hay traslape de horario', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue(grupoBase);
      prismaMock.estudiante.findUnique.mockResolvedValue(estudianteBase);
      prismaMock.inscripcion.count.mockResolvedValue(0);
      prismaMock.inscripcion.findMany.mockResolvedValue([
        {
          grupo: {
            materia_id: 99,
            materia: { creditos: 3 },
            horarios: [
              {
                dia_semana: 'LUNES',
                hora_inicio: new Date('1970-01-01T09:00:00Z'),
                hora_fin: new Date('1970-01-01T11:00:00Z'),
              },
            ],
          },
        },
      ]);

      await expect(
        service.create({ estudiante_id: 5, grupo_id: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('crea la inscripción cuando todo está correcto', async () => {
      prismaMock.grupo.findUnique.mockResolvedValue(grupoBase);
      prismaMock.estudiante.findUnique.mockResolvedValue(estudianteBase);
      prismaMock.inscripcion.count.mockResolvedValue(0);
      prismaMock.inscripcion.findMany.mockResolvedValue([]);
      prismaMock.inscripcion.create.mockResolvedValue({
        id_inscripcion: 1,
        estudiante_id: 5,
        grupo_id: 1,
      });

      const resultado = await service.create({
        estudiante_id: 5,
        grupo_id: 1,
      });

      expect(resultado.id_inscripcion).toBe(1);
      expect(prismaMock.inscripcion.create).toHaveBeenCalledOnce();
    });
  });

  describe('update', () => {
    it('lanza error si el estado es el mismo', async () => {
      prismaMock.inscripcion.findUnique.mockResolvedValue({
        id_inscripcion: 1,
        estado: EstadoInscripcion.INSCRITO,
      });

      await expect(
        service.update(1, { estado: EstadoInscripcion.INSCRITO }),
      ).rejects.toThrow(BadRequestException);
    });

    it('actualiza el estado correctamente', async () => {
      prismaMock.inscripcion.findUnique.mockResolvedValue({
        id_inscripcion: 1,
        estado: EstadoInscripcion.INSCRITO,
      });
      prismaMock.inscripcion.update.mockResolvedValue({
        id_inscripcion: 1,
        estado: EstadoInscripcion.RETIRADO,
      });

      const resultado = await service.update(1, {
        estado: EstadoInscripcion.RETIRADO,
      });

      expect(resultado.estado).toBe(EstadoInscripcion.RETIRADO);
    });
  });
});

// ============================================================
// PAGO SERVICE
// ============================================================
describe('PagoService', () => {
  let service: PagoService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      pago: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        aggregate: vi.fn(),
      },
      obligacionFinanciera: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagoService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PagoService>(PagoService);
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      prismaMock.pago.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('lanza error si la obligación no existe', async () => {
      prismaMock.obligacionFinanciera.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          obligacion_id: 999,
          monto: 500,
          metodo: MetodoPago.CAJA,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza error si la obligación ya está PAGADA', async () => {
      prismaMock.obligacionFinanciera.findUnique.mockResolvedValue({
        id_obligacion: 1,
        monto: 500,
        estado: EstadoDeuda.PAGADO,
      });

      await expect(
        service.create({
          obligacion_id: 1,
          monto: 500,
          metodo: MetodoPago.CAJA,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el monto supera la deuda', async () => {
      prismaMock.obligacionFinanciera.findUnique.mockResolvedValue({
        id_obligacion: 1,
        monto: 500,
        estado: EstadoDeuda.PENDIENTE,
      });

      await expect(
        service.create({
          obligacion_id: 1,
          monto: 600,
          metodo: MetodoPago.CAJA,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('crea el pago cuando todo está correcto', async () => {
      prismaMock.obligacionFinanciera.findUnique.mockResolvedValue({
        id_obligacion: 1,
        monto: 500,
        estado: EstadoDeuda.PENDIENTE,
      });
      prismaMock.pago.create.mockResolvedValue({ id_pago: 1 });

      const resultado = await service.create({
        obligacion_id: 1,
        monto: 500,
        metodo: MetodoPago.CAJA,
      });

      expect(resultado.id_pago).toBe(1);
    });
  });

  describe('aprobar', () => {
    it('lanza error si el pago ya está aceptado', async () => {
      prismaMock.pago.findUnique.mockResolvedValue({
        id_pago: 1,
        estado: EstadoPago.ACEPTADO,
      });

      await expect(
        service.aprobar(1, { verificado_por_usuario_id: 2 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el pago fue rechazado', async () => {
      prismaMock.pago.findUnique.mockResolvedValue({
        id_pago: 1,
        estado: EstadoPago.RECHAZADO,
      });

      await expect(
        service.aprobar(1, { verificado_por_usuario_id: 2 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('rechazar', () => {
    it('lanza error si el pago ya está aceptado', async () => {
      prismaMock.pago.findUnique.mockResolvedValue({
        id_pago: 1,
        estado: EstadoPago.ACEPTADO,
      });

      await expect(
        service.rechazar(1, { verificado_por_usuario_id: 2 }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

// ============================================================
// ENTREGA SERVICE
// ============================================================
describe('EntregaService', () => {
  let service: EntregaService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      entrega: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntregaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<EntregaService>(EntregaService);
  });

  describe('finOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      prismaMock.entrega.findUnique.mockResolvedValue(null);

      await expect(service.finOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('crea la entrega correctamente', async () => {
      prismaMock.entrega.create.mockResolvedValue({ id_entrega: 1 });

      const resultado = await service.create({
        asignacion_id: 1,
        estudiante_id: 5,
        contenido_texto: 'Mi respuesta',
      });

      expect(resultado.id_entrega).toBe(1);
    });
  });

  describe('calificar', () => {
    it('lanza error si la entrega ya está calificada', async () => {
      prismaMock.entrega.findUnique.mockResolvedValue({
        id_entrega: 1,
        calificacion: 15,
      });

      await expect(
        service.calificar(1, { calificado_docente: 3, calificacion: 18 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('califica la entrega cuando no estaba calificada', async () => {
      prismaMock.entrega.findUnique.mockResolvedValue({
        id_entrega: 1,
        calificacion: null,
      });
      prismaMock.entrega.update.mockResolvedValue({
        id_entrega: 1,
        calificacion: 18,
      });

      const resultado = await service.calificar(1, {
        calificado_docente: 3,
        calificacion: 18,
      });

      expect(resultado.calificacion).toBe(18);
    });
  });
});
