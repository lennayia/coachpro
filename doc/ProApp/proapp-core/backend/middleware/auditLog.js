// middleware/auditLog.js - Audit logging pro admin akce
import { promisify } from 'util';

// Audit log helper
export const createAuditLog = async (db, {
  adminUserId,
  adminEmail,
  action,
  targetType = null,
  targetId = null,
  targetDetails = null,
  changesMade = null,
  ipAddress = null,
  userAgent = null,
  success = true,
  errorMessage = null
}) => {
  try {
    await db.run(`
      INSERT INTO audit_logs (
        admin_user_id, admin_email, action, target_type, target_id,
        target_details, changes_made, ip_address, user_agent,
        success, error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      adminUserId,
      adminEmail,
      action,
      targetType,
      targetId,
      targetDetails ? JSON.stringify(targetDetails) : null,
      changesMade ? JSON.stringify(changesMade) : null,
      ipAddress,
      userAgent,
      success ? 1 : 0,
      errorMessage
    ]);

    console.log(`📝 Audit log created: ${adminEmail} - ${action} - ${targetType}:${targetId}`);
  } catch (error) {
    console.error('❌ Failed to create audit log:', error);
  }
};

// Middleware pro automatický audit logging
export const auditLogMiddleware = (action, targetType = null) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Zachytíme response
    res.send = function(data) {
      logAuditEntry(req, res, data, action, targetType);
      return originalSend.call(this, data);
    };
    
    res.json = function(data) {
      logAuditEntry(req, res, data, action, targetType);
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Helper pro vytvoření audit log entry
const logAuditEntry = async (req, res, responseData, action, targetType) => {
  try {
    if (!req.user || !req.db) return;
    
    const success = res.statusCode >= 200 && res.statusCode < 300;
    let targetId = null;
    let targetDetails = null;
    let changesMade = null;
    let errorMessage = null;

    // Extrahuj target ID z URL nebo requestu
    if (req.params.id) {
      targetId = parseInt(req.params.id);
    }

    // Extrahuj target details z response
    if (success && responseData && typeof responseData === 'object') {
      if (responseData.data && responseData.data.user) {
        targetDetails = {
          email: responseData.data.user.email,
          name: `${responseData.data.user.first_name} ${responseData.data.user.last_name}`,
          role: responseData.data.user.role
        };
      }
    }

    // Extrahuj změny z request body
    if (req.body && Object.keys(req.body).length > 0) {
      changesMade = req.body;
    }

    // Extrahuj error message z response
    if (!success && responseData && responseData.error) {
      errorMessage = responseData.error;
    }

    await createAuditLog(req.db, {
      adminUserId: req.user.id,
      adminEmail: req.user.email,
      action,
      targetType,
      targetId,
      targetDetails,
      changesMade,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      success,
      errorMessage
    });
  } catch (error) {
    console.error('❌ Audit log middleware error:', error);
  }
};

// Predefined audit actions
export const AUDIT_ACTIONS = {
  DASHBOARD_VIEW: 'dashboard_view',
  USERS_LIST: 'users_list',
  USER_VIEW: 'user_view',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_CREATE: 'user_create',
  BULK_ACTION: 'bulk_user_action',
  SYSTEM_INFO: 'system_info_view',
  LOGIN_ATTEMPT: 'login_attempt',
  PASSWORD_RESET: 'password_reset',
  SUBSCRIPTION_LIST: 'subscription_list',
  SUBSCRIPTION_UPDATE: 'subscription_update'
};

export const TARGET_TYPES = {
  USER: 'user',
  PAYMENT: 'payment',
  CATEGORY: 'category',
  SYSTEM: 'system',
  AUTH: 'auth',
  SUBSCRIPTION: 'subscription'
};