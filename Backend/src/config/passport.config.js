import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";
import { AppError } from "../Utils/errorHandler.js";
import { googleLoginService } from "../services/auth.service.js";

if (config.GOOGLE_ENABLED) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
                callbackURL: config.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                const email = profile.emails?.[0];
                const verified = email?.verified === true || email?.verified === "true";

                if (!email || !verified) {
                    return done(null, false, { code: "email_not_verified" });
                }

                try {
                    const result = await googleLoginService({
                        googleId: profile.id,
                        email: email.value,
                        name: profile.displayName || email.value.split("@")[0],
                    });
                    return done(null, result);
                } catch (error) {
                    if (error instanceof AppError && error.statusCode === 409) {
                        return done(null, false, { code: "email_registered" });
                    }
                    return done(error);
                }
            }
        )
    );
}

export default passport;
