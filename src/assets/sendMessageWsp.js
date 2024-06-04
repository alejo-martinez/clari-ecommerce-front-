export const sendMessage = (user, prods, payment) => {
    let total = 0;
    const length = prods.length;
    const productosMensaje = prods.map((it, ind) => {
        total += it.unitPrice * it.quantity;
        return `- *Producto:* ${it.product.title}, *Talle:* ${it.variant.size}, *Color:* ${it.variant.color}, *Cantidad:* ${it.quantity}, *Precio unitario:* $${it.unitPrice}`;
    }).join('\n');


    const mensaje = `Hola, mi nombre es *${user.name}* y quiero realizar la siguiente compra:\n\n` 
        + `${productosMensaje}\n\n`
        + `*Total:* $${total}\n\n`
        + `*Medio de pago:* ${payment}`
    return mensaje;
};
