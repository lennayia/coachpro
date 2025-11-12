// middleware/planLimits.js - Middleware pro kontrolu limitů podle plánu
import moment from 'moment';

// Získá subscription info pro uživatele
const getUserSubscription = async (db, userId) => {
  const subscription = await db.get(`
    SELECT 
      us.plan_id,
      us.status,
      us.current_period_start,
      us.current_period_end,
      sp.max_users,
      sp.max_payments,
      sp.features,
      sp.name as plan_name
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = ? AND us.status IN ('active', 'trial')
    ORDER BY us.created_at DESC
    LIMIT 1
  `, [userId]);

  console.log('🔍 Raw subscription result:', subscription);
  console.log('🔍 Raw subscription JSON:', JSON.stringify(subscription));
  console.log('🔍 Raw subscription keys:', Object.keys(subscription || {}));
  console.log('🔍 Raw subscription values:', Object.values(subscription || {}));

  // Default na free plan pokud nenalezen
  if (!subscription) {
    console.log('🔍 No subscription found, using default free plan');
    return {
      plan_id: 'free',
      status: 'active',
      max_users: 1,
      max_payments: 5,
      features: '["základní moduly"]',
      plan_name: 'Free'
    };
  }

  // Explicitně extrahuj hodnoty z Database objektu
  const plainSubscription = {
    plan_id: subscription.plan_id,
    status: subscription.status,
    max_users: subscription.max_users,
    max_payments: subscription.max_payments,
    features: subscription.features,
    plan_name: subscription.plan_name,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end
  };

  console.log('🔍 Extracted subscription:', plainSubscription);
  return plainSubscription;
};

// Spočítá současné využití plateb za aktuální měsíc
const getCurrentPaymentUsage = async (db, userId) => {
  // Použij SQLite-kompatibilní datum format
  const result = await db.get(`
    SELECT COUNT(*) as payment_count
    FROM payments 
    WHERE user_id = ? 
    AND created_at >= date('now', 'start of month')
    AND created_at <= date('now', 'end of month')
  `, [userId]);

  console.log('🔍 Payment count query result:', result);
  console.log('🔍 Payment count JSON:', JSON.stringify(result));
  console.log('🔍 Payment count keys:', Object.keys(result || {}));
  console.log('🔍 Payment count values:', Object.values(result || {}));
  
  // Explicitně extrahuj hodnotu z Database objektu
  const count = result?.payment_count || 0;
  console.log('🔍 Extracted payment count:', count);
  return count;
};

// Spočítá současný počet uživatelů
const getCurrentUserCount = async (db, userId) => {
  // Pro nyní počítáme jen primárního uživatele
  // Později lze rozšířit o team members
  return 1;
};

// Middleware pro kontrolu payment limitů
export const checkPaymentLimits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    console.log('🔍 Checking payment limits for user:', userId);

    // Získej subscription info
    const subscription = await getUserSubscription(req.db, userId);
    console.log('📋 User subscription:', subscription);

    // Pokud je unlimited payments (null), povolíme
    if (!subscription.max_payments) {
      console.log('✅ Unlimited payments - proceeding');
      return next();
    }

    // Spočítáme současné využití
    const currentUsage = await getCurrentPaymentUsage(req.db, userId);
    console.log(`📊 Payment usage: ${currentUsage}/${subscription.max_payments}`);

    // Kontrola limitu
    if (currentUsage >= subscription.max_payments) {
      console.log('❌ Payment limit exceeded');
      return res.status(403).json({
        success: false,
        error: 'Dosáhli jste limitu plateb pro váš plán',
        details: {
          current: currentUsage,
          limit: subscription.max_payments,
          plan: subscription.plan_name
        },
        upgradeRequired: true
      });
    }

    // Přidej info do request pro další použití
    req.subscription = subscription;
    req.paymentUsage = currentUsage;

    console.log('✅ Payment limits OK - proceeding');
    next();

  } catch (error) {
    console.error('❌ Error checking payment limits:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při kontrole limitů'
    });
  }
};

