const app = require('./App');

it('rowNum', () => {
    expect(app.rowNum(2, 3)).toEqual(0);
    expect(app.rowNum(22, 6)).toEqual(3);
    expect(app.rowNum(92, 11)).toEqual(8);
});

it('colNum', () => {
    expect(app.colNum(2, 3)).toEqual(2);
    expect(app.colNum(22, 6)).toEqual(4);
    expect(app.colNum(92, 11)).toEqual(4);
});

it('mv2RowAndCol', () => {
    expect(app.mv2RowAndCol(0, 1)).toEqual([0, 0]);
    expect(app.mv2RowAndCol(2, 3)).toEqual([0, 2]);
    expect(app.mv2RowAndCol(22, 6)).toEqual([3, 4]);
    expect(app.mv2RowAndCol(92, 11)).toEqual([8, 4]);
});

it('rowAndCol2mv', () => {
    expect(app.rowAndCol2mv(0, 0, 1)).toEqual(0);
    expect(app.rowAndCol2mv(0, 1, 2)).toEqual(1);
    expect(app.rowAndCol2mv(2, 3, 4)).toEqual(11);
    expect(app.rowAndCol2mv(4, 1, 6)).toEqual(25);
    expect(app.rowAndCol2mv(5, 1, 6)).toEqual(31);
    expect(app.rowAndCol2mv(1, 1, 6)).toEqual(7);
    expect(app.rowAndCol2mv(4, 5, 6)).toEqual(29);
});

it('weSN', () => {
    expect(app.weSN(0, 0, 1)).toEqual(null);
    expect(app.weSN(0, 1, 2)).toEqual(0);
    expect(app.weSN(2, 3, 4)).toEqual(10);
    expect(app.weSN(4, 1, 6)).toEqual(24);
    expect(app.weSN(5, 0, 6)).toEqual(null);
    expect(app.weSN(1, 1, 6)).toEqual(6);
    expect(app.weSN(4, 5, 6)).toEqual(28);
});

it('eaSN', () => {
    expect(app.eaSN(0, 0, 1)).toEqual(null);
    expect(app.eaSN(0, 1, 2)).toEqual(null);
    expect(app.eaSN(2, 3, 4)).toEqual(null);
    expect(app.eaSN(4, 1, 6)).toEqual(26);
    expect(app.eaSN(5, 0, 6)).toEqual(31);
    expect(app.eaSN(1, 1, 6)).toEqual(8);
    expect(app.eaSN(4, 5, 6)).toEqual(null);
});

it('northSN', () => {
    expect(app.noSN(0, 0, 1)).toEqual(null);
    expect(app.noSN(0, 1, 2)).toEqual(null);
    expect(app.noSN(2, 3, 4)).toEqual(7);
    expect(app.noSN(4, 1, 6)).toEqual(19);
    expect(app.noSN(5, 0, 6)).toEqual(24);
    expect(app.noSN(1, 1, 6)).toEqual(1);
    expect(app.noSN(4, 5, 6)).toEqual(23);
});

it('southSN', () => {
    expect(app.soSN(0, 0, 1)).toEqual(null);
    expect(app.soSN(0, 1, 2)).toEqual(3);
    expect(app.soSN(2, 3, 4)).toEqual(15);
    expect(app.soSN(4, 1, 6)).toEqual(31);
    expect(app.soSN(5, 0, 6)).toEqual(null);
    expect(app.soSN(1, 1, 6)).toEqual(13);
    expect(app.soSN(4, 5, 6)).toEqual(35);
});

it('nwSN', () => {
    expect(app.nwSN(0, 0, 1)).toEqual(null);
    expect(app.nwSN(0, 1, 2)).toEqual(null);
    expect(app.nwSN(2, 3, 4)).toEqual(6);
    expect(app.nwSN(4, 1, 6)).toEqual(18);
    expect(app.nwSN(5, 0, 6)).toEqual(null);
    expect(app.nwSN(1, 1, 6)).toEqual(0);
    expect(app.nwSN(4, 5, 6)).toEqual(22);
});

it('swSN', () => {
    expect(app.swSN(0, 0, 1)).toEqual(null);
    expect(app.swSN(0, 1, 2)).toEqual(2);
    expect(app.swSN(2, 3, 4)).toEqual(14);
    expect(app.swSN(4, 1, 6)).toEqual(30);
    expect(app.swSN(5, 0, 6)).toEqual(null);
    expect(app.swSN(1, 1, 6)).toEqual(12);
    expect(app.swSN(4, 5, 6)).toEqual(34);
});

it('neSN', () => {
    expect(app.neSN(0, 0, 1)).toEqual(null);
    expect(app.neSN(0, 1, 2)).toEqual(null);
    expect(app.neSN(2, 3, 4)).toEqual(null);
    expect(app.neSN(4, 1, 6)).toEqual(20);
    expect(app.neSN(5, 0, 6)).toEqual(25);
    expect(app.neSN(1, 1, 6)).toEqual(2);
    expect(app.neSN(4, 5, 6)).toEqual(null);
});

it('seSN', () => {
    expect(app.seSN(0, 0, 1)).toEqual(null);
    expect(app.seSN(0, 1, 2)).toEqual(null);
    expect(app.seSN(2, 3, 4)).toEqual(null);
    expect(app.seSN(4, 1, 6)).toEqual(32);
    expect(app.seSN(5, 0, 6)).toEqual(null);
    expect(app.seSN(1, 1, 6)).toEqual(14);
    expect(app.seSN(4, 5, 6)).toEqual(null);
});

it('rowSec', () => {
    expect(app.rowSec(0, 1, 1)).toEqual([0]);

    expect(app.rowSec(0, 2, 2)).toEqual([0, 1]);
    expect(app.rowSec(1, 2, 2)).toEqual([0, 1]);
    expect(app.rowSec(2, 2, 2)).toEqual([2, 3]);
    expect(app.rowSec(3, 2, 2)).toEqual([2, 3]);

    expect(app.rowSec(4, 4, 1)).toEqual([4]);

    expect(app.rowSec(0, 4, 2)).toEqual([0, 1]);
    expect(app.rowSec(1, 4, 2)).toEqual([0, 1, 2]);
    expect(app.rowSec(3, 4, 2)).toEqual([2, 3]);
    expect(app.rowSec(13, 4, 2)).toEqual([12, 13, 14]);

    expect(app.rowSec(3, 4, 3)).toEqual([1, 2, 3]);
    expect(app.rowSec(8, 4, 3)).toEqual([8, 9, 10]);
    expect(app.rowSec(6, 4, 3)).toEqual([4, 5, 6, 7]);

    expect(app.rowSec(4, 4, 4)).toEqual([4, 5, 6, 7]);
    expect(app.rowSec(7, 4, 4)).toEqual([4, 5, 6, 7]);

    expect(app.rowSec(30, 6, 2)).toEqual([30, 31]);
    expect(app.rowSec(7, 6, 2)).toEqual([6, 7, 8]);

    expect(app.rowSec(33, 6, 3)).toEqual([31, 32, 33, 34, 35]);
    expect(app.rowSec(7, 6, 4)).toEqual([6, 7, 8, 9, 10]);
    expect(app.rowSec(7, 6, 5)).toEqual([6, 7, 8, 9, 10, 11]);
});

it('colSec', () => {
    expect(app.colSec(0, 1, 1)).toEqual([0]);

    expect(app.colSec(0, 2, 2)).toEqual([0, 2]);
    expect(app.colSec(1, 2, 2)).toEqual([1, 3]);
    expect(app.colSec(2, 2, 2)).toEqual([0, 2]);
    expect(app.colSec(3, 2, 2)).toEqual([1, 3]);

    expect(app.colSec(4, 4, 1)).toEqual([4]);

    expect(app.colSec(0, 4, 2)).toEqual([0, 4]);
    expect(app.colSec(1, 4, 2)).toEqual([1, 5]);
    expect(app.colSec(3, 4, 2)).toEqual([3, 7]);
    expect(app.colSec(13, 4, 2)).toEqual([9, 13]);
    expect(app.colSec(10, 4, 2)).toEqual([6, 10, 14]);

    expect(app.colSec(3, 4, 3)).toEqual([3, 7, 11]);
    expect(app.colSec(8, 4, 3)).toEqual([0, 4, 8, 12]);
    expect(app.colSec(6, 4, 3)).toEqual([2, 6, 10, 14]);

    expect(app.colSec(4, 4, 4)).toEqual([0, 4, 8, 12]);
    expect(app.colSec(7, 4, 4)).toEqual([3, 7, 11, 15]);

    expect(app.colSec(30, 6, 2)).toEqual([24, 30]);
    expect(app.colSec(7, 6, 2)).toEqual([1, 7, 13]);

    expect(app.colSec(33, 6, 3)).toEqual([21, 27, 33]);
    expect(app.colSec(7, 6, 4)).toEqual([1, 7, 13, 19, 25]);
    expect(app.colSec(7, 6, 5)).toEqual([1, 7, 13, 19, 25, 31]);
});

