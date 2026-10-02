import { BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoDeuda, EstadoPago } from '../generated/prisma/enums.js';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger('MercadoPago');
  private readonly mp: MercadoPagoConfig;
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.mp = new MercadoPagoConfig({
      accessToken: this.config.get<string>('MP_ACCESS_TOKEN')!,
    });
  }
  async crearPreferencia(obligacion_id: number, baseUrl: string) {
    const obligacion = await this.prisma.obligacionFinanciera.findUnique({
      where: { id_obligacion: obligacion_id },
      include: {
        estudiante: {
          include: {
            usuario: true,
          },
        },
      },
    });
    if(!obligacion){
        throw new NotFoundException(`la obligacion con id ${obligacion_id} no existe`)
    }
    if(obligacion.estado === EstadoDeuda.PAGADO) {
        throw new BadRequestException('La obligacion ya esta pagada')
    }
    if(obligacion.estado === EstadoDeuda.CANCELADA) {
        throw new BadRequestException('La obligacion esta cancelada');
    }
    const preference = new Preference(this.mp);

    const response = await preference.create({
        body:{
            items:[{
                id: `OBL-${obligacion_id}`,
                title:`Pago ${obligacion.razon}`,
                description: `Obligacion #${obligacion.id_obligacion}`,
                quantity: 1,
                unit_price: Number(obligacion.monto),
                currency_id: "PEN"
            }],
            payer: {
                email: obligacion.estudiante.usuario.email,
                name: obligacion.estudiante.usuario.nombre,
                surname: obligacion.estudiante.usuario.appaterno,
            },
            back_urls:{
                success: `${baseUrl}/api/doc/pagos/mercadopago/exito`,
                failure: `${baseUrl}/api/doc/pagos/mercadopago/fallo`,
                pending: `${baseUrl}/api/doc/pagos/mercadopago/pendiente`,
            },
            notification_url: `${baseUrl}/pagos/mercadopago/webhook`,
            external_reference: `OBL-${obligacion_id}`,
            statement_descriptor: "SGAF"
        },
    })
    this.logger.log(
        `Preferecia creada para obligacion #${obligacion_id} -> ${response.id}`,
    )
    return {
        preference_id:response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point
    };
  }
  async procesarWebhook(paymentId: string) {
    const payment = new Payment(this.mp)

    let pago: any;
    try{
        pago = await payment.get({id:paymentId})
    }catch (err){
        this.logger.error(`Error consultando pago ${paymentId}: ${err}`)
        throw new BadRequestException('Pago no encontrado en Mercado Pago');
    }
    if(!pago?.external_reference){
        throw new BadRequestException('Pago sin external reference')
    }
    const obligacion_id = Number(pago.external_reference.replace('OBL-', ''));
    const registrado = await this.prisma.pago.findFirst({
        where:{
            referencia_pasarela: String(pago.id)
        }
    })
    if(registrado){
        this.logger.log(`Pago ${paymentId} ya regitrado`)
        return {recibido: true, mensaje:"Pago ya registrado"}
    }
    const estadoMapeado = pago.status === "approved" ? EstadoPago.ACEPTADO : pago.status === "rejected" ? EstadoPago.RECHAZADO : EstadoPago.PENDIENTE
    const resultado = await this.prisma.$transaction(async (tx) => {
        const pagoCreado = await tx.pago.create({
            data:{
                obligacion_id: obligacion_id,
                monto: Number(pago.transaction_amount),
                metodo: "PASARELA_EN_LINEA",
                estado: estadoMapeado,
                referencia_pasarela: String(pago.id),
                fecha_verificacion: new Date()
            }
        })
        if(estadoMapeado === EstadoPago.ACEPTADO){
            await tx.obligacionFinanciera.update({
                where:{id_obligacion: obligacion_id},
                data:{estado: EstadoDeuda.PAGADO}
            })
        }
        return pagoCreado
    })
    this.logger.log(`Pago MP ${paymentId} procesado -> ${estadoMapeado}`)
    return{
        recibido:true,
        estado: estadoMapeado,
        pago_id: resultado.id_pago
    }
  }
}
