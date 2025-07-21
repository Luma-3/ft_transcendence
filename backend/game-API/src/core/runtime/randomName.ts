export function randomNameGenerator() {
  const allPrefix = [
    "Duck",
    "Canard",
    "Quack",
    "Pato",
    "Coin",
    "Sir",
    "Dr",
    "El",
    "Billy",
    "Captain",
    "Lord"];

  const allSuffix = [
    "Destroyer",
    "Fury",
    "Bot",
    "Master",
    "King",
    "Duck-Vador",
    "Zilla",
    "Pongster",
    "Norris"];

  const randomPrefix = allPrefix[Math.floor(Math.random() * allPrefix.length)];
  const randomSuffix = allSuffix[Math.floor(Math.random() * allSuffix.length)];

  return `${randomPrefix} ${randomSuffix}`;
}