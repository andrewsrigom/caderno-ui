// CI also builds this source as a real server outside the workspace.
export default {
  output: process.env.CADERNO_NOTES_SERVER === '1' ? undefined : 'export',
  basePath: process.env.CADERNO_NOTES_BASE_PATH ?? '',
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
}
