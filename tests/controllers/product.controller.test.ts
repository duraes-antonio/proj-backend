'use strict';
import { App } from '../../src/app';
import { Product, ProductAdd } from '../../src/domain/models/product';
import { clearDatabase } from '../../utils/database';
import { invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../shared-data';
import { StringOptional, testRest } from '../shared-methods-http';
import { productSizes } from '../../src/shared/fieldSize';
import { generators } from '../../utils/generators';
import { FilterProduct } from '../../src/domain/models/filters/filter-product';
import { EProductSort } from '../../src/domain/enum/product-sort.enum';

const appInstance = new App();
const app = appInstance.express;
const route = '/product';
const productAdd: ProductAdd = {
    title: 'Produto de teste',
    desc: 'Descrição de teste',
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
let tokenAdmin: string;
const invalidDataPatchPost: TestObject<object>[] = [
    ...sharedDataTest.getTestsForListFields(['categoriesId'], productSizes),
    ...sharedDataTest.getTestsForStringFields(['title', 'desc'], productSizes),
    ...sharedDataTest.getTestsForCheckEmptyFields(['freeDelivery'], 400),
    ...sharedDataTest.getTestsForNumberFields(
      ['price', 'cost', 'percentOff', 'height', 'length', 'width', 'weight', 'amountAvailable'],
      productSizes)
];

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
    }
};

const productRandom = function productRandom(
  title: string, desc: string, imgUrl: string, categories?: string[]): ProductAdd {
    return {
        title,
        desc,
        price: randomFunc.randomFloat(0, 2500),
        urlMainImage: imgUrl,
        percentOff: randomFunc.randomFloat(0, 100),
        categoriesId: categories ?? [],
        freeDelivery: randomFunc.randomBoolean(),
        amountAvailable: randomFunc.randomInt(0, 10000),
        cost: 10,
        height: 1,
        length: 1,
        weight: 1,
        width: 1
    };
};

function cmp(
  fnAccess: (p: ProductAdd) => string | number, pA: ProductAdd,
  pB: ProductAdd): number {
    if (fnAccess(pA) > fnAccess(pB)) {
        return 1;
    } else if (fnAccess(pA) < fnAccess(pB)) {
        return -1;
    }
    return 0;
}

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await sharedDataTest.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await sharedDataTest.getTokenValid(usersAdd.admin, app);
});

describe('delete', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.deleteInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('not_admin', async () =>
      await testRest.deleteOnlyAdmin(app, route, token));

    it('valid', async () =>
      await testRest.postAndDelete(app, route, productAdd, tokenAdmin));
});

