import Card, { ICard } from 'models/Card';

const createCard = async () => {
    let result: Array<number> = [];
    let B = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let I = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    let N = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
    let G = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    let O = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];

    for (let i = 0; i < 5; i++) {
        result.push(
            ...B.splice(Math.floor(Math.random() * (B.length - 0)) + 0, 1)
        );
    }
    for (let i = 0; i < 5; i++) {
        result.push(
            ...I.splice(Math.floor(Math.random() * (I.length - 0)) + 0, 1)
        );
    }
    for (let i = 0; i < 5; i++) {
        if (i === 2) result.push(0);
        else
            result.push(
                ...N.splice(Math.floor(Math.random() * (N.length - 0)) + 0, 1)
            );
    }
    for (let i = 0; i < 5; i++) {
        result.push(
            ...G.splice(Math.floor(Math.random() * (G.length - 0)) + 0, 1)
        );
    }
    for (let i = 0; i < 5; i++) {
        result.push(
            ...O.splice(Math.floor(Math.random() * (O.length - 0)) + 0, 1)
        );
    }
    const card: ICard = await Card.findOne({
        data: { $all: result }
    });

    if (Boolean(card)) return createCard();
    return result;
};

export default createCard;
