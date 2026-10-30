/** The original portal remains available as an explicit local preview. */
export function staffUsesBackend(): boolean {
  return process.env.NEXT_PUBLIC_STAFF_API_MOCKING !== 'enabled';
}
