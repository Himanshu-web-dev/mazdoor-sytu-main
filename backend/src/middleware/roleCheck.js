// src/middleware/roleCheck.js
const { sendError } = require('../utils/response')

/**
 * Role authorization guard
 * @param {...string} allowedRoles Allowed roles (e.g. 'admin', 'worker', 'customer', 'business')
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'User authentication required.', 401)
    }

    const userRole = (req.user.role || '').toLowerCase()
    const isAllowed = allowedRoles.map((r) => r.toLowerCase()).includes(userRole)

    if (!isAllowed) {
      return sendError(
        res,
        `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: '${userRole}'`,
        403
      )
    }

    next()
  }
}

module.exports = {
  authorizeRoles
}
