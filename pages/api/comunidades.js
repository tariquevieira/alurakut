import { SiteClient } from 'datocms-client';

export default async function receberDeRequests(request, response) {
  if (request.method === 'POST') {
    const TOKEN = '2a2640ba8235642454a49a553abccc';
    const client = new SiteClient(TOKEN);
    const registroCriado = await client.items.create({
      itemType: '976895',
      ...request.body,
      // title: 'comunidade de teste',
      // imageUrl: 'http://github.com/tariquevieira.png',
    });
    client.response.json({
      dados: 'Algum dado qualquer',
      registrocriado: registroCriado,
    });
  }
}
