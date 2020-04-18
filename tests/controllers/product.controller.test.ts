'use strict';
import { App } from '../../src/app';
import { Product, ProductAdd } from '../../src/domain/models/product';
import { UserAdd } from '../../src/domain/models/user';
import { clearDatabase } from '../../utils/database';
import { FilterProduct } from '../../src/domain/models/filters/filterProduct.model';
import { Category } from '../../src/domain/models/category';
import { EUserRole } from '../../src/domain/enum/role.enum';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;
const route = '/product';
const routeCateg = '/category';
const userRight: UserAdd = {
    email: 'teste_@teste.com',
    name: 'Tester',
    password: '12345678',
    roles: [EUserRole.CUSTOMER]
};
const productValid: ProductAdd = {
    title: 'Produto de teste',
    desc: 'Descrição',
    price: 150,
    amountAvailable: 100,
    percentOff: 10,
    freeDelivery: true,
    categoriesId: [],
    cost: 10,
    height: 1,
    length: 1,
    weight: 1,
    width: 1
};

let token: string;

async function getTokenValid(user: UserAdd): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    expect(resPostUser.status).toBe(201);
    return resPostUser.body.token;
}

const randomFunc = {

    randomFloat: function randomFloat(
      min = 0, max: number = Number.MAX_SAFE_INTEGER): number {
        return (Math.random() * (max - min)) + min;
    },

    randomInt: function randomInt(
      min = 0, max: number = Number.MAX_SAFE_INTEGER): number {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    randomBoolean: function randomBoolean(): boolean {
        return Math.random() >= 0.5;
    },
};

const productRandom = function productRandom(
  title: string, desc: string, imgUrl: string, categories?: Category[]): ProductAdd {
    return {
        title,
        desc,
        price: randomFunc.randomFloat(0, 2500),
        urlMainImage: imgUrl,
        percentOff: randomFunc.randomFloat(0, 100),
        categoriesId: categories ? categories.map(c => c.id) : [],
        freeDelivery: randomFunc.randomBoolean(),
        amountAvailable: randomFunc.randomInt(0, 10000),
        cost: 10,
        height: 1,
        length: 1,
        weight: 1,
        width: 1
    };
};

beforeAll(async () => {
    clearDatabase(await appInstance.databaseInstance);
    token = await getTokenValid(userRight);
});


describe('post', () => {
    it(
      'obj_valid',
      async () => {
          const res = await request(app)
            .post(route)
            .set('x-access-token', token)
            .send({ ...productValid });
          expect(res.status).toBe(201);
      });
});

describe('get_filter', () => {
    let products: ProductAdd[];
    let catCard: Category, catGame: Category;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const resCatCard = await request(app)
          .post(routeCateg)
          .set('x-access-token', token)
          .send({ title: 'Card' });
        expect(resCatCard.status).toBe(201);
        catCard = resCatCard.body;

        const resCatGame = await request(app)
          .post(routeCateg)
          .set('x-access-token', token)
          .send({ title: 'Games' });
        expect(resCatGame.status).toBe(201);
        catGame = resCatGame.body;

        products = [
            {
                title: 'Funk POP - Yugi',
                desc: 'Boneco Funko Pop Yu-gi-oh - Yami Yugi 387, é o mais novo título popular mundialmente.',
                urlMainImage: 'https://images-na.ssl-images-amazon.com/images/I/717MHGTzgbL._SY606_.jpg',
                categoriesId: [catCard.id, catGame.id],
                freeDelivery: true,
                price: 150.99,
                percentOff: 10,
                amountAvailable: 10,
                cost: 10,
                height: 1,
                length: 1,
                weight: 1,
                width: 1
            },
            {
                title: 'Yugioh Booster Duelist Pack',
                desc: `Essa Coleção possui Cartas usados por Yugi Muto.
              Contém novas artes para muitas cartas, incluindo "Dark Magician Girl",
              "Summoned Skull", "Dark Paladin" e "Polymerization"`,
                urlMainImage: 'https://www.extra-imagens.com.br/brinquedos/Jogos/jogosdeCartas/13037927.jpg',
                categoriesId: [catCard.id],
                freeDelivery: false,
                price: 73.45,
                percentOff: 25,
                amountAvailable: 17,
                cost: 10,
                height: 1,
                length: 1,
                weight: 1,
                width: 1
            },
            productRandom(
              'Legendary Decks 1 E 2 - Decks Legendários Em Pt Em 12 X',
              `NESTE ANÚNCIO VOCÊ ESTA LEVANDO 2 LEGENDARYS EM 12 X SEM
              JUROS COM FRETE GRÁTIS 1 X LEGENDARY DECKS 1\n1 X LEGENDARY DECKS 2
              TODOS SELADOS 100% ORIGINAIS EM PORTUGUÊS CADA LEGENDARY CONTÉM 3
              DECKS DE 40 CARDS CADA`,
              'https://http2.mlstatic.com/legendary-decks-1-e-2-decks--F.webp'
            ),
            productRandom(
              'Booster Box De Battle Of Legends Hero\'s Revenge Em Pt Em 12x',
              `impressas pela primeira vez em Yu-Gi-Oh! ESTAMPAS ILUSTRADAS,
              novos Monstros Link, suportes poderosos para os torneios e mais!
              Confira uma prévia das novidades que aguardam os Duelistas:
              O Número 93: Kaiser Utopia, originalmente disponível apenas para aqueles que
              atingiram o auge da competição, faz sua estreia pública!`,
              'https://http2.mlstatic.com/booster-box-de-battle-of-legends-heros.webp'
            ),
            productRandom(
              'Yugioh Card Box Tempestade Raging Tempest Special Português',
              `A Tempestade Furiosa é uma coleção recheada de novas e
              excelentes estampas para uma grande variedade de temas, incluindo os ESPIRÕES,
              Engrenagens Anciões, Subterrores, Cristrons, Sombranecos e muitos outros.`,
              'https://http2.mlstatic.com/yugioh-card-box-tempestade-F.webp',
              [catCard, catGame]
            ),
            productRandom(
              'Funko Pop! - Yu-gi-oh! - Mago Negro - Dark Magician #595',
              `Tamanho aproximado de 8cms de Altura, Feito de Vinil.
              Produto Novo, Fechado na Embalagem. Se o pagamento for confirmado até as
              12h de Segunda a Sexta, será postado no mesmo dia útil.`,
              'https://http2.mlstatic.com/funko-pop-yu-gi-oh-mago-negro-dark-F.webp'
            ),
            productRandom(
              'Boneco Yu-gi-oh! Rei Caveira Totaku 22 Summoned Skull',
              `Yu-Gi-Oh! é uma série de mangá sobre jogo escrita
              e ilustrada por Kazuki Takahashi.`,
              'https://http2.mlstatic.com/boneco-F.webp',
              [catCard]
            ),
            productRandom(
              'Funko Pop! Animation - Yu-gi-oh! - Dark Magician Girl #390',
              `Criado pela Funko este boneco colecionável, com aspecto agradável em
              seus vários modelos e franquias, os Pops! viraram uma paixão nacional.
              Tenha seu personagem favorito com você, aquele sentimento de nostalgia,
              que te remete a uma época boa de sua vida, que te traga boas lembranças,
              ou pelo simples fato de estar adorando a nova série, os novos filmes.`,
              'https://http2.mlstatic.com/funko--MLB31070299689_062019-F.webp'),
            productRandom(
              'Yugioh Legacy Of The Duelist Link Evolution Switch Física',
              `LEIA COM ATENÇÃO TODO O ANÚNCIO ANTES DE FINALIZAR A COMPRA!
              Produto mídia física\n- Capinha de plástico (tradicional)
              Yu-Gi-Oh! Legacy of the Duelist: Link Evolution! é um jogo de
              estratégia baseado na animação japonesa Yu-Gi-Oh`,
              'https://http2.mlstatic.com/yugioh-legacy-of-the-duelist-F.webp',
              [catGame]
            ),
            productRandom(
              'Yu-gi-oh! Forbidden Memories Português Patch Ps1',
              `COMPATÍVEL COM:\nPS1 DESTRAVADO\nMIDIA FISICA
              FUNCIONA TAMBEM EM PLAYSTATION 2 QUE POSSUA RECUSSOS PARA PLAYSTATION 1`,
              'https://http2.mlstatic.com/yu-gi-oh-forbidden-memories-F.webp'
            )
        ];

        await Promise.all(products
          .map(async p => {
              await request(app)
                .post(route)
                .set('x-access-token', token)
                .send(p);
          })
        );
    });

    /*TODO: Tratar avaliação e query externa
    it(
      'rating_filled',
      async () => {
          const filter = new FilterProduct();
          filter.avgReview = [0, 2];
          const res = await request(app)
            .get(route)
            .send(filter);

          const body = res.body as Product[];
          expect(res.status).toBe(200);
          expect(body.length).toBeTruthy();

          const allValidReview = body
            .every(p => filter.avgReview
              .includes(Math.floor(p.avgReview))
            );
          expect(allValidReview).toBeTruthy();
      });

    it(
      'rating_empty',
      async () => {
          const filter = new FilterProduct();
          filter.avgReview = [];
          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];
          expect(res.status).toBe(200);
          expect(body.length).toBeTruthy();
          expect(res.body.length === products.length).toBeTruthy();
      });
      */

    it(
      'category',
      async () => {
          const filter = new FilterProduct();
          filter.categoriesId = [catCard.id, catGame.id];

          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];

          expect(res.status).toBe(200);
          expect(body.length).toBeTruthy();
          const allExpected = (res.body as Product[])
            .every(p => p.categoriesId
              .some(c => filter.categoriesId
                && filter.categoriesId.includes(c))
            );
          expect(allExpected).toBeTruthy();
      });

    it(
      'text',
      async () => {
          const filter = new FilterProduct();
          filter.text = 'card';
          const expectedLen = products.filter(p =>
            filter.text &&
            (p.title.toLowerCase().includes(filter.text)
              || p.desc.toLowerCase().includes(filter.text))
          ).length;

          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];

          expect(res.status).toBe(200);
          expect(body.length).toBeTruthy();

          const allExpected = body
            .every(p =>
              filter.text &&
              (p.title.toLowerCase().includes(filter.text)
                || p.desc.toLowerCase().includes(filter.text))
            );
          expect(allExpected && expectedLen == body.length).toBeTruthy();
      });

    it(
      'free_delivery',
      async () => {
          const filter = new FilterProduct();
          filter.freeDelivery = true;
          const expec = products
            .filter(p => p.freeDelivery === filter.freeDelivery);

          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];
          expect(res.status).toBe(200);
          expect(body.length == expec.length).toBeTruthy();
      });

    it(
      'discount',
      async () => {
          const filter = new FilterProduct();
          filter.discounts = [[0, 25], [50, 75]];

          const expec = products
            .filter(p => filter.discounts
              && filter.discounts
                .some(pairOff =>
                  p.percentOff >= pairOff[0]
                  && p.percentOff <= pairOff[1]
                )
            );

          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];

          expect(res.status).toBe(200);
          expect(body.length == expec.length).toBeTruthy();

          const allDiscountOk = body
            .filter(p => filter.discounts
              && filter.discounts
                .some(pairOff =>
                  p.percentOff >= pairOff[0]
                  && p.percentOff <= pairOff[1]
                )
            );

          expect(allDiscountOk).toBeTruthy();
      });

    it(
      'price_min',
      async () => {
          const filter = new FilterProduct();
          filter.priceMin = 150;
          filter.priceMax = undefined;

          const expec = products
            .filter(p => !filter.priceMin || p.price >= filter.priceMin);

          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];

          expect(res.status).toBe(200);
          expect(body.length == expec.length).toBeTruthy();
          expect(body.every(p =>
            !filter.priceMin || p.price >= filter.priceMin)
          );
      });

    it(
      'price_max',
      async () => {
          const filter = new FilterProduct();
          filter.priceMax = 450;

          const expec = products
            .filter(p => !filter.priceMax || p.price <= filter.priceMax);

          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];

          expect(res.status).toBe(200);
          expect(body.length == expec.length).toBeTruthy();
          expect(body.every(p =>
            !filter.priceMax || p.price <= filter.priceMax)
          );
      });

    it(
      'price_min_max',
      async () => {
          const filter = new FilterProduct();
          filter.priceMin = 100;
          filter.priceMax = 500;

          const expec = products
            .filter(p =>
              (!filter.priceMin || p.price >= filter.priceMin)
              && (!filter.priceMax || p.price <= filter.priceMax)
            );

          const res = await request(app)
            .get(route)
            .send(filter);
          const body = res.body as Product[];

          expect(res.status).toBe(200);
          expect(body.length == expec.length).toBeTruthy();
          expect(body.every(p =>
            (!filter.priceMin || p.price >= filter.priceMin)
            && (!filter.priceMax || p.price <= filter.priceMax))
          );
      });
});
