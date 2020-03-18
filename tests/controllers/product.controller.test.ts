'use strict';
import { App } from '../../src/app';
import { IProduct } from '../../src/domain/interfaces/product.interface';
import { IUser } from '../../src/domain/interfaces/user.interface';
import { clearDatabase } from '../../utils/database';
import { FilterProduct } from '../../src/domain/models/filters/filterProduct.model';
import { ICategory } from '../../src/domain/interfaces/category.interface';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;
const route = '/product';
const routeCateg = '/category';
const userRight: IUser = {
    email: `teste_@teste.com`,
    name: 'Tester',
    password: '12345678'
};
const productValid: IProduct = {
    title: 'Produto de teste',
    desc: 'Descrição',
    price: 150,
    amountAvailable: 100,
    percentOff: 10,
    avgReview: 3,
    freeDelivery: true,
    categoriesId: []
};

let token: string;

async function getTokenValid(user: IUser): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    expect(resPostUser.status).toBe(201);
    return resPostUser.body.token;
}

const randomFunc = {

    randomFloat: function randomFloat(
      min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
        return (Math.random() * (max - min)) + min;
    },

    randomInt: function randomInt(
      min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    randomBoolean: function randomBoolean(): boolean {
        return Math.random() >= 0.5;
    },

    randomIndex: function randomIndex<T>(arr: any[]): T {
        return arr[this.randomInt(0, arr.length)];
    }
};

const productRandom = function productRandom(
  title: string, desc: string, imgUrl: string, categories?: ICategory[]): IProduct {
    return {
        title,
        desc,
        price: randomFunc.randomFloat(0, 2500),
        urlMainImage: imgUrl,
        percentOff: randomFunc.randomFloat(0, 100),
        categoriesId: categories ? [randomFunc.randomIndex(categories)] : [],
        freeDelivery: randomFunc.randomBoolean(),
        amountAvailable: randomFunc.randomInt(0, 10000),
        avgReview: randomFunc.randomFloat(0, 5)
    };
};

beforeAll(async () => {
    clearDatabase(await appInstance.databaseInstance);
    token = await getTokenValid(userRight);
});


describe('POST', () => {
    it(
      'True - Produto válido',
      async () => {
          const res = await request(app)
            .post(route)
            .set('x-access-token', token)
            .send({ ...productValid });
          expect(res.status).toBe(201);
      });
});

describe('GET - Filter', () => {
    let products: IProduct[];
    let catCard: ICategory, catGame: ICategory;

    beforeAll(async () => {

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
            productRandom(
              'Funk POP - Yugi',
              `Boneco Funko Pop Yu-gi-oh - Yami Yugi 387, é o mais novo
              título popular mundialmente.`,
              'https://images-na.ssl-images-amazon.com/images/I/717MHGTzgbL._SY606_.jpg',
              [catCard, catGame]
            ),
            productRandom(
              'Yugioh Booster Duelist Pack',
              `Essa Coleção possui Cartas usados por Yugi Muto.
              Contém novas artes para muitas cartas, incluindo "Dark Magician Girl",
              "Summoned Skull", "Dark Paladin" e "Polymerization"`,
              'https://www.extra-imagens.com.br/brinquedos/Jogos/jogosdeCartas/13037927.jpg'
            ),
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
              [catCard, catGame]
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
              [catCard, catGame]
            ),
            productRandom(
              'Yu-gi-oh! Forbidden Memories Português Patch Ps1',
              `COMPATÍVEL COM:\nPS1 DESTRAVADO\nMIDIA FISICA
              FUNCIONA TAMBEM EM PLAYSTATION 2 QUE POSSUA RECUSSOS PARA PLAYSTATION 1`,
              'https://http2.mlstatic.com/yu-gi-oh-forbidden-memories-F.webp'
            )
        ];
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(products.map(async p => {
            await request(app)
              .post(route)
              .set('x-access-token', token)
              .send(p);
        }));

    });

    it(
      'Filter: Rating Stars - Filled',
      async () => {
          const filter = new FilterProduct();
          filter.avgReview = [0, 2];
          const res = await request(app).get(route).query(filter).send();
          expect(res.status).toBe(200);

          const allValidReview = (res.body as IProduct[]).every(
            p => filter.avgReview.includes(Math.floor(p.avgReview))
          );
          expect(allValidReview).toBeTruthy();
      });

    it(
      'Filter: Rating Stars - Empty',
      async () => {
          const filter = new FilterProduct();
          filter.avgReview = [];
          const res = await request(app).get(route).query(filter).send();
          expect(res.status).toBe(200);
          expect(res.body.length === products.length).toBeTruthy();
      });

    /*
    categoriesId: 1,

    createdAt: 1,

    desc: 1,
    title: 1,

    freeDelivery: 1,

    percentOff: 1,

    price: 1,
    */

    it(
      'Filter: Category - Filled',
      async () => {
          const filter = new FilterProduct();
          filter.categoriesId = [catGame.id];
          console.log(catGame, catCard);
          const res = await request(app).get(route).query(filter).send();
          console.log(res.b);
          expect(res.status).toBe(200);
      });
});
