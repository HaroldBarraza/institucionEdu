-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRADOR', 'RECEPCIONISTA', 'ESTUDIANTE', 'PROFESOR');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('PENDIENTE_APROBACION', 'ACTIVO', 'SUSPENDIDO_MORA', 'INACTIVO');

-- CreateEnum
CREATE TYPE "Dias" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES');

-- CreateEnum
CREATE TYPE "EstadoGrupo" AS ENUM ('ABIERTO', 'CANCELADO', 'CERRADO');

-- CreateEnum
CREATE TYPE "RazonPago" AS ENUM ('MATRICULA', 'MENSUALIDAD', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoDeuda" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADA', 'VENCIDO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TRANSFERENCIA', 'CAJA', 'PASARELA_EN_LINEA');

-- CreateEnum
CREATE TYPE "EstadoInscripcion" AS ENUM ('INSCRITO', 'RETIRADO');

-- CreateEnum
CREATE TYPE "EstadoPeriodo" AS ENUM ('PREPARADO', 'ACTIVO', 'CERRADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('ACEPTADO', 'RECHAZADO', 'PENDIENTE');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "appaterno" TEXT NOT NULL,
    "apmaterno" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "rol" "Role" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE_APROBACION',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id_tutor" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "appaterno" TEXT NOT NULL,
    "apmaterno" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id_tutor")
);

-- CreateTable
CREATE TABLE "Docente" (
    "id_docente" INTEGER NOT NULL,
    "especialidad_id" INTEGER NOT NULL,
    "fechaContrato" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id_docente")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id_estudiante" INTEGER NOT NULL,
    "codigo_matricula" TEXT NOT NULL,
    "tutor_id" INTEGER,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "Especialidad" (
    "id_especialidad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id_especialidad")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id_materia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "costo_inscripcion" DECIMAL(10,2) NOT NULL,
    "costo_mensualidad" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "Periodo" (
    "id_periodo" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "limite_creditos" INTEGER NOT NULL,
    "estado" "EstadoPeriodo" NOT NULL DEFAULT 'PREPARADO',

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id_periodo")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id_grupo" SERIAL NOT NULL,
    "materia_id" INTEGER NOT NULL,
    "periodo_id" INTEGER NOT NULL,
    "docente_id" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "cupo_maximo" INTEGER NOT NULL,
    "estado" "EstadoGrupo" NOT NULL DEFAULT 'ABIERTO',

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "HorarioGrupo" (
    "id_horario" SERIAL NOT NULL,
    "grupo_id" INTEGER NOT NULL,
    "dia_semana" "Dias" NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,

    CONSTRAINT "HorarioGrupo_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id_inscripcion" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "grupo_id" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'INSCRITO',

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "ObligacionFinanciera" (
    "id_obligacion" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "razon" "RazonPago" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_emision" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" DATE NOT NULL,
    "estado" "EstadoDeuda" NOT NULL DEFAULT 'PENDIENTE',
    "periodo_id" INTEGER,
    "inscripcion_id" INTEGER,

    CONSTRAINT "ObligacionFinanciera_pkey" PRIMARY KEY ("id_obligacion")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "obligacion_id" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referencia_pasarela" TEXT,
    "comprobante_url" TEXT,
    "verificado_por_usuario_id" INTEGER,
    "fecha_verificacion" TIMESTAMP(3),

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id_asignacion" SERIAL NOT NULL,
    "grupo_id" INTEGER NOT NULL,
    "docente_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "instrucciones" TEXT NOT NULL,
    "fecha_limite" TIMESTAMP(3) NOT NULL,
    "creacion_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id_asignacion")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id_entrega" SERIAL NOT NULL,
    "asignacion_id" INTEGER NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "contenido_texto" TEXT,
    "fecha_entrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calificacion" DECIMAL(5,2),
    "calificado_docente" INTEGER,
    "fecha_calificacion" TIMESTAMP(3),

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id_entrega")
);

-- CreateTable
CREATE TABLE "EntregaArchivo" (
    "id_archivo" SERIAL NOT NULL,
    "entrega_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "EntregaArchivo_pkey" PRIMARY KEY ("id_archivo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_email_key" ON "Tutor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_codigo_matricula_key" ON "Estudiante"("codigo_matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_materia_id_periodo_id_codigo_key" ON "Grupo"("materia_id", "periodo_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_estudiante_id_grupo_id_key" ON "Inscripcion"("estudiante_id", "grupo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_asignacion_id_estudiante_id_key" ON "Entrega"("asignacion_id", "estudiante_id");

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "Especialidad"("id_especialidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "Tutor"("id_tutor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "Materia"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_periodo_id_fkey" FOREIGN KEY ("periodo_id") REFERENCES "Periodo"("id_periodo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "Docente"("id_docente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioGrupo" ADD CONSTRAINT "HorarioGrupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "Grupo"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "Estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "Grupo"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObligacionFinanciera" ADD CONSTRAINT "ObligacionFinanciera_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "Estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObligacionFinanciera" ADD CONSTRAINT "ObligacionFinanciera_periodo_id_fkey" FOREIGN KEY ("periodo_id") REFERENCES "Periodo"("id_periodo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObligacionFinanciera" ADD CONSTRAINT "ObligacionFinanciera_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "Inscripcion"("id_inscripcion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_obligacion_id_fkey" FOREIGN KEY ("obligacion_id") REFERENCES "ObligacionFinanciera"("id_obligacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_verificado_por_usuario_id_fkey" FOREIGN KEY ("verificado_por_usuario_id") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "Grupo"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "Docente"("id_docente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_asignacion_id_fkey" FOREIGN KEY ("asignacion_id") REFERENCES "Asignacion"("id_asignacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "Estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_calificado_docente_fkey" FOREIGN KEY ("calificado_docente") REFERENCES "Docente"("id_docente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaArchivo" ADD CONSTRAINT "EntregaArchivo_entrega_id_fkey" FOREIGN KEY ("entrega_id") REFERENCES "Entrega"("id_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;