describe('get', () => {
    let products: ProductAdd[];
    const categories = generators.getMongoOBjectIds(3);

    beforeAll(async () => {
        products = [
            {
                title: 'Funk POP - Yugi',
                desc: 'Boneco Funko Pop Yu-gi-oh - Yami Yugi 387, é o mais novo título popular mundialmente.',
                urlMainImage: 'https://images-na.ssl-images-amazon.com/images/I/717MHGTzgbL._SY606_.jpg',
                categoriesId: categories,
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
                categoriesId: [categories[0]],
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
              categories
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
              [categories[1]]
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
              [categories[0]]
            ),
            productRandom(
              'Yu-gi-oh! Forbidden Memories Português Patch Ps1',
              `COMPATÍVEL COM:\nPS1 DESTRAVADO\nMIDIA FISICA
              FUNCIONA TAMBEM EM PLAYSTATION 2 QUE POSSUA RECUSSOS PARA PLAYSTATION 1`,
              'https://http2.mlstatic.com/yu-gi-oh-forbidden-memories-F.webp'
            )
        ];
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(products
          .map(async p => testRest.post(app, route, p, tokenAdmin, 201))
        );
    });

    it('rating_filled', async () => {
        const filter: FilterProduct = {
            avgReview: [0, 2],
            currentPage: 1,
            perPage: 10,
            sortBy: EProductSort.AVERAGE_REVIEW
        };
        const res = await testRest.get(app, route, filter, token);
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        const allValidReview = (res.body as Product[])
          .filter((p: Product) =>
            (filter.avgReview as number[])
              .includes(Math.floor(p.avgReview))
          );
        expect(resCount.body.data).toBe(allValidReview.length);
        expect(allValidReview).toEqual(res.body);
    });

    it('rating_empty', async () => {
        const filter: FilterProduct = {
            currentPage: 1,
            perPage: 20
        };
        await testRest.getAndMatch(
          app, route, filter, products, token,
          (a, b) => cmp((p) => p.title, a, b)
        );
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        expect(resCount.body.data).toBe(products.length);
    });

    it('category', async () => {
        const filter: FilterProduct = {
            categoriesId: [categories[0], categories[1]],
            currentPage: 1,
            perPage: 20
        };
        const dataMatch = products
          .filter(p => p.categoriesId.some(c => filter?.categoriesId?.includes(c)));
        await testRest.getAndMatch(
          app, route, filter, dataMatch, token,
          (a, b) => cmp((p) => p.title, a, b)
        );
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        expect(resCount.body.data).toBe(dataMatch.length);
    });

    it('text', async () => {
        const filter: FilterProduct = {
            text: 'card',
            currentPage: 1,
            perPage: 20
        };
        const dataMatch = products.filter(p =>
          filter.text &&
          (p.title.toLowerCase().includes(filter.text)
            || p.desc.toLowerCase().includes(filter.text))
        );
        await testRest.getAndMatch(app, route, filter, dataMatch, token);
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        expect(resCount.body.data).toBe(dataMatch.length);
    });

    it('free_delivery', async () => {
        const filter: FilterProduct = {
            freeDelivery: true,
            currentPage: 1,
            perPage: 20
        };
        const dataMatch = products.filter(p => p.freeDelivery === filter.freeDelivery);
        await testRest.getAndMatch(app, route, filter, dataMatch, token);
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        expect(resCount.body.data).toBe(dataMatch.length);
    });

    it('discount', async () => {
        const filter: FilterProduct = {
            discounts: [[20, 45], [50, 75]],
            currentPage: 1,
            perPage: 20,
            sortBy: EProductSort.DISCOUNTS
        };
        const dataMatch = products
          .filter(p => filter?.discounts
            ?.some(pairOff =>
              p.percentOff >= pairOff[0] && p.percentOff <= pairOff[1]
            )
          );
        await testRest.getAndMatch(
          app, route, filter, dataMatch, token, (a: ProductAdd, b: ProductAdd) =>
            cmp((p: ProductAdd) => p.percentOff, a, b)
        );
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        expect(resCount.body.data).toBe(dataMatch.length);
    });

    it('price_min', async () => {
        const filter: FilterProduct = {
            priceMin: 150,
            priceMax: undefined,
            currentPage: 1,
            perPage: 20
        };
        const dataMatch = products.filter(p => !filter.priceMin || p.price >= filter.priceMin);
        await testRest.getAndMatch(
          app, route, filter, dataMatch, token,
          (a, b) => cmp((p) => p.price, a, b)
        );
    });

    it('price_max', async () => {
        const filter: FilterProduct = {
            priceMax: 450,
            currentPage: 1,
            perPage: 20
        };
        const dataMatch = products.filter(p => !filter.priceMax || p.price <= filter.priceMax);
        await testRest.getAndMatch(app, route, filter, dataMatch, token);
    });

    it('price_min_max', async () => {
        const filter: FilterProduct = {
            priceMin: 100,
            priceMax: 500,
            currentPage: 1,
            perPage: 20
        };
        const dataMatch = products
          .filter(p => filter.priceMin && filter.priceMax &&
            p.price >= filter.priceMin && p.price <= filter.priceMax
          );
        await testRest.getAndMatch(app, route, filter, dataMatch, token);
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        expect(resCount.body.data).toBe(dataMatch.length);
    });
});

describe('get_by_id', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.getByIdInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('valid', async () =>
      await testRest.postAndGetById(app, route, productAdd, tokenAdmin));
});

describe('patch', () => {
    const validId = generators.getMongoOBjectId();

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.patchInvalidIds(app, route, id, status, tokenAdmin));

    it('not_admin', async () =>
      await testRest.patchOnlyAdmin(app, route, token));

    it.each<TestObject<object>>([...invalidDataPatchPost, ...invalidFieldsPatch])
    ('invalid - %s', async (testCase) => {
        const res = await testRest.patch(app, route, validId, testCase.data, tokenAdmin);
        expect(res.status).toBe(testCase.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(testCase.message.toLowerCase());
    });
});

describe('post', () => {

    it('valid', async () =>
      await testRest.post(app, route, productAdd, tokenAdmin, 201)
    );

    it('not_admin', async () => await testRest.postOnlyAdmin(app, route, token));

    it.each<TestObject<object>>(invalidDataPatchPost)
    ('invalid - %s', async (testCase) => {
        const res = await testRest.post(
          app, route, { ...productAdd, ...testCase.data }, tokenAdmin, testCase.expectStatus
        );
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(testCase.message.toLowerCase());
    });
});
