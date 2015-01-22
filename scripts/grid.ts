
interface IGridItem {
    x: number;
    y: number;
    width: number;
    height: number;
}

class Grid {
    buildList: IGridItem[] = [];
    areaList: IGridItem[] = [];

    add(item: IGridItem) {

    }

    getInArea(x: number, y: number, width: number, height: number): IGridItem[] {
        return this.buildList;
    }
}

class GridLeaf {

}