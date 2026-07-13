import { MercadoPagoConfig, Payment } from "mercadopago"

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export const payment = new Payment(mercadopago)
