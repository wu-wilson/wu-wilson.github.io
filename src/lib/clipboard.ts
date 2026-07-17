/**
 * Copy text to the clipboard, swallowing failures (unsupported browser, denied permission)
 * so the caller can optimistically show a "copied" state without a try/catch at every site.
 * @param text - The text to place on the clipboard
 * @returns `true` if the write was attempted successfully, `false` if the API was unavailable or threw
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
