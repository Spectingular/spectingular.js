var mocks = {
    snippet: '<p style="color:blue">an html\n<em onmouseover="this.textContent=\'PWN3D!\'">hover</em>\nsnippet</p>',
    unsafe: 'this.textContent=\'PWN3D!\'',
    safe: undefined
};

module.exports = {
    mocks: mocks
};