const sendEmail = require('../utils/sendEmail');
const { renderContactEmail } = require('../services/EmailService');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, service, preferredDate, message } = req.body;

    const to = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER;
    if (!to) {
      return res.status(500).json({ message: 'Contact email not configured' });
    }

    const safe = (v) => String(v || '').replace(/[<>]/g, '');
    const html = renderContactEmail({ name, email, service, preferredDate, message });
    await sendEmail(to, 'New Photography Inquiry', html);
    res.status(200).json({ success: true, message: 'Your message has been sent. Thank you!' });
  } catch (err) {
    next(err);
  }
};


