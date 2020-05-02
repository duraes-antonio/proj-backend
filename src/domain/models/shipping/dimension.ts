export interface Dimension {
    readonly height: number;
    readonly length: number;
    readonly weight: number;
    readonly width: number;
}

export const calcVolumeParallelepiped = (dimension: Dimension): number => {
    return dimension.height * dimension.length * dimension.width;
};
