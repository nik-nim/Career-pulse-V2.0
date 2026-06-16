export function formatSalary(min?: number, max?: number): string {
  if (min && max) return `${min}L - ${max}L`
  if (min) return `${min}L+`
  if (max) return `Up to ${max}L`
  return 'Not disclosed'
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}