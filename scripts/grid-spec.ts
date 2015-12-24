/// <reference path="libs/jasmine/jasmine.d.ts" />
/// <reference path="grid.ts" />

class TestTile implements IGridItem {
    constructor(public x: number, public y: number, public width: number, public height: number) { }
}

describe("Grid", function () {
    var grid;

    beforeEach(function () {
        grid = new Grid();
    });

    //describe("when song has been paused", function () {
    //    beforeEach(function () {
    //        player.play(song);
    //        player.pause();
    //    });

    //    it("should indicate that the song is currently paused", function () {
    //        expect(player.isPlaying).toBeFalsy();

    //        // demonstrates use of 'not' with a custom matcher
    //        expect(player).not.toBePlaying(song);
    //    });

    //    it("should be possible to resume", function () {
    //        player.resume();
    //        expect(player.isPlaying).toBeTruthy();
    //        expect(player.currentlyPlayingSong).toEqual(song);
    //    });
    //});


    it("returns empty array", function () {
        expect(grid.getInArea(0, 0, 0, 0).length).toBe(0);
        expect(grid.getInArea(-100, -100, 100, 100).length).toBe(0);
    });

    it("returns one item", function () {
        grid.add(new TestTile(0, 0, 1, 1));

        expect(grid.getInArea(0, 0, 0, 0).length).toBe(0);
        expect(grid.getInArea(-100, -100, 100, 100).length).toBe(1);
    });
});