// Middleware pro kontrolu user limitů
export const checkUserLimits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    console.log('🔍 Checking user limits for user:', userId);

    // Získej subscription info
    const subscription = await getUserSubscription(req.db, userId);
    
    // Pokud je unlimited users (null), povolíme
    if (!subscription.max_users) {
      console.log('✅ Unlimited users - proceeding');
      return next();
    }

    // Spočítáme současné využití
    const currentUsers = await getCurrentUserCount(req.db, userId);
    console.log(`👥 User usage: ${currentUsers}/${subscription.max_users}`);

    // Kontrola limitu
    if (currentUsers >= subscription.max_users) {
      console.log('❌ User limit exceeded');
      return res.status(403).json({
        success: false,
        error: 'Dosáhli jste limitu uživatelů pro váš plán',
        details: {
          current: currentUsers,
          limit: subscription.max_users,
          plan: subscription.plan_name
        },
        upgradeRequired: true
      });
    }

    // Přidej info do request
    req.subscription = subscription;
    req.userUsage = currentUsers;

    console.log('✅ User limits OK - proceeding');
    next();

  } catch (error) {
    console.error('❌ Error checking user limits:', error);
    res.status(500).json({
      success: false,
      error: 'Chyba při kontrole limitů'
    });
  }
};

// Middleware pro kontrolu přístupu k funkcím podle plánu
export const requireFeature = (requiredFeature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      console.log('🔍 Checking feature access:', requiredFeature, 'for user:', userId);

      // Získej subscription info (pokud ještě není v req)
      if (!req.subscription) {
        req.subscription = await getUserSubscription(req.db, userId);
      }

      const subscription = req.subscription;
      
      // Parse features
      let features = [];
      try {
        features = subscription.features ? JSON.parse(subscription.features) : [];
      } catch (e) {
        console.error('Error parsing features:', e);
        features = [];
      }

      console.log('📋 Available features:', features);

      // Kontrola přístupu
      if (!features.includes(requiredFeature)) {
        console.log('❌ Feature access denied:', requiredFeature);
        return res.status(403).json({
          success: false,
          error: `Funkce "${requiredFeature}" není dostupná ve vašem plánu`,
          details: {
            required: requiredFeature,
            plan: subscription.plan_name,
            available: features
          },
          upgradeRequired: true
        });
      }

      console.log('✅ Feature access granted:', requiredFeature);
      next();

    } catch (error) {
      console.error('❌ Error checking feature access:', error);
      res.status(500).json({
        success: false,
        error: 'Chyba při kontrole přístupu k funkci'
      });
    }
  };
};

// Helper funkce pro získání usage stats
export const getUsageStats = async (db, userId) => {
  try {
    const subscription = await getUserSubscription(db, userId);
    const paymentUsage = await getCurrentPaymentUsage(db, userId);
    const userUsage = await getCurrentUserCount(db, userId);

    // Convert DB row to plain object for JSON serialization
    const plainSubscription = subscription ? {
      plan_id: subscription.plan_id,
      status: subscription.status,
      max_users: subscription.max_users,
      max_payments: subscription.max_payments,
      features: subscription.features,
      plan_name: subscription.plan_name,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end
    } : null;

    console.log('🔍 Plain subscription object:', plainSubscription);
    console.log('🔍 Payment usage:', paymentUsage);
    console.log('🔍 User usage:', userUsage);

    return {
      subscription: plainSubscription,
      usage: {
        payments: {
          current: paymentUsage,
          limit: plainSubscription?.max_payments,
          unlimited: !plainSubscription?.max_payments
        },
        users: {
          current: userUsage,
          limit: plainSubscription?.max_users,
          unlimited: !plainSubscription?.max_users
        }
      }
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw error;
  }
};