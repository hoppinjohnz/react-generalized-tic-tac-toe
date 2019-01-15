const app = require('./App');

describe('number_of_lines', () => {
    test.each`
        mv   | d      | expected
        ${2}     | ${2}   | ${3}
        ${2}     | ${3}   | ${3}
        ${4}    | ${3}   | ${4}
        ${10}    | ${4}   | ${4}
        ${5}    | ${4}  | ${4}
        ${15}    | ${4}  | ${3}
        ${10}    | ${6}   | ${4}
        ${22}    | ${6}   | ${4}
        ${25}    | ${6}   | ${4}
        ${6}    | ${6}   | ${2}
        ${18}    | ${6}   | ${2}
        ${23}    | ${6}   | ${2}
        ${33}    | ${6}   | ${2}
        ${0}    | ${11}   | ${3}
        ${99}    | ${11}   | ${2}
    `('mv: $mv and dimension: $d => number_of_lines: $expected', ({ mv, d, expected }) => {
        expect(app.number_of_lines(mv, d)).toEqual(expected)
    });
});

describe('on_inside', () => {
    test.each`
        mv   | d      | expected
        ${2}     | ${3}   | ${false}
        ${4}    | ${3}   | ${true}
        ${10}    | ${4}   | ${true}
        ${5}    | ${4}  | ${true}
        ${15}    | ${4}  | ${false}
        ${10}    | ${6}   | ${true}
        ${22}    | ${6}   | ${true}
        ${25}    | ${6}   | ${true}
        ${6}    | ${6}   | ${false}
        ${18}    | ${6}   | ${false}
        ${23}    | ${6}   | ${false}
        ${33}    | ${6}   | ${false}
        ${0}    | ${11}   | ${false}
        ${99}    | ${11}   | ${false}
    `('mv: $mv and dimension: $d => on_inside: $expected', ({ mv, d, expected }) => {
        expect(app.on_inside(mv, d)).toEqual(expected)
    });
});

describe('on_wall', () => {
    test.each`
        mv   | d      | expected
        ${2}     | ${3}   | ${false}
        ${15}    | ${4}  | ${false}
        ${22}    | ${6}   | ${false}
        ${6}    | ${6}   | ${true}
        ${18}    | ${6}   | ${true}
        ${23}    | ${6}   | ${true}
        ${33}    | ${6}   | ${true}
        ${0}    | ${11}   | ${false}
        ${99}    | ${11}   | ${true}
    `('mv: $mv and dimension: $d => on_wall: $expected', ({ mv, d, expected }) => {
        expect(app.on_wall(mv, d)).toEqual(expected)
    });
});

describe('on_corner', () => {
    test.each`
        mv   | d      | expected
        ${2}     | ${3}   | ${true}
        ${15}    | ${4}  | ${true}
        ${22}    | ${6}   | ${false}
        ${0}    | ${11}   | ${true}
        ${99}    | ${11}   | ${false}
    `('mv: $mv and dimension: $d => on_corner: $expected', ({ mv, d, expected }) => {
        expect(app.on_corner(mv, d)).toEqual(expected)
    });
});

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

