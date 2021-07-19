export const fibonacci = function (num: number): any {
  if (num <= 1) return 1

  return fibonacci(num - 1) + fibonacci(num - 2)
}
