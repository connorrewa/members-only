module.exports = {
    content: ['./views/**/*.ejs', './public/**/*.{html,js}'],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
};
