import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoDeuda, EstadoPago } from '../generated/prisma/enums.js';

@Injectable()
export class MockpayService {
  private readonly logger = new Logger('MockPay');

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async crearCheckout(obligacion_id: number, baseUrl: string) {
    const obligacion = await this.prisma.obligacionFinanciera.findUnique({
      where: { id_obligacion: obligacion_id },
    });

    if (!obligacion) {
      throw new NotFoundException(
        `La obligacion con id ${obligacion_id} no existe`,
      );
    }
    if (obligacion.estado === EstadoDeuda.PAGADO) {
      throw new BadRequestException('La obligacion ya esta pagada');
    }
    if (obligacion.estado === EstadoDeuda.CANCELADA) {
      throw new BadRequestException('La obligacion esta cancelada');
    }

    try {
      // 1. Leemos las variables desde tu .env con respaldo automático
      const secretKey =
        this.config.get<string>('MOCKPAY_SECRET_KEY') ||
        'sk_sandbox_ea45c43f664002308c6d5d51';

      const apiUrl =
        this.config.get<string>('MOCKPAY_API_URL') ||
        'https://mockpay-backend.onrender.com/api/v1/payments';

      // 2. Petición a la pasarela de pagos
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(obligacion.monto),
          currency: 'USD',
          webhook_url: `${baseUrl}/webhook`,
          metadata: {
            obligacion_id: obligacion.id_obligacion,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(
          `Error en API MockPay (${response.status}): ${errText}`,
        );
        throw new Error('Error al comunicar con la pasarela MockPay');
      }

      const data = await response.json();
      this.logger.log(`Checkout creado para obligacion #${obligacion_id}`);

      return {
        checkout_url: data.checkout_url,
      };
    } catch (error: any) {
      this.logger.error(`Error creando checkout: ${error.message}`);
      throw new BadRequestException('No se pudo generar el link de pago');
    }
  }

  async procesarWebhook(body: any) {
    const { id, amount, status, metadata, failure_reason } = body;

    if (!metadata || !metadata.obligacion_id) {
      throw new BadRequestException('Webhook sin metadata o sin obligacion_id');
    }

    const obligacion_id = Number(metadata.obligacion_id);

    const registrado = await this.prisma.pago.findFirst({
      where: {
        referencia_pasarela: String(id),
      },
    });

    if (registrado) {
      this.logger.log(`Pago MockPay ${id} ya registrado`);
      return { recibido: true, mensaje: 'Pago ya registrado' };
    }

    const estadoMapeado =
      status === 'SUCCEEDED' ? EstadoPago.ACEPTADO : EstadoPago.RECHAZADO;

    if (status !== 'SUCCEEDED') {
      this.logger.warn(`El pago ${id} fue rechazado. Razón: ${failure_reason}`);
    }

    const resultado = await this.prisma.$transaction(async (tx) => {
      const pagoCreado = await tx.pago.create({
        data: {
          obligacion_id: obligacion_id,
          monto: Number(amount),
          metodo: 'PASARELA_EN_LINEA',
          estado: estadoMapeado,
          referencia_pasarela: String(id),
          fecha_verificacion: new Date(),
        },
      });

      if (estadoMapeado === EstadoPago.ACEPTADO) {
        await tx.obligacionFinanciera.update({
          where: { id_obligacion: obligacion_id },
          data: { estado: EstadoDeuda.PAGADO },
        });
      }

      return pagoCreado;
    });

    this.logger.log(`Pago MockPay ${id} procesado -> ${estadoMapeado}`);

    return {
      recibido: true,
      estado: estadoMapeado,
      pago_id: resultado.id_pago,
    };
  }
}
