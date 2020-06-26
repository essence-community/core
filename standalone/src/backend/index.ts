const isNotGui = process.argv.includes('--nogui')
if (isNotGui) {
    import('./NoGui').then(() => {}, (err) => console.error(err));
} else {
    import('./Gui')
    .then(() => {}, () => import('./NoGui'))
    .catch((err) => console.error(err));
}