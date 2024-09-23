import { Router } from 'express';
import passport from 'passport';
// @ts-ignore
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieSession from "cookie-session"
import { AccessController } from './access.controller';
import validator, { ValidationSource } from '../../../validations/validator';
import { signupSchema, userCredential, refreshToken, otpCredential, resendOtpCredential, updateMfaCredential } from "../../../utils/joi.schema"
import schema from './schema'
import authentication from '../../../middleware/authentication';
import { google_auth, facebook_auth } from '../../../config/globals';
// import authorization from '../../../middleware/authorization';
// import "../../../auth/facebook-authenticate"
// import "../../../auth/facebook-tellegram"
import { GetSameBusinessUsersByNameDropdownQueryValidationSchema } from '../../../validations/payloadSchema/UserSchema';

export class AccessRoutes {

  readonly router: Router = Router();
  readonly controller: AccessController = new AccessController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/signup',
      validator(signupSchema),
      this.controller.signup
    )

    this.router.post(
      '/signin',
      validator(userCredential),
      this.controller.signin
    )

    this.router.post(
      '/verify-otp',
      validator(otpCredential),
      this.controller.verifyOtp
    )

    this.router.post(
      '/resend-otp',
      validator(resendOtpCredential),
      this.controller.resendOtp
    )
    this.router.put(
      '/update-mfa',
      authentication,
      validator(updateMfaCredential),
      this.controller.updateUserMfa
    )

    this.router.delete(
      '/signout',
      authentication,
      this.controller.signout
    )

    this.router.post(
      '/verify',
      authentication,
      this.controller.verify
    )

    this.router.post(
      '/refresh',
      authentication,
      validator(refreshToken),
      this.controller.refresh
    )

    this.router.get(
      '/user',
      this.controller.getUser
    )

    this.router.get(
      '/users',
      authentication,
      this.controller.getUsers
    )

    this.router.delete(
      '/users/:_id',
      authentication,
      this.controller.deleteUser
    )

    this.router.put(
      '/me',
      authentication,
      validator(schema.updateInfo),
      this.controller.updateMe
    )

    // this.router.post(
    //   '/business',
    //   authentication,
    //   // validator(schema.updateInfo),
    //   this.controller.businessDetails
    // )

    this.router.post(
      '/createuser',
      authentication,
      validator(schema.createUser),
      this.controller.createUser
    )

    this.router.post(
      '/create-business-user',
      authentication,
      // validator(schema.createUser),
      this.controller.createUserBusiness
    )


    this.router.get(
      '/business-instructors',
      authentication,
      this.controller.getBusinessInstructors
    )

    this.router.get(
      '/instructor',
      authentication,
      this.controller.createdByExist
    )

    this.router.get(
      '/users/name',
      authentication,
      // validator(GetSameBusinessUsersByNameDropdownQueryValidationSchema),
      this.controller.getSameBusinessUsersByNameDropdown
    )
    // passport.serializeUser((user, done) => done(null, user));
    // passport.deserializeUser((user, done) => done(null, user));

    // this.router.use('/auth', passport.initialize());
    // this.router.use('/auth', passport.session());

    // ========================================================================================
    // ========================================================================================
    // ========================================================================================
    // passport.use(
    //   new FacebookStrategy({
    //     clientID: facebook_auth.clientID,
    //     clientSecret: facebook_auth.clientSecret,
    //     callbackURL: facebook_auth.callbackURL
    //   },
    //     function (accessToken: any, refreshToken: any, profile: any, done: any) {
    //       console.log("================================================", profile)
    //       return done(null, profile);
    //     })
    // );

    // this.router.use('/auth/facebook', cookieSession({
    //   name: 'facebook-auth-session',
    //   keys: ['key1', 'key2']
    // }))

    // this.router.get('/auth/facebook', passport.authenticate('facebook')); // http://localhost:5000/api/v1/auth/facebook
    // this.router.get('/auth/facebook/callback',
    //   passport.authenticate('facebook', {
    //     successRedirect: '/auth/facebook/success',
    //     failureRedirect: '/auth/facebook/failure'
    //   }),
    //   function (req, res) {
    //     res.send('facebook');
    //   }
    // );

    // ========================================================================================
    // ========================================================================================
    // ========================================================================================
    this.router.get('/auth/google/success', this.controller.loginSuccess);
    this.router.get('/auth/google/failure', (req, res) => res.send("failure"));

    passport.use(
      new GoogleStrategy({
        clientID: google_auth.clientID,
        clientSecret: google_auth.clientSecret,
        callbackURL: google_auth.callbackURL,
        passReqToCallback: true
      },
        this.controller.signupWithGoogle
      )
    );

    passport.serializeUser(function (user, cb) {
      process.nextTick(function () {
        cb(null, user);
      });
    });

    passport.deserializeUser(function (user, cb) {
      process.nextTick(function () {
        // @ts-ignore
        return cb(null, user);
      });
    });

    this.router.get('/auth/google', // http://localhost:5000/api/v1/auth/google
      passport.authenticate('google', {
        scope: ['email', 'profile']
      })
    );

    this.router.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/api/v1/auth/google/success',
        failureRedirect: '/api/v1/auth/google/failure'
      }),
      function (req, res) {
        res.redirect('/api/v1/auth/google/success')
      }
    );

    // ========================================================================================
    // ========================================================================================
    // ========================================================================================
    // this.router.get(
    //   '/auth/telegram',
    //   (req, res) => res.sendFile(__dirname + '/view/telegram.html')
    // );

    // this.router.get('/auth/telegram/callback',
    //   this.controller.signupWithTelegram
    // );

    // ========================================================================================
    // ========================================================================================
    // ========================================================================================

  }

}
