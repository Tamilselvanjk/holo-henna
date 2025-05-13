const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER
}

// Validate Twilio configuration
const validateTwilioConfig = () => {
  if (!twilioConfig.accountSid) throw new Error('TWILIO_ACCOUNT_SID is required')
  if (!twilioConfig.authToken) throw new Error('TWILIO_AUTH_TOKEN is required')
  if (!twilioConfig.phoneNumber) throw new Error('TWILIO_PHONE_NUMBER is required')
}

module.exports = {
  twilioConfig,
  validateTwilioConfig
}
