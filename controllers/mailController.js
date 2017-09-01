exports.sendEmail = async (req, res) => {
    // See if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('success', 'A password reset has been mailed to you!');
        return res.redirect('/login');
    }
    // Set reset tokens and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // Send them an email with the token
    const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Password reset',
        resetUrl,
        filename: 'password-reset'
    });
    req.flash('success', `You have been email a password reset link.`);
    // Redirect to login page
    res.redirect('/login');
};