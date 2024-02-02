export function convertToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - minutes * 60;

  return `${("0" + minutes).slice(-2)} : ${("0" + remainingSeconds).slice(-2)}`;
}
