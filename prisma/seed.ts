// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  Role,
  EstadoUsuario,
  EstadoPeriodo,
  EstadoGrupo,
  EstadoInscripcion,
  RazonPago,
  EstadoDeuda,
  MetodoPago,
  EstadoPago,
  Dias,
} from "../src/generated/prisma/enums.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Iniciando seed SGAF ampliado...");

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "EntregaArchivo",
      "Entrega",
      "Asignacion",
      "Pago",
      "ObligacionFinanciera",
      "Inscripcion",
      "HorarioGrupo",
      "Grupo",
      "Materia",
      "Periodo",
      "Estudiante",
      "Docente",
      "Tutor",
      "Especialidad",
      "Usuario"
    RESTART IDENTITY CASCADE;
  `);
  console.log("✅ Secuencias reseteadas a 1");

  const passHash = await bcrypt.hash("password123", 10);

  // ============================================================
  // 1. ESPECIALIDADES (IDs: 1-8)
  // ============================================================
  await prisma.especialidad.createMany({
    data: [
      { nombre: "Matemática", descripcion: "Ciencias exactas" },
      { nombre: "Física", descripcion: "Ciencias naturales" },
      { nombre: "Química", descripcion: "Ciencias naturales" },
      { nombre: "Lenguaje", descripcion: "Humanidades" },
      { nombre: "Historia", descripcion: "Humanidades" },
      { nombre: "Biología", descripcion: "Ciencias naturales" },
      { nombre: "Inglés", descripcion: "Idiomas" },
      { nombre: "Programación", descripcion: "Tecnología" },
    ],
  });
  console.log("✅ 8 especialidades (IDs: 1-8)");

  // ============================================================
  // 2. TUTORES (IDs: 1-6)
  // ============================================================
  await prisma.tutor.createMany({
    data: [
      {
        nombre: "Carlos",
        appaterno: "Ramírez",
        apmaterno: "Soto",
        telefono: "987654321",
        email: "carlos.ramirez@example.com",
      },
      {
        nombre: "María",
        appaterno: "Fernández",
        apmaterno: "López",
        telefono: "912345678",
        email: "maria.fernandez@example.com",
      },
      {
        nombre: "Jorge",
        appaterno: "Quispe",
        apmaterno: "Mamani",
        telefono: "998877665",
        email: "jorge.quispe@example.com",
      },
      {
        nombre: "Patricia",
        appaterno: "Vargas",
        apmaterno: "Ríos",
        telefono: "977665544",
        email: "patricia.vargas@example.com",
      },
      {
        nombre: "Roberto",
        appaterno: "Chávez",
        apmaterno: "Paredes",
        telefono: "966554433",
        email: "roberto.chavez@example.com",
      },
      {
        nombre: "Ana",
        appaterno: "Salazar",
        apmaterno: "Mendoza",
        telefono: "955443322",
        email: "ana.salazar@example.com",
      },
    ],
  });
  console.log("✅ 6 tutores (IDs: 1-6)");

  // ============================================================
  // 3. PERIODOS (IDs: 1-4)
  // ============================================================
  await prisma.periodo.createMany({
    data: [
      {
        year: 2025,
        numero: 1,
        nombre: "Primer Semestre 2025",
        fecha_inicio: new Date("2025-02-01T00:00:00Z"),
        fecha_fin: new Date("2025-07-31T00:00:00Z"),
        limite_creditos: 22,
        estado: EstadoPeriodo.CERRADO,
      },
      {
        year: 2025,
        numero: 2,
        nombre: "Segundo Semestre 2025",
        fecha_inicio: new Date("2025-08-01T00:00:00Z"),
        fecha_fin: new Date("2025-12-31T00:00:00Z"),
        limite_creditos: 22,
        estado: EstadoPeriodo.CERRADO,
      },
      {
        year: 2026,
        numero: 1,
        nombre: "Primer Semestre 2026",
        fecha_inicio: new Date("2026-02-01T00:00:00Z"),
        fecha_fin: new Date("2026-07-31T00:00:00Z"),
        limite_creditos: 22,
        estado: EstadoPeriodo.ACTIVO,
      },
      {
        year: 2026,
        numero: 2,
        nombre: "Segundo Semestre 2026",
        fecha_inicio: new Date("2026-08-01T00:00:00Z"),
        fecha_fin: new Date("2026-12-31T00:00:00Z"),
        limite_creditos: 22,
        estado: EstadoPeriodo.PREPARADO,
      },
    ],
  });
  console.log("✅ 4 periodos (IDs: 1-4)");

  // ============================================================
  // 4. USUARIOS (IDs: 1-20)
  // ============================================================
  await prisma.usuario.createMany({
    data: [
      // --- Administradores (IDs: 1-2) ---
      {
        email: "admin@sgaf.com",
        password: passHash,
        nombre: "Ana",
        appaterno: "Torres",
        apmaterno: "Vega",
        telefono: "+51900111222",
        rol: Role.ADMINISTRADOR,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "admin2@sgaf.com",
        password: passHash,
        nombre: "Ricardo",
        appaterno: "Salas",
        apmaterno: "Ibáñez",
        telefono: "+51900111333",
        rol: Role.ADMINISTRADOR,
        estado: EstadoUsuario.ACTIVO,
      },
      // --- Recepcionistas (IDs: 3-4) ---
      {
        email: "recepcion@sgaf.com",
        password: passHash,
        nombre: "Luis",
        appaterno: "Paredes",
        apmaterno: "Rojas",
        telefono: "+51900333444",
        rol: Role.RECEPCIONISTA,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "recepcion2@sgaf.com",
        password: passHash,
        nombre: "Carmen",
        appaterno: "Vega",
        apmaterno: "León",
        telefono: "+51900333555",
        rol: Role.RECEPCIONISTA,
        estado: EstadoUsuario.ACTIVO,
      },
      // --- Profesores (IDs: 5-10) ---
      {
        email: "juan.perez@sgaf.com",
        password: passHash,
        nombre: "Juan",
        appaterno: "Pérez",
        apmaterno: "Gómez",
        telefono: "+51900555666",
        rol: Role.PROFESOR,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "lucia.mendoza@sgaf.com",
        password: passHash,
        nombre: "Lucía",
        appaterno: "Mendoza",
        apmaterno: "Ríos",
        telefono: "+51900777888",
        rol: Role.PROFESOR,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "roberto.diaz@sgaf.com",
        password: passHash,
        nombre: "Roberto",
        appaterno: "Díaz",
        apmaterno: "Castro",
        telefono: "+51900666777",
        rol: Role.PROFESOR,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "elena.quispe@sgaf.com",
        password: passHash,
        nombre: "Elena",
        appaterno: "Quispe",
        apmaterno: "Mamani",
        telefono: "+51900888999",
        rol: Role.PROFESOR,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "mario.ramos@sgaf.com",
        password: passHash,
        nombre: "Mario",
        appaterno: "Ramos",
        apmaterno: "Flores",
        telefono: "+51900444555",
        rol: Role.PROFESOR,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "gabriela.soto@sgaf.com",
        password: passHash,
        nombre: "Gabriela",
        appaterno: "Soto",
        apmaterno: "Núñez",
        telefono: "+51900999000",
        rol: Role.PROFESOR,
        estado: EstadoUsuario.ACTIVO,
      },
      // --- Estudiantes activos (IDs: 11-16) ---
      {
        email: "pedro.sanchez@sgaf.com",
        password: passHash,
        nombre: "Pedro",
        appaterno: "Sánchez",
        apmaterno: "Cruz",
        telefono: "+51910111222",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "sofia.castillo@sgaf.com",
        password: passHash,
        nombre: "Sofía",
        appaterno: "Castillo",
        apmaterno: "Flores",
        telefono: "+51910222333",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "andrea.rosas@sgaf.com",
        password: passHash,
        nombre: "Andrea",
        appaterno: "Rosas",
        apmaterno: "Huamán",
        telefono: "+51910333444",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "mateo.torres@sgaf.com",
        password: passHash,
        nombre: "Mateo",
        appaterno: "Torres",
        apmaterno: "Bautista",
        telefono: "+51910444555",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "valeria.leon@sgaf.com",
        password: passHash,
        nombre: "Valeria",
        appaterno: "León",
        apmaterno: "Ochoa",
        telefono: "+51910555666",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "sebastian.parra@sgaf.com",
        password: passHash,
        nombre: "Sebastián",
        appaterno: "Parra",
        apmaterno: "Villalobos",
        telefono: "+51910666777",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      // --- Estudiante suspendido por mora (ID: 17) ---
      {
        email: "moroso@sgaf.com",
        password: passHash,
        nombre: "Jorge",
        appaterno: "Morales",
        apmaterno: "Torres",
        telefono: "+51910777888",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.SUSPENDIDO_MORA,
      },
      // --- Postulantes pendientes (IDs: 18-20) ---
      {
        email: "diego.postulante@sgaf.com",
        password: passHash,
        nombre: "Diego",
        appaterno: "Huamán",
        apmaterno: "Silva",
        telefono: "+51910888999",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.PENDIENTE_APROBACION,
      },
      {
        email: "camila.postulante@sgaf.com",
        password: passHash,
        nombre: "Camila",
        appaterno: "Rojas",
        apmaterno: "Paredes",
        telefono: "+51910999000",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.PENDIENTE_APROBACION,
      },
      {
        email: "fernando.postulante@sgaf.com",
        password: passHash,
        nombre: "Fernando",
        appaterno: "Vera",
        apmaterno: "Campos",
        telefono: "+51911000111",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.PENDIENTE_APROBACION,
      },
    ],
  });
  console.log("✅ 20 usuarios (IDs: 1-20)");

  // ============================================================
  // 5. DOCENTES (IDs: 5-10 — comparten PK con Usuario)
  // ============================================================
  await prisma.docente.createMany({
    data: [
      {
        id_docente: 5,
        especialidad_id: 1, // Matemática
        fechaContrato: new Date("2024-03-15T00:00:00Z"),
      },
      {
        id_docente: 6,
        especialidad_id: 4, // Lenguaje
        fechaContrato: new Date("2023-08-01T00:00:00Z"),
      },
      {
        id_docente: 7,
        especialidad_id: 2, // Física
        fechaContrato: new Date("2024-01-10T00:00:00Z"),
      },
      {
        id_docente: 8,
        especialidad_id: 6, // Biología
        fechaContrato: new Date("2023-05-20T00:00:00Z"),
      },
      {
        id_docente: 9,
        especialidad_id: 7, // Inglés
        fechaContrato: new Date("2022-11-01T00:00:00Z"),
      },
      {
        id_docente: 10,
        especialidad_id: 8, // Programación
        fechaContrato: new Date("2024-04-05T00:00:00Z"),
      },
    ],
  });
  console.log("✅ 6 docentes (IDs: 5-10)");

  // ============================================================
  // 6. ESTUDIANTES (IDs: 11-20 — comparten PK con Usuario)
  // ============================================================
  await prisma.estudiante.createMany({
    data: [
      { id_estudiante: 11, codigo_matricula: "MAT-2026-00001", tutor_id: 1 },
      { id_estudiante: 12, codigo_matricula: "MAT-2026-00002", tutor_id: 2 },
      { id_estudiante: 13, codigo_matricula: "MAT-2026-00003", tutor_id: 3 },
      { id_estudiante: 14, codigo_matricula: "MAT-2026-00004", tutor_id: 4 },
      { id_estudiante: 15, codigo_matricula: "MAT-2026-00005", tutor_id: 5 },
      { id_estudiante: 16, codigo_matricula: "MAT-2026-00006", tutor_id: 6 },
      { id_estudiante: 17, codigo_matricula: "MAT-2026-00007", tutor_id: 1 },
      { id_estudiante: 18, codigo_matricula: "MAT-2026-00008", tutor_id: null },
      { id_estudiante: 19, codigo_matricula: "MAT-2026-00009", tutor_id: 2 },
      { id_estudiante: 20, codigo_matricula: "MAT-2026-00010", tutor_id: null },
    ],
  });
  console.log("✅ 10 estudiantes (IDs: 11-20)");

  // ============================================================
  // 7. MATERIAS (IDs: 1-6)
  // ============================================================
  await prisma.materia.createMany({
    data: [
      {
        nombre: "Matemática I",
        creditos: 4,
        costo_inscripcion: 150.0,
        costo_mensualidad: 250.0,
        especialidad_id: 1,
      },
      {
        nombre: "Física I",
        creditos: 5,
        costo_inscripcion: 180.0,
        costo_mensualidad: 280.0,
        especialidad_id: 2,
      },
      {
        nombre: "Lenguaje I",
        creditos: 3,
        costo_inscripcion: 120.0,
        costo_mensualidad: 200.0,
        especialidad_id: 4,
      },
      {
        nombre: "Biología I",
        creditos: 4,
        costo_inscripcion: 160.0,
        costo_mensualidad: 260.0,
        especialidad_id: 6,
      },
      {
        nombre: "Inglés I",
        creditos: 3,
        costo_inscripcion: 130.0,
        costo_mensualidad: 210.0,
        especialidad_id: 7,
      },
      {
        nombre: "Programación I",
        creditos: 5,
        costo_inscripcion: 200.0,
        costo_mensualidad: 300.0,
        especialidad_id: 8,
      },
    ],
  });
  console.log("✅ 6 materias (IDs: 1-6)");

  // ============================================================
  // 8. GRUPOS (IDs: 1-9)
  // ============================================================
  await prisma.grupo.createMany({
    data: [
      // Primer Semestre 2026 (periodo_id: 3)
      {
        materia_id: 1,
        periodo_id: 3,
        docente_id: 5,
        codigo: "A",
        cupo_maximo: 30,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 1,
        periodo_id: 3,
        docente_id: 5,
        codigo: "B",
        cupo_maximo: 25,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 2,
        periodo_id: 3,
        docente_id: 7,
        codigo: "A",
        cupo_maximo: 25,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 3,
        periodo_id: 3,
        docente_id: 6,
        codigo: "A",
        cupo_maximo: 40,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 4,
        periodo_id: 3,
        docente_id: 8,
        codigo: "A",
        cupo_maximo: 30,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 5,
        periodo_id: 3,
        docente_id: 9,
        codigo: "A",
        cupo_maximo: 35,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 6,
        periodo_id: 3,
        docente_id: 10,
        codigo: "A",
        cupo_maximo: 20,
        estado: EstadoGrupo.ABIERTO,
      },
      // Grupo cerrado (para probar rechazo de inscripción)
      {
        materia_id: 1,
        periodo_id: 3,
        docente_id: 5,
        codigo: "C",
        cupo_maximo: 30,
        estado: EstadoGrupo.CERRADO,
      },
      // Grupo en periodo no activo (para probar rechazo)
      {
        materia_id: 1,
        periodo_id: 4,
        docente_id: 5,
        codigo: "A",
        cupo_maximo: 30,
        estado: EstadoGrupo.ABIERTO,
      },
    ],
  });
  console.log("✅ 9 grupos (IDs: 1-9)");

  // ============================================================
  // 9. HORARIOS (IDs: 1-16)
  // ============================================================
  await prisma.horarioGrupo.createMany({
    data: [
      // Grupo 1: Mate A — Lunes y Miércoles 08-10
      { grupo_id: 1, dia_semana: Dias.LUNES, hora_inicio: new Date("1970-01-01T08:00:00Z"), hora_fin: new Date("1970-01-01T10:00:00Z") },
      { grupo_id: 1, dia_semana: Dias.MIERCOLES, hora_inicio: new Date("1970-01-01T08:00:00Z"), hora_fin: new Date("1970-01-01T10:00:00Z") },
      // Grupo 2: Mate B — Lunes y Miércoles 10-12 (para probar traslape con A)
      { grupo_id: 2, dia_semana: Dias.LUNES, hora_inicio: new Date("1970-01-01T10:00:00Z"), hora_fin: new Date("1970-01-01T12:00:00Z") },
      { grupo_id: 2, dia_semana: Dias.MIERCOLES, hora_inicio: new Date("1970-01-01T10:00:00Z"), hora_fin: new Date("1970-01-01T12:00:00Z") },
      // Grupo 3: Física A — Martes y Jueves 10-12
      { grupo_id: 3, dia_semana: Dias.MARTES, hora_inicio: new Date("1970-01-01T10:00:00Z"), hora_fin: new Date("1970-01-01T12:00:00Z") },
      { grupo_id: 3, dia_semana: Dias.JUEVES, hora_inicio: new Date("1970-01-01T10:00:00Z"), hora_fin: new Date("1970-01-01T12:00:00Z") },
      // Grupo 4: Lenguaje A — Viernes 14-16
      { grupo_id: 4, dia_semana: Dias.VIERNES, hora_inicio: new Date("1970-01-01T14:00:00Z"), hora_fin: new Date("1970-01-01T16:00:00Z") },
      // Grupo 5: Biología A — Martes y Jueves 08-10
      { grupo_id: 5, dia_semana: Dias.MARTES, hora_inicio: new Date("1970-01-01T08:00:00Z"), hora_fin: new Date("1970-01-01T10:00:00Z") },
      { grupo_id: 5, dia_semana: Dias.JUEVES, hora_inicio: new Date("1970-01-01T08:00:00Z"), hora_fin: new Date("1970-01-01T10:00:00Z") },
      // Grupo 6: Inglés A — Lunes y Miércoles 14-16
      { grupo_id: 6, dia_semana: Dias.LUNES, hora_inicio: new Date("1970-01-01T14:00:00Z"), hora_fin: new Date("1970-01-01T16:00:00Z") },
      { grupo_id: 6, dia_semana: Dias.MIERCOLES, hora_inicio: new Date("1970-01-01T14:00:00Z"), hora_fin: new Date("1970-01-01T16:00:00Z") },
      // Grupo 7: Programación A — Martes y Jueves 16-18
      { grupo_id: 7, dia_semana: Dias.MARTES, hora_inicio: new Date("1970-01-01T16:00:00Z"), hora_fin: new Date("1970-01-01T18:00:00Z") },
      { grupo_id: 7, dia_semana: Dias.JUEVES, hora_inicio: new Date("1970-01-01T16:00:00Z"), hora_fin: new Date("1970-01-01T18:00:00Z") },
      // Grupo 8: Mate C (cerrado) — Viernes 08-10
      { grupo_id: 8, dia_semana: Dias.VIERNES, hora_inicio: new Date("1970-01-01T08:00:00Z"), hora_fin: new Date("1970-01-01T10:00:00Z") },
      // Grupo 9: Mate A del 2026-2 (periodo no activo)
      { grupo_id: 9, dia_semana: Dias.LUNES, hora_inicio: new Date("1970-01-01T08:00:00Z"), hora_fin: new Date("1970-01-01T10:00:00Z") },
    ],
  });
  console.log("✅ 16 horarios (IDs: 1-16)");

  // ============================================================
  // 10. INSCRIPCIONES (IDs: 1-10)
  // ============================================================
  await prisma.inscripcion.createMany({
    data: [
      // Pedro (11) — Mate A + Física A
      { estudiante_id: 11, grupo_id: 1, estado: EstadoInscripcion.INSCRITO },
      { estudiante_id: 11, grupo_id: 3, estado: EstadoInscripcion.INSCRITO },
      // Sofía (12) — Mate B + Lenguaje A
      { estudiante_id: 12, grupo_id: 2, estado: EstadoInscripcion.INSCRITO },
      { estudiante_id: 12, grupo_id: 4, estado: EstadoInscripcion.INSCRITO },
      // Andrea (13) — Mate A + Biología A
      { estudiante_id: 13, grupo_id: 1, estado: EstadoInscripcion.INSCRITO },
      { estudiante_id: 13, grupo_id: 5, estado: EstadoInscripcion.INSCRITO },
      // Mateo (14) — Lenguaje A + Inglés A
      { estudiante_id: 14, grupo_id: 4, estado: EstadoInscripcion.INSCRITO },
      { estudiante_id: 14, grupo_id: 6, estado: EstadoInscripcion.INSCRITO },
      // Valeria (15) — Mate A + Inglés A
      { estudiante_id: 15, grupo_id: 1, estado: EstadoInscripcion.INSCRITO },
      { estudiante_id: 15, grupo_id: 6, estado: EstadoInscripcion.INSCRITO },
    ],
  });
  console.log("✅ 10 inscripciones (IDs: 1-10)");

  // ============================================================
  // 11. OBLIGACIONES (IDs: 1-20)
  // ============================================================
  await prisma.obligacionFinanciera.createMany({
    data: [
      // Pedro (11) — matrícula PAGADA + mensualidad PENDIENTE
      {
        estudiante_id: 11,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 3,
      },
      {
        estudiante_id: 11,
        razon: RazonPago.MENSUALIDAD,
        monto: 250.0,
        fecha_vencimiento: new Date("2026-04-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 3,
        inscripcion_id: 1,
      },
      // Sofía (12) — matrícula PAGADA + mensualidad PAGADA
      {
        estudiante_id: 12,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 3,
      },
      {
        estudiante_id: 12,
        razon: RazonPago.MENSUALIDAD,
        monto: 250.0,
        fecha_vencimiento: new Date("2026-04-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 3,
        inscripcion_id: 3,
      },
      // Andrea (13) — matrícula PAGADA + mensualidad VENCIDA
      {
        estudiante_id: 13,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 3,
      },
      {
        estudiante_id: 13,
        razon: RazonPago.MENSUALIDAD,
        monto: 250.0,
        fecha_vencimiento: new Date("2026-03-20T00:00:00Z"),
        estado: EstadoDeuda.VENCIDO,
        periodo_id: 3,
        inscripcion_id: 5,
      },
      // Mateo (14) — matrícula PAGADA + mensualidad PENDIENTE
      {
        estudiante_id: 14,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 3,
      },
      {
        estudiante_id: 14,
        razon: RazonPago.MENSUALIDAD,
        monto: 250.0,
        fecha_vencimiento: new Date("2026-04-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 3,
        inscripcion_id: 7,
      },
      // Valeria (15) — matrícula PAGADA + mensualidad PENDIENTE
      {
        estudiante_id: 15,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 3,
      },
      {
        estudiante_id: 15,
        razon: RazonPago.MENSUALIDAD,
        monto: 250.0,
        fecha_vencimiento: new Date("2026-04-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 3,
        inscripcion_id: 9,
      },
      // Sebastián (16) — matrícula PENDIENTE
      {
        estudiante_id: 16,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 3,
      },
      // Jorge moroso (17) — matrícula PAGADA + mensualidad VENCIDA
      {
        estudiante_id: 17,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 3,
      },
      {
        estudiante_id: 17,
        razon: RazonPago.MENSUALIDAD,
        monto: 250.0,
        fecha_vencimiento: new Date("2026-03-01T00:00:00Z"),
        estado: EstadoDeuda.VENCIDO,
        periodo_id: 3,
      },
      // Diego postulante (18) — matrícula PENDIENTE (sin pago todavía)
      {
        estudiante_id: 18,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 3,
      },
      // Camila postulante (19) — matrícula PENDIENTE
      {
        estudiante_id: 19,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 3,
      },
      // Fernando postulante (20) — matrícula PENDIENTE
      {
        estudiante_id: 20,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 3,
      },
    ],
  });
  console.log("✅ 16 obligaciones (IDs: 1-16)");

  // ============================================================
  // 12. PAGOS (IDs: 1-6)
  // ============================================================
  await prisma.pago.createMany({
    data: [
      // Pago presencial de Pedro (verificado por recepcionista id 3)
      {
        obligacion_id: 1,
        monto: 500.0,
        metodo: MetodoPago.CAJA,
        estado: EstadoPago.ACEPTADO,
        verificado_por_usuario_id: 3,
        fecha_verificacion: new Date(),
      },
      // Pago online de Sofía (matrícula)
      {
        obligacion_id: 3,
        monto: 500.0,
        metodo: MetodoPago.PASARELA_EN_LINEA,
        estado: EstadoPago.ACEPTADO,
        referencia_pasarela: "MP-2026-0001",
        verificado_por_usuario_id: null,
      },
      // Pago de mensualidad de Sofía
      {
        obligacion_id: 4,
        monto: 250.0,
        metodo: MetodoPago.TRANSFERENCIA,
        estado: EstadoPago.ACEPTADO,
        verificado_por_usuario_id: 3,
        fecha_verificacion: new Date(),
      },
      // Pago rechazado de Andrea (intento fallido)
      {
        obligacion_id: 6,
        monto: 250.0,
        metodo: MetodoPago.PASARELA_EN_LINEA,
        estado: EstadoPago.RECHAZADO,
        referencia_pasarela: "MP-2026-0002",
        verificado_por_usuario_id: null,
      },
      // Pago pendiente de Mateo
      {
        obligacion_id: 8,
        monto: 250.0,
        metodo: MetodoPago.PASARELA_EN_LINEA,
        estado: EstadoPago.PENDIENTE,
        referencia_pasarela: "MP-2026-0003",
        verificado_por_usuario_id: null,
      },
      // Pago de Jorge moroso (matrícula pagada, mensualidad no)
      {
        obligacion_id: 11,
        monto: 500.0,
        metodo: MetodoPago.CAJA,
        estado: EstadoPago.ACEPTADO,
        verificado_por_usuario_id: 4,
        fecha_verificacion: new Date(),
      },
    ],
  });
  console.log("✅ 6 pagos (IDs: 1-6)");

  // ============================================================
  // 13. ASIGNACIONES (IDs: 1-8)
  // ============================================================
  await prisma.asignacion.createMany({
    data: [
      {
        grupo_id: 1,
        docente_id: 5,
        titulo: "Práctica calificada 1",
        instrucciones: "Resolver los ejercicios 1 al 10 del capítulo 3",
        fecha_limite: new Date("2026-04-15T23:59:00Z"),
      },
      {
        grupo_id: 1,
        docente_id: 5,
        titulo: "Práctica calificada 2",
        instrucciones: "Resolver los ejercicios del capítulo 4",
        fecha_limite: new Date("2026-05-15T23:59:00Z"),
      },
      {
        grupo_id: 3,
        docente_id: 7,
        titulo: "Informe de laboratorio",
        instrucciones: "Informe del experimento de caída libre",
        fecha_limite: new Date("2026-04-20T23:59:00Z"),
      },
      {
        grupo_id: 4,
        docente_id: 6,
        titulo: "Ensayo sobre lectura",
        instrucciones: "Ensayo de 1000 palabras sobre el texto asignado",
        fecha_limite: new Date("2026-04-25T23:59:00Z"),
      },
      {
        grupo_id: 5,
        docente_id: 8,
        titulo: "Reporte de microscopía",
        instrucciones: "Observación de células y reporte de resultados",
        fecha_limite: new Date("2026-04-30T23:59:00Z"),
      },
      {
        grupo_id: 6,
        docente_id: 9,
        titulo: "Reading comprehension",
        instrucciones: "Leer y responder el texto asignado",
        fecha_limite: new Date("2026-05-05T23:59:00Z"),
      },
      {
        grupo_id: 7,
        docente_id: 10,
        titulo: "Proyecto: Calculadora",
        instrucciones: "Implementar una calculadora en el lenguaje del curso",
        fecha_limite: new Date("2026-05-20T23:59:00Z"),
      },
      {
        grupo_id: 2,
        docente_id: 5,
        titulo: "Tarea de refuerzo",
        instrucciones: "Resolver los ejercicios de refuerzo de la semana",
        fecha_limite: new Date("2026-04-10T23:59:00Z"),
      },
    ],
  });
  console.log("✅ 8 asignaciones (IDs: 1-8)");

  // ============================================================
  // 14. ENTREGAS (IDs: 1-8)
  // ============================================================
  await prisma.entrega.createMany({
    data: [
      // Pedro (11) — entrega calificada
      {
        asignacion_id: 1,
        estudiante_id: 11,
        contenido_texto: "Aquí van mis respuestas de los ejercicios 1 al 10...",
        calificacion: 17.5,
        calificado_docente: 5,
        fecha_calificacion: new Date(),
      },
      // Sofía (12) — entrega sin calificar
      {
        asignacion_id: 8,
        estudiante_id: 12,
        contenido_texto: "Mis respuestas a la tarea de refuerzo...",
      },
      // Andrea (13) — entrega calificada
      {
        asignacion_id: 1,
        estudiante_id: 13,
        contenido_texto: "Mi solución a los ejercicios...",
        calificacion: 15.0,
        calificado_docente: 5,
        fecha_calificacion: new Date(),
      },
      // Mateo (14) — entrega sin calificar
      {
        asignacion_id: 4,
        estudiante_id: 14,
        contenido_texto: "Mi ensayo sobre la lectura...",
      },
      // Valeria (15) — entrega calificada
      {
        asignacion_id: 1,
        estudiante_id: 15,
        contenido_texto: "Aquí va mi práctica...",
        calificacion: 19.0,
        calificado_docente: 5,
        fecha_calificacion: new Date(),
      },
      // Pedro (11) — entrega de Física calificada
      {
        asignacion_id: 3,
        estudiante_id: 11,
        contenido_texto: "Mi informe de laboratorio...",
        calificacion: 16.5,
        calificado_docente: 7,
        fecha_calificacion: new Date(),
      },
      // Andrea (13) — entrega de Biología sin calificar
      {
        asignacion_id: 5,
        estudiante_id: 13,
        contenido_texto: "Mi reporte de microscopía...",
      },
      // Sofía (12) — entrega de Lenguaje sin calificar
      {
        asignacion_id: 4,
        estudiante_id: 12,
        contenido_texto: "Mi ensayo sobre el texto...",
      },
    ],
  });
  console.log("✅ 8 entregas (IDs: 1-8)");

  // ============================================================
  // 15. ARCHIVOS DE ENTREGA (IDs: 1-6)
  // ============================================================
  await prisma.entregaArchivo.createMany({
    data: [
      {
        entrega_id: 1,
        url: "https://storage.sgaf.com/entregas/pedro-practica1.pdf",
        nombre: "practica1.pdf",
        mimeType: "application/pdf",
      },
      {
        entrega_id: 1,
        url: "https://storage.sgaf.com/entregas/pedro-anexo.xlsx",
        nombre: "anexo.xlsx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      {
        entrega_id: 6,
        url: "https://storage.sgaf.com/entregas/pedro-informe.pdf",
        nombre: "informe_fisica.pdf",
        mimeType: "application/pdf",
      },
      {
        entrega_id: 3,
        url: "https://storage.sgaf.com/entregas/andrea-practica.pdf",
        nombre: "practica_andrea.pdf",
        mimeType: "application/pdf",
      },
      {
        entrega_id: 4,
        url: "https://storage.sgaf.com/entregas/mateo-ensayo.docx",
        nombre: "ensayo_mateo.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        entrega_id: 7,
        url: "https://storage.sgaf.com/entregas/andrea-microscopia.jpg",
        nombre: "microscopia.jpg",
        mimeType: "image/jpeg",
      },
    ],
  });
  console.log("✅ 6 archivos de entrega (IDs: 1-6)");

  // ============================================================
  // RESUMEN
  // ============================================================
  console.log("\n📋 RESUMEN DE DATOS CREADOS:");
  console.log("├─ Especialidades:      8   (IDs 1-8)");
  console.log("├─ Tutores:             6   (IDs 1-6)");
  console.log("├─ Periodos:            4   (IDs 1-4)");
  console.log("├─ Usuarios:            20  (IDs 1-20)");
  console.log("├─ Docentes:            6   (IDs 5-10)");
  console.log("├─ Estudiantes:         10  (IDs 11-20)");
  console.log("├─ Materias:            6   (IDs 1-6)");
  console.log("├─ Grupos:              9   (IDs 1-9)");
  console.log("├─ Horarios:            16  (IDs 1-16)");
  console.log("├─ Inscripciones:       10  (IDs 1-10)");
  console.log("├─ Obligaciones:        16  (IDs 1-16)");
  console.log("├─ Pagos:               6   (IDs 1-6)");
  console.log("├─ Asignaciones:        8   (IDs 1-8)");
  console.log("├─ Entregas:            8   (IDs 1-8)");
  console.log("└─ Archivos entrega:    6   (IDs 1-6)");

  console.log("\n👤 CREDENCIALES (password: password123)");
  console.log("\n🔴 ADMINISTRADORES:");
  console.log("   admin@sgaf.com              → ADMIN 1");
  console.log("   admin2@sgaf.com             → ADMIN 2");
  console.log("\n🟠 RECEPCIONISTAS:");
  console.log("   recepcion@sgaf.com          → RECEP 1");
  console.log("   recepcion2@sgaf.com         → RECEP 2");
  console.log("\n🟡 PROFESORES:");
  console.log("   juan.perez@sgaf.com         → Mate/Física");
  console.log("   lucia.mendoza@sgaf.com      → Lenguaje");
  console.log("   roberto.diaz@sgaf.com       → Física");
  console.log("   elena.quispe@sgaf.com       → Biología");
  console.log("   mario.ramos@sgaf.com        → Inglés");
  console.log("   gabriela.soto@sgaf.com      → Programación");
  console.log("\n🟢 ESTUDIANTES ACTIVOS:");
  console.log("   pedro.sanchez@sgaf.com      → Mate A + Física A");
  console.log("   sofia.castillo@sgaf.com     → Mate B + Lenguaje A");
  console.log("   andrea.rosas@sgaf.com       → Mate A + Biología A (morosa)");
  console.log("   mateo.torres@sgaf.com       → Lenguaje A + Inglés A");
  console.log("   valeria.leon@sgaf.com       → Mate A + Inglés A");
  console.log("   sebastian.parra@sgaf.com    → sin inscripciones");
  console.log("\n🟣 SUSPENDIDO POR MORA:");
  console.log("   moroso@sgaf.com             → Jorge (solo lectura)");
  console.log("\n⚫ POSTULANTES PENDIENTES:");
  console.log("   diego.postulante@sgaf.com   → sin pago");
  console.log("   camila.postulante@sgaf.com  → sin pago");
  console.log("   fernando.postulante@sgaf.com → sin pago");

  console.log("\n🧪 CASOS DE PRUEBA SUGERIDOS:");
  console.log("   1. Inscribir Sebastián (16) en Mate A (grupo 1) → OK");
  console.log("   2. Inscribir Sebastián en Mate B (grupo 2) → falla por misma materia");
  console.log("   3. Inscribir Sebastián en Mate A + Física A + Biología A → OK");
  console.log("   4. Inscribir a Pedro (11) en Mate B (grupo 2) → falla por misma materia");
  console.log("   5. Inscribir a Sofía (12) en Física A (grupo 3) → falla por traslape con Mate B");
  console.log("   6. Inscribir en grupo 8 (cerrado) → falla por estado del grupo");
  console.log("   7. Inscribir en grupo 9 (periodo PREPARADO) → falla por periodo");
  console.log("   8. Inscribir a moroso (17) → falla por estado SUSPENDIDO_MORA");
  console.log("   9. Login con admin@sgaf.com → OK");
  console.log("  10. Login con moroso@sgaf.com → falla por estado");

  console.log("\n🎉 Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });