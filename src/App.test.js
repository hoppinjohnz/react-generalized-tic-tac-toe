const app = require('./App');

describe('row_number', () => {
    test.each`
      sqrNum   | d      | expected
      ${2}     | ${3}   | ${0}
      ${22}    | ${6}   | ${3}
      ${92}    | ${11}  | ${8}
    `('sqrNum: $sqrNum and dimension: $d => row number: $expected', ({ sqrNum, d, expected }) => {
      expect(app.row_number(sqrNum, d)).toEqual(expected)
    });
});

it('column_number', () => {
    expect(app.column_number(2, 3)).toEqual(2);
    expect(app.column_number(22, 6)).toEqual(4);
    expect(app.column_number(92, 11)).toEqual(4);
});

it('move_to_row_and_column', () => {
    expect(app.move_to_row_and_column(0, 1)).toEqual([0, 0]);
    expect(app.move_to_row_and_column(2, 3)).toEqual([0, 2]);
    expect(app.move_to_row_and_column(22, 6)).toEqual([3, 4]);
    expect(app.move_to_row_and_column(92, 11)).toEqual([8, 4]);
});

it('row_and_column_to_move', () => {
    expect(app.row_and_column_to_move(0, 0, 1)).toEqual(0);
    expect(app.row_and_column_to_move(0, 1, 2)).toEqual(1);
    expect(app.row_and_column_to_move(2, 3, 4)).toEqual(11);
    expect(app.row_and_column_to_move(4, 1, 6)).toEqual(25);
    expect(app.row_and_column_to_move(5, 1, 6)).toEqual(31);
    expect(app.row_and_column_to_move(1, 1, 6)).toEqual(7);
    expect(app.row_and_column_to_move(4, 5, 6)).toEqual(29);
});

it('west_square_number', () => {
    expect(app.west_square_number(0, 0, 1)).toEqual(null);
    expect(app.west_square_number(0, 1, 2)).toEqual(0);
    expect(app.west_square_number(2, 3, 4)).toEqual(10);
    expect(app.west_square_number(4, 1, 6)).toEqual(24);
    expect(app.west_square_number(5, 0, 6)).toEqual(null);
    expect(app.west_square_number(1, 1, 6)).toEqual(6);
    expect(app.west_square_number(4, 5, 6)).toEqual(28);
});

it('east_square_number', () => {
    expect(app.east_square_number(0, 0, 1)).toEqual(null);
    expect(app.east_square_number(0, 1, 2)).toEqual(null);
    expect(app.east_square_number(2, 3, 4)).toEqual(null);
    expect(app.east_square_number(4, 1, 6)).toEqual(26);
    expect(app.east_square_number(5, 0, 6)).toEqual(31);
    expect(app.east_square_number(1, 1, 6)).toEqual(8);
    expect(app.east_square_number(4, 5, 6)).toEqual(null);
});

it('north_square_number', () => {
    expect(app.north_square_number(0, 0, 1)).toEqual(null);
    expect(app.north_square_number(0, 1, 2)).toEqual(null);
    expect(app.north_square_number(2, 3, 4)).toEqual(7);
    expect(app.north_square_number(4, 1, 6)).toEqual(19);
    expect(app.north_square_number(5, 0, 6)).toEqual(24);
    expect(app.north_square_number(1, 1, 6)).toEqual(1);
    expect(app.north_square_number(4, 5, 6)).toEqual(23);
});

it('south_square_number', () => {
    expect(app.south_square_number(0, 0, 1)).toEqual(null);
    expect(app.south_square_number(0, 1, 2)).toEqual(3);
    expect(app.south_square_number(2, 3, 4)).toEqual(15);
    expect(app.south_square_number(4, 1, 6)).toEqual(31);
    expect(app.south_square_number(5, 0, 6)).toEqual(null);
    expect(app.south_square_number(1, 1, 6)).toEqual(13);
    expect(app.south_square_number(4, 5, 6)).toEqual(35);
});

it('nroth_west_square_number', () => {
    expect(app.nroth_west_square_number(0, 0, 1)).toEqual(null);
    expect(app.nroth_west_square_number(0, 1, 2)).toEqual(null);
    expect(app.nroth_west_square_number(2, 3, 4)).toEqual(6);
    expect(app.nroth_west_square_number(4, 1, 6)).toEqual(18);
    expect(app.nroth_west_square_number(5, 0, 6)).toEqual(null);
    expect(app.nroth_west_square_number(1, 1, 6)).toEqual(0);
    expect(app.nroth_west_square_number(4, 5, 6)).toEqual(22);
});

it('south_west_square_number', () => {
    expect(app.south_west_square_number(0, 0, 1)).toEqual(null);
    expect(app.south_west_square_number(0, 1, 2)).toEqual(2);
    expect(app.south_west_square_number(2, 3, 4)).toEqual(14);
    expect(app.south_west_square_number(4, 1, 6)).toEqual(30);
    expect(app.south_west_square_number(5, 0, 6)).toEqual(null);
    expect(app.south_west_square_number(1, 1, 6)).toEqual(12);
    expect(app.south_west_square_number(4, 5, 6)).toEqual(34);
});

it('nroth_east_square_number', () => {
    expect(app.nroth_east_square_number(0, 0, 1)).toEqual(null);
    expect(app.nroth_east_square_number(0, 1, 2)).toEqual(null);
    expect(app.nroth_east_square_number(2, 3, 4)).toEqual(null);
    expect(app.nroth_east_square_number(4, 1, 6)).toEqual(20);
    expect(app.nroth_east_square_number(5, 0, 6)).toEqual(25);
    expect(app.nroth_east_square_number(1, 1, 6)).toEqual(2);
    expect(app.nroth_east_square_number(4, 5, 6)).toEqual(null);
});

it('south_east_square_number', () => {
    expect(app.south_east_square_number(0, 0, 1)).toEqual(null);
    expect(app.south_east_square_number(0, 1, 2)).toEqual(null);
    expect(app.south_east_square_number(2, 3, 4)).toEqual(null);
    expect(app.south_east_square_number(4, 1, 6)).toEqual(32);
    expect(app.south_east_square_number(5, 0, 6)).toEqual(null);
    expect(app.south_east_square_number(1, 1, 6)).toEqual(14);
    expect(app.south_east_square_number(4, 5, 6)).toEqual(null);
});

it('rwo_section', () => {
    expect(app.rwo_section(0, 1, 1)).toEqual([0]);

    expect(app.rwo_section(0, 2, 2)).toEqual([0, 1]);
    expect(app.rwo_section(1, 2, 2)).toEqual([0, 1]);
    expect(app.rwo_section(2, 2, 2)).toEqual([2, 3]);
    expect(app.rwo_section(3, 2, 2)).toEqual([2, 3]);

    expect(app.rwo_section(4, 4, 1)).toEqual([4]);

    expect(app.rwo_section(0, 4, 2)).toEqual([0, 1]);
    expect(app.rwo_section(1, 4, 2)).toEqual([0, 1, 2]);
    expect(app.rwo_section(3, 4, 2)).toEqual([2, 3]);
    expect(app.rwo_section(13, 4, 2)).toEqual([12, 13, 14]);

    expect(app.rwo_section(3, 4, 3)).toEqual([1, 2, 3]);
    expect(app.rwo_section(8, 4, 3)).toEqual([8, 9, 10]);
    expect(app.rwo_section(6, 4, 3)).toEqual([4, 5, 6, 7]);

    expect(app.rwo_section(4, 4, 4)).toEqual([4, 5, 6, 7]);
    expect(app.rwo_section(7, 4, 4)).toEqual([4, 5, 6, 7]);

    expect(app.rwo_section(30, 6, 2)).toEqual([30, 31]);
    expect(app.rwo_section(7, 6, 2)).toEqual([6, 7, 8]);

    expect(app.rwo_section(33, 6, 3)).toEqual([31, 32, 33, 34, 35]);
    expect(app.rwo_section(7, 6, 4)).toEqual([6, 7, 8, 9, 10]);
    expect(app.rwo_section(7, 6, 5)).toEqual([6, 7, 8, 9, 10, 11]);
});

it('column_section', () => {
    expect(app.column_section(0, 1, 1)).toEqual([0]);

    expect(app.column_section(0, 2, 2)).toEqual([0, 2]);
    expect(app.column_section(1, 2, 2)).toEqual([1, 3]);
    expect(app.column_section(2, 2, 2)).toEqual([0, 2]);
    expect(app.column_section(3, 2, 2)).toEqual([1, 3]);

    expect(app.column_section(4, 4, 1)).toEqual([4]);

    expect(app.column_section(0, 4, 2)).toEqual([0, 4]);
    expect(app.column_section(1, 4, 2)).toEqual([1, 5]);
    expect(app.column_section(3, 4, 2)).toEqual([3, 7]);
    expect(app.column_section(13, 4, 2)).toEqual([9, 13]);
    expect(app.column_section(10, 4, 2)).toEqual([6, 10, 14]);

    expect(app.column_section(3, 4, 3)).toEqual([3, 7, 11]);
    expect(app.column_section(8, 4, 3)).toEqual([0, 4, 8, 12]);
    expect(app.column_section(6, 4, 3)).toEqual([2, 6, 10, 14]);

    expect(app.column_section(4, 4, 4)).toEqual([0, 4, 8, 12]);
    expect(app.column_section(7, 4, 4)).toEqual([3, 7, 11, 15]);

    expect(app.column_section(30, 6, 2)).toEqual([24, 30]);
    expect(app.column_section(7, 6, 2)).toEqual([1, 7, 13]);

    expect(app.column_section(33, 6, 3)).toEqual([21, 27, 33]);
    expect(app.column_section(7, 6, 4)).toEqual([1, 7, 13, 19, 25]);
    expect(app.column_section(7, 6, 5)).toEqual([1, 7, 13, 19, 25, 31]);
});

it('north_east_section', () => {
    expect(app.north_east_section(0, 1, 1)).toEqual([0]);

    expect(app.north_east_section(0, 2, 2)).toEqual([0, 3]);
    expect(app.north_east_section(1, 2, 2)).toEqual([1]);
    expect(app.north_east_section(2, 2, 2)).toEqual([2]);
    expect(app.north_east_section(3, 2, 2)).toEqual([0, 3]);

    expect(app.north_east_section(4, 4, 1)).toEqual([4]);

    expect(app.north_east_section(0, 4, 2)).toEqual([0, 5]);
    expect(app.north_east_section(1, 4, 2)).toEqual([1, 6]);
    expect(app.north_east_section(3, 4, 2)).toEqual([3]);
    expect(app.north_east_section(13, 4, 2)).toEqual([8, 13]);
    expect(app.north_east_section(10, 4, 2)).toEqual([5, 10, 15]);

    expect(app.north_east_section(3, 4, 3)).toEqual([3]);
    expect(app.north_east_section(8, 4, 3)).toEqual([8, 13]);
    expect(app.north_east_section(6, 4, 3)).toEqual([1, 6, 11]);

    expect(app.north_east_section(4, 4, 4)).toEqual([4, 9, 14]);
    expect(app.north_east_section(7, 4, 4)).toEqual([2, 7]);

    expect(app.north_east_section(30, 6, 2)).toEqual([30]);
    expect(app.north_east_section(7, 6, 2)).toEqual([0, 7, 14]);

    expect(app.north_east_section(33, 6, 3)).toEqual([19, 26, 33]);
    expect(app.north_east_section(7, 6, 4)).toEqual([0, 7, 14, 21, 28]);
    expect(app.north_east_section(7, 6, 5)).toEqual([0, 7, 14, 21, 28, 35]);
});

it('north_west_section', () => {
    expect(app.north_west_section(0, 1, 1)).toEqual([0]);

    expect(app.north_west_section(0, 2, 2)).toEqual([0]);
    expect(app.north_west_section(1, 2, 2)).toEqual([1, 2]);
    expect(app.north_west_section(2, 2, 2)).toEqual([1, 2]);
    expect(app.north_west_section(3, 2, 2)).toEqual([3]);

    expect(app.north_west_section(4, 4, 1)).toEqual([4]);

    expect(app.north_west_section(0, 4, 2)).toEqual([0]);
    expect(app.north_west_section(1, 4, 2)).toEqual([1, 4]);
    expect(app.north_west_section(3, 4, 2)).toEqual([3, 6]);
    expect(app.north_west_section(13, 4, 2)).toEqual([10, 13]);
    expect(app.north_west_section(10, 4, 2)).toEqual([7, 10, 13]);

    expect(app.north_west_section(3, 4, 3)).toEqual([3, 6, 9]);
    expect(app.north_west_section(8, 4, 3)).toEqual([2, 5, 8]);
    expect(app.north_west_section(6, 4, 3)).toEqual([3, 6, 9, 12]);

    expect(app.north_west_section(4, 4, 4)).toEqual([1, 4]);
    expect(app.north_west_section(7, 4, 4)).toEqual([7, 10, 13]);

    expect(app.north_west_section(30, 6, 2)).toEqual([25, 30]);
    expect(app.north_west_section(7, 6, 2)).toEqual([2, 7, 12]);

    expect(app.north_west_section(33, 6, 3)).toEqual([23, 28, 33]);
    expect(app.north_west_section(7, 6, 4)).toEqual([2, 7, 12]);
    expect(app.north_west_section(7, 6, 5)).toEqual([2, 7, 12]);
});