it('row_section', () => {
    expect(app.row_section(0, 1, 1)).toEqual([0]);

    expect(app.row_section(0, 2, 2)).toEqual([0, 1]);
    expect(app.row_section(1, 2, 2)).toEqual([0, 1]);
    expect(app.row_section(2, 2, 2)).toEqual([2, 3]);
    expect(app.row_section(3, 2, 2)).toEqual([2, 3]);

    expect(app.row_section(4, 4, 1)).toEqual([4]);

    expect(app.row_section(0, 4, 2)).toEqual([0, 1]);
    expect(app.row_section(1, 4, 2)).toEqual([0, 1, 2]);
    expect(app.row_section(3, 4, 2)).toEqual([2, 3]);
    expect(app.row_section(13, 4, 2)).toEqual([12, 13, 14]);

    expect(app.row_section(3, 4, 3)).toEqual([1, 2, 3]);
    expect(app.row_section(8, 4, 3)).toEqual([8, 9, 10]);
    expect(app.row_section(6, 4, 3)).toEqual([4, 5, 6, 7]);

    expect(app.row_section(4, 4, 4)).toEqual([4, 5, 6, 7]);
    expect(app.row_section(7, 4, 4)).toEqual([4, 5, 6, 7]);

    expect(app.row_section(30, 6, 2)).toEqual([30, 31]);
    expect(app.row_section(7, 6, 2)).toEqual([6, 7, 8]);

    expect(app.row_section(33, 6, 3)).toEqual([31, 32, 33, 34, 35]);
    expect(app.row_section(7, 6, 4)).toEqual([6, 7, 8, 9, 10]);
    expect(app.row_section(7, 6, 5)).toEqual([6, 7, 8, 9, 10, 11]);
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

describe('whole_row', () => {
    test.each`
        row_number   | d      | expected
        ${0}     | ${2}   | ${[0, 1]}
        ${1}     | ${2}   | ${[2, 3]}
        ${0}     | ${3}   | ${[0, 1, 2]}
        ${1}     | ${3}   | ${[3, 4, 5]}
        ${2}     | ${3}   | ${[6, 7, 8]}
        ${1}    | ${4}   | ${[4, 5, 6, 7]}
        ${0}    | ${6}   | ${[0, 1, 2, 3, 4, 5]}
        ${5}    | ${6}   | ${[30, 31, 32, 33, 34, 35]}
    `('row_number: $row_number and dimension: $d => whole_row: $expected', ({ row_number, d, expected }) => {
        expect(app.whole_row(row_number, d)).toEqual(expected)
    });
});

describe('whole_column', () => {
    test.each`
        col_num   | d      | expected
        ${1}     | ${2}   | ${[1, 3]}
        ${2}     | ${3}   | ${[2, 5, 8]}
        ${1}    | ${4}   | ${[1, 5, 9, 13]}
        ${0}    | ${6}   | ${[0, 6, 12, 18, 24, 30]}
        ${5}    | ${6}   | ${[5, 11, 17, 23, 29, 35]}
    `('col_num: $col_num and dimension: $d => whole_column: $expected', ({ col_num, d, expected }) => {
        expect(app.whole_column(col_num, d)).toEqual(expected)
    });
});

describe('what_diagonal', () => {
    test.each`
        mv   | d      | expected
        ${0}     | ${2}   | ${0}
        ${1}     | ${2}   | ${1}
        ${2}     | ${2}   | ${-1}
        ${3}     | ${2}   | ${0}
        ${2}     | ${3}   | ${1}
        ${6}     | ${3}   | ${-1}
        ${1}    | ${4}   | ${1}
        ${13}    | ${4}   | ${-1}
        ${0}    | ${6}   | ${0}
        ${5}    | ${6}   | ${1}
        ${33}    | ${6}   | ${-1}
        ${18}    | ${6}   | ${-1}
    `('mv: $mv and dimension: $d => what_diagonal: $expected', ({ mv, d, expected }) => {
        expect(app.what_diagonal(mv, d)).toEqual(expected)
    });
});

describe('whole_south_east', () => {
    test.each`
        mv   | d      | expected
        ${0}     | ${2}   | ${[0, 3]}
        ${1}     | ${2}   | ${[1]}
        ${2}     | ${3}   | ${[2]}
        ${1}    | ${4}   | ${[1, 6, 11]}
        ${0}    | ${6}   | ${[0, 7, 14, 21, 28, 35]}
        ${1}    | ${6}   | ${[1, 8, 15, 22, 29]}
        ${6}    | ${6}   | ${[6, 13, 20, 27, 34]}
        ${18}    | ${6}   | ${[18, 25, 32]}
        ${25}    | ${6}   | ${[18, 25, 32]}
        ${32}    | ${6}   | ${[18, 25, 32]}
        ${5}    | ${6}   | ${[5]}
        ${30}    | ${6}   | ${[30]}
    `('mv: $mv and dimension: $d => whole_south_east: $expected', ({ mv, d, expected }) => {
        expect(app.whole_south_east(mv, d)).toEqual(expected)
    });
});

describe('what_sub_diagonal', () => {
    test.each`
        mv   | d      | expected
        ${0}     | ${2}   | ${1}
        ${1}     | ${2}   | ${0}
        ${2}     | ${2}   | ${0}
        ${3}     | ${2}   | ${-1}
        ${2}     | ${3}   | ${0}
        ${6}     | ${3}   | ${0}
        ${1}    | ${4}   | ${1}
        ${13}    | ${4}   | ${-1}
        ${0}    | ${6}   | ${1}
        ${5}    | ${6}   | ${0}
        ${33}    | ${6}   | ${-1}
        ${18}    | ${6}   | ${1}
    `('mv: $mv and dimension: $d => what_sub_diagonal: $expected', ({ mv, d, expected }) => {
        expect(app.what_sub_diagonal(mv, d)).toEqual(expected)
    });
});

describe('whole_south_west', () => {
    test.each`
        mv   | d      | expected
        ${0}     | ${2}   | ${[0]}
        ${1}     | ${2}   | ${[1, 2]}
        ${2}     | ${2}   | ${[1, 2]}
        ${2}     | ${3}   | ${[2, 4, 6]}
        ${1}     | ${3}   | ${[1, 3]}
        ${1}     | ${4}   | ${[1, 4]}
        ${2}     | ${4}   | ${[2, 5, 8]}
        ${3}     | ${4}   | ${[3, 6, 9, 12]}
        ${20}     | ${6}   | ${[5, 10, 15, 20, 25, 30]}
        ${3}     | ${2}   | ${[3]}
        ${5}     | ${3}   | ${[5, 7]}
        ${7}     | ${3}   | ${[5, 7]}
        ${1}     | ${4}   | ${[1, 4]}
        ${7}     | ${4}   | ${[7, 10, 13]}
        ${10}     | ${4}   | ${[7, 10, 13]}
        ${13}     | ${4}   | ${[7, 10, 13]}
        ${9}     | ${5}   | ${[9, 13, 17, 21]}
        ${13}     | ${5}   | ${[9, 13, 17, 21]}
        ${17}     | ${5}   | ${[9, 13, 17, 21]}
        ${21}     | ${5}   | ${[9, 13, 17, 21]}
        ${24}     | ${5}   | ${[24]}
    `('mv: $mv and dimension: $d => whole_south_west: $expected', ({ mv, d, expected }) => {
        expect(app.whole_south_west(mv, d)).toEqual(expected)
    });
});

// rows
describe('most_plausible for rows', () => {
    test.each`
        plyr   | sqrs                                                      | d | expected
        ${'X'} | ${[null, null, null, null, null, null, null, null, null]} | ${3} | ${null}
        ${'X'} | ${[null, null, 'X', null, null, null, null, null, null]} | ${3} | ${[2]}
        ${'X'} | ${['O', null, 'X', null, null, null, null, null, null]} | ${3} | ${[2]}
        ${'X'} | ${['X', null, null, null, null, null, null, null, null]} | ${3} | ${[0]}
        ${'X'} | ${[null, 'X', null, null, null, null, null, null, null]} | ${3} | ${[1]}
        ${'X'} | ${['X', 'X', null, null, null, null, null, null, null]} | ${3} | ${[0, 1]}
        ${'X'} | ${['X', 'X', 'X', null, null, null, null, null, null]} | ${3} | ${[0, 1, 2]}
        ${'X'} | ${['O', 'X', 'X', null, null, null, null, null, null]} | ${3} | ${[1, 2]}
        ${'O'} | ${['O', 'X', 'X', null, null, null, null, null, null]} | ${3} | ${[0]}
        ${'O'} | ${['X', 'X', 'X', null, null, null, null, null, null]} | ${3} | ${null}
        ${'O'} | ${['X', 'X', 'X', null, null, null, null, null, null]} | ${3} | ${null}
        ${'O'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${3} | ${[6, 7, 8]}
        ${'X'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${3} | ${[0, 1, 2]}
        ${'O'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${3} | ${[6, 7, 8]}
        ${'X'} | ${['X', 'X', 'X', null, 'X', null, 'X', 'O', 'O']} | ${3} | ${[0, 1, 2]}
        ${'O'} | ${['X', 'X', 'O', null, 'O', null, 'O', 'O', 'O']} | ${3} | ${[6, 7, 8]}
        ${'X'} | ${['X', 'X', 'X', null, 'X', null, 'X', 'O', 'O']} | ${3} | ${[0, 1, 2]}
        ${'O'} | ${['X', 'X', 'O', 'O', 'O', 'O', 'O', 'O', 'O']} | ${3} | ${[3, 4, 5]}
    `('$plyr, $sqrs, $d => most plausible: $expected', ({ plyr, sqrs, d, expected }) => {
        expect(app.most_plausible(plyr, sqrs, d)).toEqual(expected)
    });
});

// columns
describe('most_plausible for columns', () => {
    test.each`
        plyr   | sqrs                                                      | d | expected
        ${'X'} | ${[null, null, null, null, null, null, null, null, null]} | ${3} | ${null}
        ${'X'} | ${['X', null, null, 'X', null, null, null, null, null]} | ${3} | ${[0, 3]}
        ${'X'} | ${['X', null, null, 'X', null, null, 'O', null, null]} | ${3} | ${[0, 3]}
        ${'X'} | ${['X', null, null, 'X', null, null, 'X', null, null]} | ${3} | ${[0, 3, 6]}
        ${'O'} | ${['X', null, null, 'X', null, null, 'X', null, null]} | ${3} | ${null}
        ${'X'} | ${[null, null, 'X', null, null, 'X', null, null, 'X']} | ${3} | ${[2, 5, 8]}
        ${'O'} | ${[null, null, 'O', null, null, 'O', null, null, 'O']} | ${3} | ${[2, 5, 8]}
        ${'X'} | ${['O', null, 'X', null, null, null, null, null, 'X']} | ${3} | ${[2]}
        ${'X'} | ${['O', null, null, null, null, null, null, null, 'X']} | ${3} | ${[8]}
        ${'X'} | ${['X', null, null, null, null, null, null, null, null]} | ${3} | ${[0]}
        ${'X'} | ${[null, 'X', null, null, null, null, null, null, null]} | ${3} | ${[1]}
        ${'O'} | ${['X', 'X', 'O', 'X', 'O', 'O', 'O', 'O', 'O']} | ${3} | ${[6, 7, 8]}
        ${'O'} | ${['X', 'X', 'O', 'X', 'O', 'O', 'O', 'X', 'O']} | ${3} | ${[2, 5, 8]}
        ${'X'} | ${['X', 'X', 'O', 'X', 'O', 'O', 'O', 'X', 'O']} | ${3} | ${[0, 1]}
        ${'O'} | ${[null, 'X', null, 'X', 'O', 'O', 'O', 'X', 'O']} | ${3} | ${[4, 5]}
        ${'X'} | ${[null, 'X', 'X', 'X', 'O', 'O', 'O', 'X', 'O']} | ${3} | ${[1, 2]}
        ${'O'} | ${[null, 'X', 'X', 'X', 'O', 'O', 'O', 'X', 'O']} | ${3} | ${[4, 5]}
    `('$plyr, $sqrs, $d => most plausible: $expected', ({ plyr, sqrs, d, expected }) => {
        expect(app.most_plausible(plyr, sqrs, d)).toEqual(expected)
    });
});

// south east
describe('most_plausible for south east', () => {
    test.each`
        plyr   | sqrs                                                      | d | expected
        ${'X'} | ${[null, 'X', null, 'X', 'O', 'O', 'O', 'X', 'O']} | ${3} | ${[3, 7]}
        ${'O'} | ${[null, 'X', null, 'X', 'O', 'O', 'O', 'X', 'O']} | ${3} | ${[4, 5]}
        ${'O'} | ${[null, 'X', null, 'X', 'O', null, 'O', 'X', 'O']} | ${3} | ${[4, 8]}
        ${'O'} | ${[null, 'X', null, 'X', 'O', 'X', 'O', 'X', 'O']} | ${3} | ${[4, 8]}
        ${'X'} | ${[null, 'X', null, 'X', 'O', 'X', 'O', 'X', 'O']} | ${3} | ${[1, 5]}
        ${'O'} | ${['O', null, 'X', null, 'O', null, null, null, 'X']} | ${3} | ${[0, 4]}
        ${'X'} | ${['O', null, 'X', null, 'O', null, null, null, 'X']} | ${3} | ${[2]}
        ${'X'} | ${['O', null, 'X', null, 'O', null, 'X', null, 'X']} | ${3} | ${[2]}
        ${'O'} | ${['O', 'O', 'X', null, 'O', null, 'X', null, 'X']} | ${3} | ${[0, 1]}
    `('$plyr, $sqrs, $d => most plausible: $expected', ({ plyr, sqrs, d, expected }) => {
        expect(app.most_plausible(plyr, sqrs, d)).toEqual(expected)
    });
});

// south west
describe('most_plausible for south west; for 4x4 too', () => {
    test.each`
        plyr   | sqrs                                                      | d | expected
        ${'X'} | ${[null, 'X', null, 'X', null, null, null, null, 'O']} | ${3} | ${[1, 3]}
        ${'O'} | ${[null, 'O', null, 'O', null, null, null, null, 'X']} | ${3} | ${[1, 3]}
        ${'X'} | ${[null, null, null, null, null, 'X', null, 'X', 'O']} | ${3} | ${[5, 7]}
        ${'O'} | ${[null, null, null, null, null, 'X', null, 'X', 'O']} | ${3} | ${[8]}
        ${'X'} | ${[null, null, 'X', null, 'X', null, 'X', null, null]} | ${3} | ${[2, 4, 6]}
        ${'X'} | ${['O', null, 'X', null, 'X', null, 'X', null, 'O']} | ${3} | ${[2, 4, 6]}
        ${'X'} | ${[null, null, null, 'X',  
                    null, null, null, null,  
                    null, null, null, null,  
                    null, null, null, null]} | ${4} | ${[3]}
        ${'X'} | ${[null, 'X', null, 'X',  
                    null, null, null, null,  
                    null, null, null, null,  
                    null, null, null, null]} | ${4} | ${[3]}
        ${'X'} | ${['X', 'X', null, 'X',  
                    null, null, 'X', null,  
                    null, 'X', null, null,  
                    null, null, null, null]} | ${4} | ${[3, 6, 9]}
        ${'X'} | ${[null, null, null, 'X',  
                    null, null, 'X', null,  
                    null, null, null, null,  
                    null, null, null, null]} | ${4} | ${[3, 6]}
        ${'X'} | ${[null, 'X', 'X', 'X',  
                    'X', null, 'X', null,  
                    'X', 'X', 'X', null,  
                    null, 'X', 'X', 'X']} | ${4} | ${[2, 6, 10, 14]}
        ${'X'} | ${['O', null, 'X', 'O',  
                    'X', 'X', 'O', 'O',  
                    'O', 'X', 'O', 'X',  
                    null, 'X', 'X', null]} | ${4} | ${[5, 9, 13]}
        ${'O'} | ${['O', null, 'X', 'O',  
                    'X', 'X', 'O', 'O',  
                    'O', 'X', 'O', 'X',  
                    null, 'X', 'X', null]} | ${4} | ${[6, 7]}
        ${'O'} | ${['O', null, 'X', 'O',  
                    'X', 'X', 'O', 'O',  
                    'O', 'X', 'O', 'X',  
                    null, 'O', 'X', null]} | ${4} | ${[7, 10, 13]}
    `('$plyr, $sqrs, $d => most plausible: $expected', ({ plyr, sqrs, d, expected }) => {
        expect(app.most_plausible(plyr, sqrs, d)).toEqual(expected)
    });
});

describe('check_line_for_best_potential', () => {
    test.each`
        arr             | plyr   | sqrs                        | expected
        ${[0, 1, 2]} | ${'X'} | ${[null, null, null, null, null, null, null, null, null]} | ${null}
        ${[0, 1, 2]} | ${'X'} | ${[null, null, 'X', null, null, null, null, null, null]} | ${[2]}
        ${[0, 1, 2]} | ${'X'} | ${['O', null, 'X', null, null, null, null, null, null]} | ${[2]}
        ${[0, 1, 2]} | ${'X'} | ${['X', null, null, null, null, null, null, null, null]} | ${[0]}
        ${[0, 1, 2]} | ${'X'} | ${[null, 'X', null, null, null, null, null, null, null]} | ${[1]}
        ${[0, 1, 2]} | ${'X'} | ${['X', 'X', null, null, null, null, null, null, null]} | ${[0, 1]}
        ${[0, 1, 2]} | ${'X'} | ${['X', 'X', 'X', null, null, null, null, null, null]} | ${[0, 1, 2]}
        ${[0, 1, 2]} | ${'X'} | ${['O', 'X', 'X', null, null, null, null, null, null]} | ${[1, 2]}
        ${[0, 1, 2]} | ${'O'} | ${['O', 'X', 'X', null, null, null, null, null, null]} | ${[0]}
        ${[0, 1, 2]} | ${'O'} | ${['X', 'X', 'X', null, null, null, null, null, null]} | ${null}
        ${[2, 5, 8]} | ${'X'} | ${['O', null, 'X', 
                                    null, null, null, 
                                    null, null, 'X']} | ${[8]}
        ${[2, 4, 6]} | ${'X'} | ${['O', null, 'X', null, null, null, null, null, 'X']} | ${[2]}
        ${[2, 4, 6]} | ${'X'} | ${['O', null, null, null, 'X', null, null, null, 'X']} | ${[4]}
        ${[2, 4, 6]} | ${'X'} | ${['O', null, null, null, null, null, 'X', null, 'X']} | ${[6]}
        ${[3, 4, 5]} | ${'O'} | ${['X', 'X', 'X', null, null, null, null, null, null]} | ${null}
        ${[6, 7, 8]} | ${'O'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${[6, 7, 8]}
        ${[0, 4, 8]} | ${'X'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${[0]}
        ${[0, 4, 8]} | ${'O'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${[8]}
        ${[2, 4, 6]} | ${'X'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${[2]}
        ${[2, 4, 6]} | ${'O'} | ${['X', 'X', 'X', null, null, null, 'O', 'O', 'O']} | ${[6]}
        ${[2, 4, 6]} | ${'X'} | ${['X', 'X', 'X', null, 'X', null, 'X', 'O', 'O']} | ${[2, 4, 6]}
        ${[2, 4, 6]} | ${'O'} | ${['X', 'X', 'O', null, 'O', null, 'O', 'O', 'O']} | ${[2, 4, 6]}
        ${[3, 4, 5]} | ${'X'} | ${['X', 'X', 'X', null, 'X', null, 'X', 'O', 'O']} | ${[4]}
        ${[3, 4, 5]} | ${'O'} | ${['X', 'X', 'O', 'O', 'O', 'O', 'O', 'O', 'O']} | ${[3, 4, 5]}
        ${[0, 1, 2, 3]} | ${'X'} | ${[null, null, null, 'X',
                                      null, null, null, null,
                                      null, null, null, null,
                                      null, null, null, null]} | ${[3]}
        ${[0, 1, 2, 3]} | ${'X'} | ${['X', null, null, 'X',
                                      null, null, null, null,
                                      null, null, null, null,
                                      null, null, null, null]} | ${[3]}
        ${[0, 1, 2, 3]} | ${'X'} | ${['X', null, 'X', 'X',
                                      null, null, null, null,
                                      null, null, null, null,
                                      null, null, null, null]} | ${[2, 3]}
        ${[0, 1, 2, 3]} | ${'X'} | ${[null, 'X', null, 'X',
                                      null, null, null, null,
                                      null, null, null, null,
                                      null, null, null, null]} | ${[3]}
        ${[0, 1, 2, 3]} | ${'X'} | ${[null, 'X', 'X', 'X',
                                      null, null, null, null,
                                      null, null, null, null,
                                      null, null, null, null]} | ${[1, 2, 3]}
        ${[0, 1, 2, 3]} | ${'X'} | ${['X', null, 'X', 'X',
                                      null, null, null, null,
                                      null, null, null, null,
                                      null, null, null, null]} | ${[2, 3]}
        ${[0, 4, 8, 12]} | ${'X'} | ${['X', null, 'X', 'X',
                                      null, null, null, null,
                                      null, null, null, null,
                                      null, null, null, null]} | ${[0]}
        ${[0, 4, 8, 12]} | ${'X'} | ${['X', null, 'X', 'X',
                                      null, null, null, null,
                                      'X', null, null, null,
                                      null, null, null, null]} | ${[8]}
        ${[0, 4, 8, 12]} | ${'X'} | ${['X', null, 'X', 'X',
                                      'O', null, null, null,
                                      'X', null, null, null,
                                      'O', null, null, null]} | ${[8]}
        ${[0, 4, 8, 12]} | ${'O'} | ${['X', null, 'X', 'X',
                                      'O', null, null, null,
                                      'X', null, null, null,
                                      'O', null, null, null]} | ${[12]}
        ${[0, 4, 8, 12]} | ${'O'} | ${['X', null, 'X', 'X',
                                      'O', null, null, null,
                                      'O', null, null, null,
                                      'O', null, null, null]} | ${[4, 8, 12]}
    `('$arr, $plyr, $sqrs => $expected', ({ arr, plyr, sqrs, expected }) => {
        expect(app.check_line_for_best_potential(arr, plyr, sqrs)).toEqual(expected)
    });
});



