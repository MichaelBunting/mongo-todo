let verbs = ['Get', 'Take', 'Leave', 'Put', 'Destroy'];
let determiner = ['the', 'a', 'those', 'this'];
let nouns = ['trash', 'car', 'bike', 'man', 'kid', 'stick'];
let preposition = ['in', 'to', 'on', 'from', 'with'];

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    randomSentence: () => {
        return `${verbs[randomNumber(0, verbs.length - 1)]} ${determiner[randomNumber(0, determiner.length - 1)]} ${nouns[randomNumber(0, nouns.length - 1)]} ${preposition[randomNumber(0, preposition.length - 1)]} ${determiner[randomNumber(0, determiner.length - 1)]} ${nouns[randomNumber(0, nouns.length - 1)]}`;
    }
}