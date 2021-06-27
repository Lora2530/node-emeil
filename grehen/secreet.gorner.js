const fs = require("fs").promises;

const isAcesible = (path) => {
    return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createGreeserIsNotExit = async (folder) => {
    if (!(await isAcesible(folder))) {
        await fs.mkdir(folder);
    }
};

module.exports = createGreeserIsNotExit;