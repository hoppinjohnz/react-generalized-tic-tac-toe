const app = require('./App');

it('rowNum', () => {
    expect(app.rowNum(2, 3)).toEqual(1);
    expect(app.rowNum(22, 6)).toEqual(4);
});
