/**
 * Swaps a broken product image for a placeholder image of the
 * given dimensions. Intended for use as an <img> onError handler.
 *
 * @param event - The synthetic error event from the failed <img> load.
 * @param size - The placeholder dimensions, formatted as "WIDTHxHEIGHT".
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  size: string,
) {
  event.currentTarget.src = `https://placehold.co/${size}?text=No+Image`;
}
