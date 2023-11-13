export function getInitials(name) {

  // Check if name is null or not a string, return empty string if true
  if (typeof name !== 'string' || name === null) {
    return '';
  }
  // Remove any extra spaces and split the name into parts
  const nameParts = name.trim().split(/\s+/);
  // Get the first letter of each part of the name
  const initials = nameParts.map((part) => part[0].toUpperCase()).join('');
  return initials;
}