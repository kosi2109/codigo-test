exports.checkOtpErrorIfSameDate = (isSameDate, otpCheck) => {
  if (isSameDate && otpCheck.error === 5) {
    return true;
  }

  return false;
};
