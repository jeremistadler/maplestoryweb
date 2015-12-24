var Grid = (function () {
    function Grid() {
        this.buildList = [];
        this.areaList = [];
    }
    Grid.prototype.add = function (item) {
    };
    Grid.prototype.getInArea = function (x, y, width, height) {
        return this.buildList;
    };
    return Grid;
})();
var GridLeaf = (function () {
    function GridLeaf() {
    }
    return GridLeaf;
})();
