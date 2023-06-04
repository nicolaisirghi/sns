import { v4 as uuid } from "uuid";
import { authServiceInstance as authService } from "../Services/authService.js";
import { MailServiceInstance as mailService } from "../Services/mailService.js";
import { tokenServiceInstance as tokenService } from "../Services/tokenService.js";
import MailsModel from "../Models/MailActivations.js";
import { generateCaptcha } from "../Utils/Captcha/generateCaptcha.js";
import Tokens from "../Models/Tokens.js";
import users from "../Models/Users.js";
import Users from "../Models/Users.js";
import { isValidObjectID } from "../Utils/Mongoose/checkValidID.js";
import followers from "../Models/Followers.js";
import { promise } from "bcrypt/promises.js";
import Followers from "../Models/Followers.js";

class AuthController {
  constructor() {
    this.verifyCaptcha = this.verifyCaptcha.bind(this);
    this.login = this.login.bind(this);
  }

  getCaptcha(req, res) {
    if (!req.session.captchaCounter) {
      req.session.captchaCounter = 1;
    } else {
      if (req.session.captchaCounter === 3) {
        let isCaptchaVerified;
        if (req.body.captcha) {
          isCaptchaVerified = this.verifyCaptcha(req, res);
        }
        if (isCaptchaVerified) {
          req.session.captchaCounter = 1;
          req.session.captcha = null;
          let err;
          if (req.error) {
            err = req.error.message;
          }
          return {
            code: !err ? 200 : 400,
            err,
          };
        } else {
          const { captcha, imgData } = generateCaptcha();
          req.session.captcha = captcha;
          const err = [
            {
              message:
                isCaptchaVerified === false
                  ? "Wrong captcha !"
                  : "Captcha required ! ",
            },
          ];
          if (req.error) err.push({ message: req.error.message });
          return {
            err,
            code: 401,
            captcha: imgData,
          };
        }
      } else {
        req.session.captchaCounter++;
      }
    }
  }

  verifyCaptcha(req, _) {
    const captchaRequest = req.body.captcha;
    if (!captchaRequest) throw new Error("Error, not captcha in your request");
    return captchaRequest === req.session.captcha;
  }

  async registration(req, res, next) {
    try {
      const { registrationData } = req.body;
      const userData = await authService.registration(registrationData);
      const accessLink = uuid();
      const verificationURL = `${process.env.API_URL}/verification/${accessLink}`;
      await mailService.sendActivationMail(
        userData.user.email,
        verificationURL
      );
      await new MailsModel({ user: userData.user.id, link: accessLink }).save();
      req.session.refreshToken = userData.refreshToken;
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const user = req.query.username ?? req.username;

      const [userInfo, followersInfo] = await Promise.all([
        Users.findOne({ username: user }, { _id: 0, password: 0 }),
        Followers.findOne({ user }, { _id: 0, password: 0 }),
      ]);

      if (!userInfo) throw new Error("Not user!");

      const followers = followersInfo?.followers ?? [];
      const followedByMe = followersInfo?.followPeople ?? [];
      const planUserInfo = userInfo.toObject();
      const userData = {
        ...planUserInfo,
        followers: followers.length,
        followedByMe: followedByMe.length,
      };
      return res.json({
        userData,
      });
    } catch (e) {
      next(e);
    }
  }
  async getMe(req, res, next) {
    try {
      const currentUser = req.user;
      const [userInfo, folowersInfo] = await Promise.all([
        users.findById(currentUser, { password: 0 }),
        followers.findOne({ user: currentUser }),
      ]);
      const planUserInfo = userInfo.toObject();
      if (folowersInfo) {
        const followers = folowersInfo?.followers;
        const followedByMe = folowersInfo.followPeople;
        return res.json({
          ...planUserInfo,
          followers: followers.length,
          followedByMe: followedByMe.length,
        });
      }
      return res.json(planUserInfo);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.session;
      if (!refreshToken) throw new Error("Not refresh token in session !");
      const token = await authService.refresh(refreshToken);
      res.status(200).json(token);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      await Tokens.remove({ refreshToken: req.session.refreshToken });
      req.session.refreshToken = null;
      req.user = null;
      res.status(200).json({
        message: "You are logout",
      });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);
      if (
        userData &&
        !req.session.captcha &&
        req.session.captchaCounter !== 3
      ) {
        req.session.refreshToken = userData.refreshToken;
        return res.json(userData);
      } else {
        const response = this.getCaptcha(req, res);

        if (response.code === 200) {
          return res.json(userData);
        }
        res.status(400).json({ err: response.err });
      }
    } catch (err) {
      req.error = err;
      const resInfo = this.getCaptcha(req, res);

      if (!resInfo) next(err);
      else {
        res.status(resInfo.code).json({ resInfo });
      }
    }
  }

  async checkToken(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(" ")[1];
      const userData = tokenService.validateAccessToken(accessToken);
      return res.status(200).json({ userData });
    } catch (e) {
      next(e);
    }
  }

  async activateMail(req, res, next) {
    try {
      const activationLink = req.params.activationLink;
      if (!activationLink) {
        throw new Error("Error, not verification link");
      }
      const mailCandidate = await MailsModel.findOne({ link: activationLink });
      if (!mailCandidate) {
        throw new Error("Wrong link!");
      }
      mailCandidate.isActivated = true;
      await mailCandidate.save();
      res.status(200).send("The email was activated with success!");
    } catch (e) {
      next(e);
    }
  }
}

export const authControllerInstance = new AuthController();
