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
  console.log("🚀 Iniciando seed SGAF con IDs desde 1...");

  // ============================================================
  // LIMPIEZA + RESET DE SECUENCIAS
  // ============================================================
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
  // 1. ESPECIALIDADES (IDs: 1-5)
  // ============================================================
  const especialidades = await prisma.especialidad.createMany({
    data: [
      { nombre: "Matemática", descripcion: "Ciencias exactas" },
      { nombre: "Física", descripcion: "Ciencias naturales" },
      { nombre: "Química", descripcion: "Ciencias naturales" },
      { nombre: "Lenguaje", descripcion: "Humanidades" },
      { nombre: "Historia", descripcion: "Humanidades" },
    ],
  });
  console.log(`✅ ${especialidades.count} especialidades creadas (IDs: 1-5)`);

  // ============================================================
  // 2. TUTORES (IDs: 1-3)
  // ============================================================
  const tutores = await prisma.tutor.createMany({
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
        email: "Jorge.quispe@example.com",
      },
    ],
  });
  console.log(`✅ ${tutores.count} tutores creados (IDs: 1-3)`);

  // ============================================================
  // 3. PERIODOS (IDs: 1-2)
  // ============================================================
  const anio = 2026;

  const periodos = await prisma.periodo.createMany({
    data: [
      {
        year: anio,
        numero: 1,
        nombre: `Primer Semestre ${anio}`,
        fecha_inicio: new Date(`${anio}-02-01T00:00:00Z`),
        fecha_fin: new Date(`${anio}-07-31T00:00:00Z`),
        limite_creditos: 22,
        estado: EstadoPeriodo.ACTIVO,
      },
      {
        year: anio,
        numero: 2,
        nombre: `Segundo Semestre ${anio}`,
        fecha_inicio: new Date(`${anio}-08-01T00:00:00Z`),
        fecha_fin: new Date(`${anio}-12-31T00:00:00Z`),
        limite_creditos: 22,
        estado: EstadoPeriodo.PREPARADO,
      },
    ],
  });
  console.log(`✅ ${periodos.count} periodos creados (IDs: 1-2)`);

  // ============================================================
  // 4. USUARIOS (IDs: 1-7)
  // ============================================================
  const usuarios = await prisma.usuario.createMany({
    data: [
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
        email: "pedro.sanchez@sgaf.com",
        password: passHash,
        nombre: "Pedro",
        appaterno: "Sánchez",
        apmaterno: "Cruz",
        telefono: "+51900999000",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "sofia.castillo@sgaf.com",
        password: passHash,
        nombre: "Sofía",
        appaterno: "Castillo",
        apmaterno: "Flores",
        telefono: "+51901111222",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
      },
      {
        email: "diego.postulante@sgaf.com",
        password: passHash,
        nombre: "Diego",
        appaterno: "Huamán",
        apmaterno: "Silva",
        telefono: "+51901333444",
        rol: Role.ESTUDIANTE,
        estado: EstadoUsuario.PENDIENTE_APROBACION,
      },
    ],
  });
  console.log(`✅ ${usuarios.count} usuarios creados (IDs: 1-7)`);

  // ============================================================
  // 5. DOCENTES (IDs: 3, 4 — comparten PK con Usuario)
  // ============================================================
  await prisma.docente.createMany({
    data: [
      {
        id_docente: 3,
        especialidad_id: 1, // Matemática
        fechaContrato: new Date("2024-03-15T00:00:00Z"),
      },
      {
        id_docente: 4,
        especialidad_id: 4, // Lenguaje
        fechaContrato: new Date("2023-08-01T00:00:00Z"),
      },
    ],
  });
  console.log("✅ 2 docentes creados (IDs: 3, 4)");

  // ============================================================
  // 6. ESTUDIANTES (IDs: 5, 6, 7 — comparten PK con Usuario)
  // ============================================================
  await prisma.estudiante.createMany({
    data: [
      {
        id_estudiante: 5,
        codigo_matricula: "MAT-2026-00001",
        tutor_id: 1,
      },
      {
        id_estudiante: 6,
        codigo_matricula: "MAT-2026-00002",
        tutor_id: 2,
      },
      {
        id_estudiante: 7,
        codigo_matricula: "MAT-2026-00003",
        tutor_id: null,
      },
    ],
  });
  console.log("✅ 3 estudiantes creados (IDs: 5, 6, 7)");

  // ============================================================
  // 7. MATERIAS (IDs: 1-3)
  // ============================================================
  const materias = await prisma.materia.createMany({
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
    ],
  });
  console.log(`✅ ${materias.count} materias creadas (IDs: 1-3)`);

  // ============================================================
  // 8. GRUPOS (IDs: 1-3)
  // ============================================================
  const grupos = await prisma.grupo.createMany({
    data: [
      {
        materia_id: 1,
        periodo_id: 1,
        docente_id: 3,
        codigo: "A",
        cupo_maximo: 30,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 2,
        periodo_id: 1,
        docente_id: 3,
        codigo: "A",
        cupo_maximo: 25,
        estado: EstadoGrupo.ABIERTO,
      },
      {
        materia_id: 3,
        periodo_id: 1,
        docente_id: 4,
        codigo: "A",
        cupo_maximo: 40,
        estado: EstadoGrupo.ABIERTO,
      },
    ],
  });
  console.log(`✅ ${grupos.count} grupos creados (IDs: 1-3)`);

  // ============================================================
  // 9. HORARIOS (IDs: 1-5)
  // ============================================================
  const horarios = await prisma.horarioGrupo.createMany({
    data: [
      {
        grupo_id: 1,
        dia_semana: Dias.LUNES,
        hora_inicio: new Date("1970-01-01T08:00:00Z"),
        hora_fin: new Date("1970-01-01T10:00:00Z"),
      },
      {
        grupo_id: 1,
        dia_semana: Dias.MIERCOLES,
        hora_inicio: new Date("1970-01-01T08:00:00Z"),
        hora_fin: new Date("1970-01-01T10:00:00Z"),
      },
      {
        grupo_id: 2,
        dia_semana: Dias.MARTES,
        hora_inicio: new Date("1970-01-01T10:00:00Z"),
        hora_fin: new Date("1970-01-01T12:00:00Z"),
      },
      {
        grupo_id: 2,
        dia_semana: Dias.JUEVES,
        hora_inicio: new Date("1970-01-01T10:00:00Z"),
        hora_fin: new Date("1970-01-01T12:00:00Z"),
      },
      {
        grupo_id: 3,
        dia_semana: Dias.VIERNES,
        hora_inicio: new Date("1970-01-01T14:00:00Z"),
        hora_fin: new Date("1970-01-01T16:00:00Z"),
      },
    ],
  });
  console.log(`✅ ${horarios.count} horarios creados (IDs: 1-5)`);

  // ============================================================
  // 10. INSCRIPCIONES (IDs: 1-3)
  // ============================================================
  const inscripciones = await prisma.inscripcion.createMany({
    data: [
      { estudiante_id: 5, grupo_id: 1, estado: EstadoInscripcion.INSCRITO },
      { estudiante_id: 5, grupo_id: 2, estado: EstadoInscripcion.INSCRITO },
      { estudiante_id: 6, grupo_id: 3, estado: EstadoInscripcion.INSCRITO },
    ],
  });
  console.log(`✅ ${inscripciones.count} inscripciones creadas (IDs: 1-3)`);

  // ============================================================
  // 11. OBLIGACIONES (IDs: 1-4)
  // ============================================================
  const obligaciones = await prisma.obligacionFinanciera.createMany({
    data: [
      // Pedro: matrícula PAGADA
      {
        estudiante_id: 5,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 1,
      },
      // Pedro: mensualidad PENDIENTE
      {
        estudiante_id: 5,
        razon: RazonPago.MENSUALIDAD,
        monto: 250.0,
        fecha_vencimiento: new Date("2026-04-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 1,
        inscripcion_id: 1,
      },
      // Sofía: matrícula PAGADA
      {
        estudiante_id: 6,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PAGADO,
        periodo_id: 1,
      },
      // Postulante: matrícula PENDIENTE (aún sin pago)
      {
        estudiante_id: 7,
        razon: RazonPago.MATRICULA,
        monto: 500.0,
        fecha_vencimiento: new Date("2026-03-15T00:00:00Z"),
        estado: EstadoDeuda.PENDIENTE,
        periodo_id: 1,
      },
    ],
  });
  console.log(`✅ ${obligaciones.count} obligaciones creadas (IDs: 1-4)`);

  // ============================================================
  // 12. PAGOS (IDs: 1-2)
  // ============================================================
  const pagos = await prisma.pago.createMany({
    data: [
      // Pago presencial de Pedro (verificado por recepcionista id 2)
      {
        obligacion_id: 1,
        monto: 500.0,
        metodo: MetodoPago.CAJA,
        estado: EstadoPago.ACEPTADO,
        verificado_por_usuario_id: 2,
        fecha_verificacion: new Date(),
      },
      // Pago online de Sofía
      {
        obligacion_id: 3,
        monto: 500.0,
        metodo: MetodoPago.PASARELA_EN_LINEA,
        estado: EstadoPago.ACEPTADO,
        referencia_pasarela: "PAS-2026-0001",
        verificado_por_usuario_id: null,
      },
    ],
  });
  console.log(`✅ ${pagos.count} pagos creados (IDs: 1-2)`);

  // ============================================================
  // 13. ASIGNACIONES (IDs: 1-3)
  // ============================================================
  const asignaciones = await prisma.asignacion.createMany({
    data: [
      {
        grupo_id: 1,
        docente_id: 3,
        titulo: "Práctica calificada 1",
        instrucciones: "Resolver los ejercicios 1 al 10 del capítulo 3",
        fecha_limite: new Date("2026-04-15T23:59:00Z"),
      },
      {
        grupo_id: 2,
        docente_id: 3,
        titulo: "Informe de laboratorio",
        instrucciones: "Informe del experimento de caída libre",
        fecha_limite: new Date("2026-04-20T23:59:00Z"),
      },
      {
        grupo_id: 3,
        docente_id: 4,
        titulo: "Ensayo sobre lectura",
        instrucciones: "Ensayo de 1000 palabras sobre el texto asignado",
        fecha_limite: new Date("2026-04-25T23:59:00Z"),
      },
    ],
  });
  console.log(`✅ ${asignaciones.count} asignaciones creadas (IDs: 1-3)`);

  // ============================================================
  // 14. ENTREGAS (IDs: 1-2)
  // ============================================================
  const entregas = await prisma.entrega.createMany({
    data: [
      // Pedro: entrega calificada
      {
        asignacion_id: 1,
        estudiante_id: 5,
        contenido_texto: "Aquí van mis respuestas de los ejercicios 1 al 10...",
        calificacion: 17.5,
        calificado_docente: 3,
        fecha_calificacion: new Date(),
      },
      // Sofía: entrega sin calificar
      {
        asignacion_id: 1,
        estudiante_id: 6,
        contenido_texto: "Mis respuestas a la práctica...",
      },
    ],
  });
  console.log(`✅ ${entregas.count} entregas creadas (IDs: 1-2)`);

  // ============================================================
  // 15. ARCHIVOS DE ENTREGA (IDs: 1-2)
  // ============================================================
  const archivos = await prisma.entregaArchivo.createMany({
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
    ],
  });
  console.log(`✅ ${archivos.count} archivos de entrega creados (IDs: 1-2)`);

  // ============================================================
  // RESUMEN
  // ============================================================
  console.log("\n📋 RESUMEN DE DATOS CREADOS:");
  console.log("├─ Especialidades:     IDs 1-5");
  console.log("├─ Tutores:            IDs 1-3");
  console.log("├─ Periodos:           IDs 1-2");
  console.log("├─ Usuarios:           IDs 1-7");
  console.log("├─ Docentes:           IDs 3-4");
  console.log("├─ Estudiantes:        IDs 5-7");
  console.log("├─ Materias:           IDs 1-3");
  console.log("├─ Grupos:             IDs 1-3");
  console.log("├─ Horarios:           IDs 1-5");
  console.log("├─ Inscripciones:      IDs 1-3");
  console.log("├─ Obligaciones:       IDs 1-4");
  console.log("├─ Pagos:              IDs 1-2");
  console.log("├─ Asignaciones:       IDs 1-3");
  console.log("├─ Entregas:           IDs 1-2");
  console.log("└─ Archivos:           IDs 1-2");

  console.log("\n👤 Usuarios de prueba (password: password123)");
  console.log("   admin@sgaf.com            → ADMINISTRADOR");
  console.log("   recepcion@sgaf.com        → RECEPCIONISTA");
  console.log("   juan.perez@sgaf.com       → PROFESOR (Matemática/Física)");
  console.log("   lucia.mendoza@sgaf.com    → PROFESOR (Lenguaje)");
  console.log("   pedro.sanchez@sgaf.com    → ESTUDIANTE activo");
  console.log("   sofia.castillo@sgaf.com   → ESTUDIANTE activo");
  console.log("   diego.postulante@sgaf.com → ESTUDIANTE pendiente (bloqueado)");

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