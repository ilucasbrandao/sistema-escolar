export function paginate(items, currentPage = 1, itemsPerPage = 10) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
}
