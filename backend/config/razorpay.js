import Razorpay from "razorpay";

const key_id =
  process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEY ||
  "rzp_test_TrEB2gTkre3jX2";

const key_secret =
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_KEY_SECERET ||
  process.env.RAZORPAY_SECRET ||
  "uOlD79mMgsK6YlXYMp5ss3tH";

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export default razorpay;