it('neaSec', () => {
    expect(app.neaSec(0, 1, 1)).toEqual([0]);

    expect(app.neaSec(0, 2, 2)).toEqual([0, 3]);
    expect(app.neaSec(1, 2, 2)).toEqual([1]);
    expect(app.neaSec(2, 2, 2)).toEqual([2]);
    expect(app.neaSec(3, 2, 2)).toEqual([0, 3]);

    expect(app.neaSec(4, 4, 1)).toEqual([4]);

    expect(app.neaSec(0, 4, 2)).toEqual([0, 5]);
    expect(app.neaSec(1, 4, 2)).toEqual([1, 6]);
    expect(app.neaSec(3, 4, 2)).toEqual([3]);
    expect(app.neaSec(13, 4, 2)).toEqual([8, 13]);
    expect(app.neaSec(10, 4, 2)).toEqual([5, 10, 15]);

    expect(app.neaSec(3, 4, 3)).toEqual([3]);
    expect(app.neaSec(8, 4, 3)).toEqual([8, 13]);
    expect(app.neaSec(6, 4, 3)).toEqual([1, 6, 11]);

    expect(app.neaSec(4, 4, 4)).toEqual([4, 9, 14]);
    expect(app.neaSec(7, 4, 4)).toEqual([2, 7]);

    expect(app.neaSec(30, 6, 2)).toEqual([30]);
    expect(app.neaSec(7, 6, 2)).toEqual([0, 7, 14]);

    expect(app.neaSec(33, 6, 3)).toEqual([19, 26, 33]);
    expect(app.neaSec(7, 6, 4)).toEqual([0, 7, 14, 21, 28]);
    expect(app.neaSec(7, 6, 5)).toEqual([0, 7, 14, 21, 28, 35]);
});

it('nweSec', () => {
    expect(app.nweSec(0, 1, 1)).toEqual([0]);

    expect(app.nweSec(0, 2, 2)).toEqual([0]);
    expect(app.nweSec(1, 2, 2)).toEqual([1, 2]);
    expect(app.nweSec(2, 2, 2)).toEqual([1, 2]);
    expect(app.nweSec(3, 2, 2)).toEqual([3]);

    expect(app.nweSec(4, 4, 1)).toEqual([4]);

    expect(app.nweSec(0, 4, 2)).toEqual([0]);
    expect(app.nweSec(1, 4, 2)).toEqual([1, 4]);
    expect(app.nweSec(3, 4, 2)).toEqual([3, 6]);
    expect(app.nweSec(13, 4, 2)).toEqual([10, 13]);
    expect(app.nweSec(10, 4, 2)).toEqual([7, 10, 13]);

    expect(app.nweSec(3, 4, 3)).toEqual([3, 6, 9]);
    expect(app.nweSec(8, 4, 3)).toEqual([2, 5, 8]);
    expect(app.nweSec(6, 4, 3)).toEqual([3, 6, 9, 12]);

    expect(app.nweSec(4, 4, 4)).toEqual([1, 4]);
    expect(app.nweSec(7, 4, 4)).toEqual([7, 10, 13]);

    expect(app.nweSec(30, 6, 2)).toEqual([25, 30]);
    expect(app.nweSec(7, 6, 2)).toEqual([2, 7, 12]);

    expect(app.nweSec(33, 6, 3)).toEqual([23, 28, 33]);
    expect(app.nweSec(7, 6, 4)).toEqual([2, 7, 12]);
    expect(app.nweSec(7, 6, 5)).toEqual([2, 7, 12]);
});
