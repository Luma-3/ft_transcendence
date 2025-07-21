export function randomRoomNameGenerator() {
  const allRoomNames = [
		"Duck’n Smash",
		"Quack Stadium",
		"Coincoin Chaos",
		"Duckageddon",
		"Duck Me If You Can",
		"Mighty Ducks Duel",
		"Duck VS Duck",
	];

  const randomName = allRoomNames[Math.floor(Math.random() * allRoomNames.length)];

  return randomName;
}
