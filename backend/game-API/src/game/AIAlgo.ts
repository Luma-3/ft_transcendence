

export function target(
    targetZone: number,
    paddleY: number,
    fieldHeight = 600,
    zoneCount = 7,
    threshold = 150
): { move: number } {
    const zoneHeight = fieldHeight / zoneCount;
    const zoneCenter = (targetZone + 0.5) * zoneHeight;
    
    if (paddleY < zoneCenter - threshold)
        return { move: -1 };
    if (paddleY > zoneCenter + threshold)
        return { move: 1 };
    return { move: 0 };
}
