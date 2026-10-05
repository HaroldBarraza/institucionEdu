import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoDeuda, EstadoPago } from '../generated/prisma/enums.js';
import { number, string } from 'joi';
@Injectable()
export class MockpayService {
  private readonly logger = new Logger('MockPay');
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  async crearCheckout(obligacion_id: number) {
    const obligacion = await this.prisma.obligacionFinanciera.findUnique({
      where: {
        id_obligacion: obligacion_id,
      },
      include: {
        estudiante: {
          include: {
            usuario: true,
          },
        },
      },
    });
    if (!obligacion) {
      throw new NotFoundException(`laobligacion id ${obligacion_id} no existe`);
    }
    if (obligacion.estado === EstadoDeuda.PAGADO) {
      throw new BadRequestException(`La obligacion ya esta pagada`);
    }
    if (obligacion.estado === EstadoDeuda.CANCELADA) {
      throw new BadRequestException(`la obligacion esta cancelada`);
    }
    const secretKey =
      this.config.get<string>('MOCKPAY_SECRET_KEY') ||
      'sk_sandbox_fdca488d5f25b3c63285ee5f';
    const apiUrl = 'https://api-mock-payment.funvaltech.cloud/api/v1/payments';
    const externalRef = `OBL-${obligacion_id}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(obligacion.monto),
          currency: 'USD',
          metadata: {
            external_reference: externalRef,
            obligacion_id: obligacion_id,
            email: obligacion.estudiante.usuario.email,
          },
        }),
      });
      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Error en API MockPay: ${errText}`);
        throw new BadRequestException('Error al comunicar con pasarela');
      }
      const data = await response.json();
      this.logger.log(
        `Checkout MockPay creado para obligacion #${obligacion_id} -> Transacción ID: ${data.id}`,
      );
      return {
        payment_id: data.id,
        checkout_url: data.checkout_url,
        init_point: data.checkout_url,
      };
    } catch (err: any) {
      this.logger.error(`Error crean el pago ${err.message}`);
      throw new BadRequestException(
        `Error al generar el checkout: ${err.message}`,
      );
    }
  }
  async procesarWebhook(body: any) {
    const { event, id, status, metadata } = body;

    const externalRef = metadata?.external_reference || metadata?.order_id;
    const obligacion_id =
      metadata?.obligacion_id ||
      (externalRef ? Number(externalRef.replace('OBL-', '')) : null);

    if (!obligacion_id) {
      throw new BadRequestException('Webhook sin obligacion_id en metadata');
    }

    const registrado = await this.prisma.pago.findFirst({
      where: { referencia_pasarela: String(id) },
    });

    if (registrado) {
      this.logger.log(`Pago MockPay ${id} ya registrado previamente`);
      return { recibido: true, mensaje: 'Pago ya registrado' };
    }

    const obligacion = await this.prisma.obligacionFinanciera.findUnique({
      where: { id_obligacion: Number(obligacion_id) },
    });

    if (!obligacion) {
      throw new NotFoundException(`Obligación #${obligacion_id} no encontrada`);
    }
    const esExitoso = status === 'SUCCEEDED' || event === 'payment.succeeded';
    const estadoMapeado = esExitoso
      ? EstadoPago.ACEPTADO
      : EstadoPago.RECHAZADO;

    const resultado = await this.prisma.$transaction(async (tx) => {
      const pagoCreado = await tx.pago.create({
        data: {
          obligacion_id: Number(obligacion_id),
          monto: body.amount ? Number(body.amount) : Number(obligacion.monto),
          metodo: 'PASARELA_EN_LINEA',
          estado: estadoMapeado,
          referencia_pasarela: String(id),
          fecha_verificacion: new Date(),
        },
      });

      if (estadoMapeado === EstadoPago.ACEPTADO) {
        await tx.obligacionFinanciera.update({
          where: { id_obligacion: Number(obligacion_id) },
          data: { estado: EstadoDeuda.PAGADO },
        });
      }

      return pagoCreado;
    });

    this.logger.log(
      `Pago MockPay ID: ${id} procesado -> Estado: ${estadoMapeado}`,
    );

    return {
      recibido: true,
      estado: estadoMapeado,
      pago_id: resultado.id_pago,
    };
  }
}
