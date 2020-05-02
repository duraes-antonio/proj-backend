import { Deliverable, DeliveryOption, DeliveryOptionType } from '../../domain/models/shipping/delivery';
import { calcVolumeParallelepiped } from '../../domain/models/shipping/dimension';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CorreiosInstance = require('node-correios');
const correios = new CorreiosInstance();

enum CorreiosServiceOptions {
    PAC = '4510',
    SEDEX = '4014'
}

/*Cálculo baseado no conteúdo: http://www.dothcom.net/blog/comercio-eletronico/calculo-de-frete-com-multiplos-volumes-dos-correios/*/
const calculateCostDaysOrder = async (
  zipcodeOrigin: string, zipcodeTarget: string, items: Deliverable[]
): Promise<DeliveryOption[]> => {
    const servicesOptions = [
        CorreiosServiceOptions.PAC,
        CorreiosServiceOptions.SEDEX
    ];
    const typeService = [DeliveryOptionType.PAC, DeliveryOptionType.SEDEX];
    const volumesItems = items.map(item => calcVolumeParallelepiped(item) * item.amount);
    const sumVolumes = volumesItems.reduce((prev: number, curr: number) => prev + curr);
    const sumWeight = items
      .map(item => item.weight * item.amount)
      .reduce((prevAccWeight: number, currAccWeight: number) =>
        prevAccWeight + currAccWeight
      );
    const rootCubicVolume = Math.cbrt(sumVolumes);
    const data = {
        nCdEmpresa: '',
        sDsSenha: '',
        nCdServico: '',
        sCepOrigem: zipcodeOrigin,
        sCepDestino: zipcodeTarget,

        // Em quilogramas (kg)
        nVlPeso: sumWeight.toFixed(2),

        // Em centímetros (cm)
        nVlComprimento: Math.max(rootCubicVolume, 15).toFixed(2),
        nVlAltura: Math.max(rootCubicVolume, 1).toFixed(2),
        nVlLargura: Math.max(rootCubicVolume, 10).toFixed(2),
        nVlDiametro: '0',

        sCdMaoPropria: 'n',
        nCdFormato: '1',
        nVlValorDeclarado: '0',
        sCdAvisoRecebimento: 'n'
    };
    const res = await Promise.all(
      servicesOptions.map(opt => correios.calcPrecoPrazo({ ...data, nCdServico: opt }))
    );
    return res.flat().map((opt, index: number) => {
        return {
            cost: +(opt.Valor as string).replace(',', '.'),
            timeDays: +opt.PrazoEntrega,
            typeService: typeService[index]
        } as DeliveryOption;
    });
};

export const correiosService = {
    calculateCostDaysOrder
};
