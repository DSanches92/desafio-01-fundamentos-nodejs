export function buildRoutePath(path) {
  const routeRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeRegex, '(?<$1>[a-z0-9\\-]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?.*)?$`)

  return pathRegex
}
