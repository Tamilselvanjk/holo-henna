const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const sendOTP = async (req, res) => {
  try {
    // Accepts { mobileNumber, countryCode } or { phone }
    let mobileNumber = req.body.mobileNumber;
    let countryCode = req.body.countryCode;

    // Support { phone: "+91xxxxxxxxxx" } as well
    if (!mobileNumber && req.body.phone) {
      const phone = req.body.phone;
      countryCode = phone.startsWith('+') ? phone.slice(0, 3) : '+91';
      mobileNumber = phone.replace(/^\+\d{1,4}/, '');
    }

    const cleanNumber = mobileNumber.replace(/\D/g, '');

    if (!cleanNumber || cleanNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number',
      });
    }
    if (!countryCode || !/^\+\d{1,4}$/.test(countryCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid country code format',
      });
    }

    const formattedNumber = `${countryCode}${cleanNumber}`;
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: formattedNumber, channel: 'sms' });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      verificationSid: verification.sid,
    });
  } catch (error) {
    console.error('Twilio OTP Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP',
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    // Accepts { mobileNumber, countryCode, otp } or { phone, otp }
    let mobileNumber = req.body.mobileNumber;
    let countryCode = req.body.countryCode;
    let otp = req.body.otp;

    if (!mobileNumber && req.body.phone) {
      const phone = req.body.phone;
      countryCode = phone.startsWith('+') ? phone.slice(0, 3) : '+91';
      mobileNumber = phone.replace(/^\+\d{1,4}/, '');
    }

    if (!mobileNumber || !countryCode || !otp) {
      return res.status(400).json({ success: false, message: 'Invalid input parameters' });
    }

    const formattedNumber = `${countryCode}${mobileNumber}`;
    const verification_check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: formattedNumber, code: otp });

    if (verification_check.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    let user = await User.findOne({ phone: formattedNumber });
    if (!user) {
      user = await User.create({
        phone: formattedNumber,
        isPhoneVerified: true,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'OTP verification failed',
    });
  }
};

module.exports = { sendOTP, verifyOTP };
